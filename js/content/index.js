import { continents } from './continents/index.js'
import cities from './cities/index.js'
import { createDefaultPlayerState } from './default-player-state.js'
import { getCatalogChildren } from './navigation/world-catalog.js'
import { getEnabledRoots, getNavNode as getRuntimeNavNode } from './navigation/runtime-nav.js'
import { createBundleResolver } from './registry/bundle-resolver.js'
import { createCityRegistry } from './registry/city-registry.js'
import { createContinentRegistry } from './registry/continent-registry.js'
import { projectCityCardView, projectCityProgress } from './registry/progress-projector.js'
import { validateAssets } from './validation/validate-assets.js'
import { validateCity } from './validation/validate-city.js'
import { validateContinent } from './validation/validate-continent.js'

export function validateContent(options = {}) {
  const continentIds = new Set(continents.map((continent) => continent.id))
  const cityIds = new Set(cities.map((city) => city.id))
  const errors = []
  const warnings = []

  for (const continent of continents) {
    const result = validateContinent(continent, cityIds)
    errors.push(...result.errors)
    warnings.push(...result.warnings)
  }

  for (const city of cities) {
    const result = validateCity(city, continentIds, cityIds)
    errors.push(...result.errors)
    warnings.push(...result.warnings)

    const assetResult = validateAssets(city, options.assetExists)
    errors.push(...assetResult.errors)
    warnings.push(...assetResult.warnings)
  }

  return { errors, warnings }
}

export function createContentSystem() {
  const continentRegistry = createContinentRegistry(continents)
  const cityRegistry = createCityRegistry(cities)
  const bundleResolver = createBundleResolver(cityRegistry)
  const homeRootNodes = getCatalogChildren(null)
  const giftAlbumDefinitions = [
    { id: 'magnets', name: '冰箱贴册' },
    { id: 'stamps', name: '邮票册' },
  ]

  function getCompletedCityCount(playerState) {
    return cityRegistry
      .getAllCities()
      .filter((city) => projectCityProgress(city, playerState).isCompleted)
      .length
  }

  function projectNavNode(node) {
    if (!node) {
      return null
    }

    return {
      ...node,
      isUnlocked: node.isUnlockedByDefault,
    }
  }

  function projectHomeTile(node, playerState) {
    const completedCityCount = getCompletedCityCount(playerState)
    const isMashupTile = node.id === 'mashup'
    const isComingSoonTile = node.id === 'coming_soon'
    const isUnlocked = isMashupTile
      ? completedCityCount >= 2
      : node.status === 'active' && node.isUnlockedByDefault
    const isInteractive = isComingSoonTile || isMashupTile || node.type === 'continent'

    return {
      ...node,
      isUnlocked,
      isInteractive,
      isSpecial: isMashupTile || isComingSoonTile,
    }
  }

  function getMagnetEntries(playerState) {
    const magnets = playerState.collectedMagnets ?? []

    return cityRegistry.getAllCities().map((city) => {
      const collectedCount = magnets.filter((entry) => entry.cityId === city.id).length

      return {
        cityId: city.id,
        cityName: city.display.name,
        cityNameEn: city.display.nameEn,
        themeColor: city.display.bgColor,
        collectedCount,
        totalCount: city.levelPresets.length,
      }
    })
  }

  function getStampEntries(playerState) {
    const stamps = playerState.collectedStamps ?? []

    return cityRegistry.getAllCities().map((city) => {
      const stampId = city.passport?.stampId ?? `stamp_${city.id}`

      return {
        cityId: city.id,
        cityName: city.display.name,
        cityNameEn: city.display.nameEn,
        themeColor: city.display.bgColor,
        stampId,
        isCollected: stamps.some((entry) => entry.stampId === stampId),
      }
    })
  }

  function getGiftAlbumEntries(albumId, playerState) {
    if (albumId === 'magnets') {
      return getMagnetEntries(playerState)
    }

    if (albumId === 'stamps') {
      return getStampEntries(playerState)
    }

    return []
  }

  function getGiftAlbums(playerState) {
    return giftAlbumDefinitions.map((definition) => {
      const entries = getGiftAlbumEntries(definition.id, playerState)
      const collectedCount = definition.id === 'magnets'
        ? entries.reduce((sum, entry) => sum + entry.collectedCount, 0)
        : entries.filter((entry) => entry.isCollected).length
      const totalCount = definition.id === 'magnets'
        ? entries.reduce((sum, entry) => sum + entry.totalCount, 0)
        : entries.length

      return {
        ...definition,
        collectedCount,
        totalCount,
      }
    })
  }

  function projectCityNavEntry(cityId, parentId, playerState) {
    const city = cityRegistry.getCity(cityId)
    if (!city) {
      return null
    }

    return {
      ...projectCityCardView(city, playerState),
      id: city.id,
      type: 'city',
      parentId,
      themeColor: city.display.bgColor,
      childType: null,
      childIds: [],
      pageSize: 0,
      status: 'active',
      isUnlockedByDefault: cityId === 'beijing',
      sortOrder: city.sortOrder,
    }
  }

  function getNavChildren(nodeId, playerState) {
    const node = getRuntimeNavNode(nodeId)
    if (!node || !node.childType) {
      return []
    }

    if (node.childType === 'city') {
      return node.childIds
        .map((cityId) => projectCityNavEntry(cityId, node.id, playerState))
        .filter(Boolean)
    }

    return node.childIds
      .map((childId) => projectNavNode(getRuntimeNavNode(childId)))
      .filter(Boolean)
  }

  return {
    getContinentList() {
      return continentRegistry.getContinentList()
    },
    getContinent(continentId) {
      return continentRegistry.getContinent(continentId)
    },
    getCity(cityId) {
      return cityRegistry.getCity(cityId)
    },
    listCitiesByContinent(continentId) {
      return cityRegistry.listCitiesByContinent(continentId)
    },
    getLevelPreset(cityId, levelId) {
      return cityRegistry.getLevelPreset(cityId, levelId)
    },
    getCityProgress(cityId, playerState) {
      const city = cityRegistry.getCity(cityId)
      return city ? projectCityProgress(city, playerState) : null
    },
    getCityCardView(cityId, playerState) {
      const city = cityRegistry.getCity(cityId)
      return city ? projectCityCardView(city, playerState) : null
    },
    listCityCards(continentId, playerState) {
      const navChildren = getNavChildren(continentId, playerState)
      if (navChildren.length > 0) {
        return navChildren.filter((entry) => entry.type === 'city')
      }

      return cityRegistry
        .listCitiesByContinent(continentId)
        .map((city) => projectCityCardView(city, playerState))
    },
    getRootNavNodes() {
      return getEnabledRoots().map((node) => projectNavNode(node))
    },
    getHomeTiles(playerState) {
      return homeRootNodes.map((node) => projectHomeTile(node, playerState))
    },
    getHomeTile(tileId, playerState) {
      const node = homeRootNodes.find((entry) => entry.id === tileId) ?? null
      return node ? projectHomeTile(node, playerState) : null
    },
    getGiftAlbums(playerState) {
      return getGiftAlbums(playerState)
    },
    getGiftAlbumEntries(albumId, playerState) {
      return getGiftAlbumEntries(albumId, playerState)
    },
    getNavNode(nodeId) {
      return projectNavNode(getRuntimeNavNode(nodeId))
    },
    getNavChildren(nodeId, playerState) {
      return getNavChildren(nodeId, playerState)
    },
    ensureCityBundle(cityId) {
      return bundleResolver.ensureCityBundle(cityId)
    },
    validateContent(options) {
      return validateContent(options)
    },
  }
}

export {
  continents,
  cities,
  createDefaultPlayerState,
}

export default createContentSystem
