import { createGameSession } from '../gameplay/session/index.js'

function createHomeSelectScene() {
  return {
    type: 'home-select',
  }
}

function createCitySelectScene() {
  return {
    type: 'city-select',
    continentId: 'asia',
  }
}

function createGiftZoneScene(selectedTab = 'magnets') {
  return {
    type: 'gift-zone',
    selectedTab,
  }
}

function createLevelProgress(city, playerState) {
  const cityProgress = playerState.levelProgress[city.id] ?? {}

  return city.levelPresets.map((preset) => {
    const levelState = cityProgress[preset.id] ?? null
    const previousLevel = preset.id - 1
    const previousCompleted = previousLevel <= 0 || cityProgress[previousLevel]?.completed === true

    return {
      levelId: preset.id,
      isUnlocked: previousCompleted,
      isCompleted: levelState?.completed === true,
      stars: levelState?.stars ?? 0,
    }
  })
}

function ensureCityProgress(playerState, cityId) {
  if (!playerState.levelProgress[cityId]) {
    playerState.levelProgress[cityId] = {}
  }

  return playerState.levelProgress[cityId]
}

function ensureCollection(playerState, key) {
  if (!Array.isArray(playerState[key])) {
    playerState[key] = []
  }

  return playerState[key]
}

function createAcquiredDate(now) {
  return new Date(now()).toISOString()
}

function awardLevelMagnet(playerState, cityId, levelId, now) {
  const magnets = ensureCollection(playerState, 'collectedMagnets')
  const magnetId = `magnet_${cityId}_${levelId}`

  if (magnets.some((entry) => entry.magnetId === magnetId)) {
    return
  }

  magnets.push({
    magnetId,
    cityId,
    levelId,
    acquiredDate: createAcquiredDate(now),
  })
}

function markCityCompletion(contentSystem, playerState, cityId, now) {
  if (!playerState.collectedCats.includes(cityId)) {
    playerState.collectedCats.push(cityId)
  }

  if (!playerState.passportStamps.includes(cityId)) {
    playerState.passportStamps.push(cityId)
  }

  const city = contentSystem.getCity(cityId)
  const stamps = ensureCollection(playerState, 'collectedStamps')
  const stampId = city?.passport?.stampId ?? `stamp_${cityId}`

  if (!stamps.some((entry) => entry.stampId === stampId)) {
    stamps.push({
      stampId,
      cityId,
      acquiredDate: createAcquiredDate(now),
    })
  }

  const nextCityId = city?.unlockAfterCityId

  if (nextCityId && !playerState.unlockedCities.includes(nextCityId)) {
    playerState.unlockedCities.push(nextCityId)
  }
}

export function createSceneStore({ contentSystem, playerState, now = () => Date.now() }) {
  const history = []
  let currentScene = createHomeSelectScene()

  function getScene() {
    return currentScene
  }

  function openHomeTile(tileId) {
    const tile = contentSystem.getHomeTile(tileId, playerState)
    if (!tile) {
      return { opened: false, reason: 'missing' }
    }

    if (tile.id === 'coming_soon') {
      return { opened: false, reason: 'coming-soon' }
    }

    if (!tile.isUnlocked) {
      return { opened: false, reason: 'locked' }
    }

    if (tile.id === 'asia') {
      history.push(currentScene)
      currentScene = createCitySelectScene()
      return { opened: true }
    }

    if (tile.id === 'mashup') {
      return { opened: false, reason: 'mode-unavailable' }
    }

    return { opened: false, reason: 'unavailable' }
  }

  function openCity(cityId) {
    if (!playerState.unlockedCities.includes(cityId)) {
      return false
    }

    const city = contentSystem.getCity(cityId)
    if (!city) {
      return false
    }

    history.push(currentScene)
    currentScene = {
      type: 'level-select',
      cityId,
      levels: createLevelProgress(city, playerState),
    }

    return true
  }

  function openGiftZone(initialTab = 'magnets') {
    history.push(currentScene)
    currentScene = createGiftZoneScene(initialTab)
    return true
  }

  function selectGiftTab(tabId) {
    if (currentScene.type !== 'gift-zone') {
      return false
    }

    if (!['magnets', 'stamps'].includes(tabId)) {
      return false
    }

    currentScene = {
      ...currentScene,
      selectedTab: tabId,
    }

    return true
  }

  function openLevel(cityId, levelId) {
    if (!playerState.unlockedCities.includes(cityId)) {
      return false
    }

    const city = contentSystem.getCity(cityId)
    if (!city) {
      return false
    }

    const levelCards = createLevelProgress(city, playerState)
    const targetLevel = levelCards.find((level) => level.levelId === levelId)

    if (!targetLevel || !targetLevel.isUnlocked) {
      return false
    }

    history.push(currentScene)
    currentScene = {
      type: 'gameplay',
      cityId,
      levelId,
      session: createGameSession({
        cityId,
        levelId,
        contentSystem,
      }),
    }

    return true
  }

  function completeLevel({ cityId, levelId, stars = 3 }) {
    const city = contentSystem.getCity(cityId)
    if (!city) {
      return false
    }

    const cityProgress = ensureCityProgress(playerState, cityId)
    awardLevelMagnet(playerState, cityId, levelId, now)
    cityProgress[levelId] = {
      ...(cityProgress[levelId] ?? {}),
      completed: true,
      stars: Math.max(cityProgress[levelId]?.stars ?? 0, stars),
    }

    const allLevelsCompleted = city.levelPresets.every((preset) => cityProgress[preset.id]?.completed === true)
    if (allLevelsCompleted) {
      markCityCompletion(contentSystem, playerState, cityId, now)
    }

    return true
  }

  function restartCurrentLevel() {
    if (currentScene.type !== 'gameplay') {
      return false
    }

    currentScene = {
      ...currentScene,
      session: currentScene.session.restart(),
    }

    return true
  }

  function goBack() {
    if (history.length === 0) {
      currentScene = createHomeSelectScene()
      return currentScene
    }

    currentScene = history.pop()

    if (currentScene.type === 'level-select') {
      const city = contentSystem.getCity(currentScene.cityId)
      currentScene = {
        ...currentScene,
        levels: createLevelProgress(city, playerState),
      }
    }

    return currentScene
  }

  return {
    getScene,
    getPlayerState() {
      return playerState
    },
    openHomeTile,
    openCity,
    openGiftZone,
    selectGiftTab,
    openLevel,
    completeLevel,
    restartCurrentLevel,
    goBack,
  }
}

export default createSceneStore
