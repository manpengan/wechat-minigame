import { createGameSession } from '../gameplay/session/index.js'
import { generateMashupBoard } from '../gameplay/difficulty/index.js'

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

function createCityTeamSelectScene(options, selectedTeamCityId) {
  return {
    type: 'city-team-select',
    options,
    selectedTeamCityId,
  }
}

function createGameplayScene({
  cityId,
  levelId,
  session,
  mode = 'city',
  title = null,
  subtitle = null,
  accentColor = null,
  sourceCityIds = [],
  elementDefinitions = [],
  rewardSummary = null,
}) {
  return {
    type: 'gameplay',
    cityId,
    levelId,
    session,
    mode,
    title,
    subtitle,
    accentColor,
    sourceCityIds,
    elementDefinitions,
    rewardSummary,
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

function createCityTeamOptions(contentSystem, playerState) {
  return playerState.unlockedCities
    .map((cityId) => {
      const city = contentSystem.getCity(cityId)
      if (!city) {
        return null
      }

      return {
        cityId: city.id,
        cityName: city.display.name,
        catName: city.cat.name,
        themeColor: city.display.bgColor,
      }
    })
    .filter(Boolean)
}

function createMashupRewardCandidates(contentSystem, playerState) {
  return playerState.unlockedCities
    .map((cityId) => contentSystem.getCity(cityId))
    .filter(Boolean)
    .flatMap((city) => city.levelPresets.map((preset) => ({
      magnetId: `magnet_${city.id}_${preset.id}`,
      cityId: city.id,
      levelId: preset.id,
    })))
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

function awardMashupReward(contentSystem, playerState, seed, now) {
  const rewardCandidates = createMashupRewardCandidates(contentSystem, playerState)
  const magnets = ensureCollection(playerState, 'collectedMagnets')

  if (rewardCandidates.length === 0) {
    playerState.inventory.shuffle = (playerState.inventory.shuffle ?? 0) + 1
    return {
      type: 'inventory',
      itemId: 'shuffle',
      amount: 1,
    }
  }

  const reward = rewardCandidates[seed % rewardCandidates.length]

  if (magnets.some((entry) => entry.magnetId === reward.magnetId)) {
    playerState.inventory.shuffle = (playerState.inventory.shuffle ?? 0) + 1
    return {
      type: 'inventory',
      itemId: 'shuffle',
      amount: 1,
    }
  }

  magnets.push({
    ...reward,
    acquiredDate: createAcquiredDate(now),
  })

  return {
    type: 'magnet',
    ...reward,
  }
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

  function createMashupSession(seed = now()) {
    const boardState = generateMashupBoard({
      cityIds: playerState.unlockedCities,
      seed,
      contentSystem,
    })

    return createGameSession({
      cityId: 'mashup',
      levelId: 1,
      seed,
      contentSystem,
      boardState,
      restartFactory: (nextSeed) => createMashupSession(nextSeed),
    })
  }

  function createMashupGameplayScene(seed = now()) {
    const session = createMashupSession(seed)
    const boardState = session.getBoardState()

    return createGameplayScene({
      cityId: 'mashup',
      levelId: 1,
      session,
      mode: 'mashup',
      title: '主题大混战',
      subtitle: `${boardState.sourceCityIds.length} 城混搭`,
      accentColor: '#E74C3C',
      sourceCityIds: boardState.sourceCityIds ?? [],
      elementDefinitions: boardState.elementDefinitions ?? [],
    })
  }

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
      history.push(currentScene)
      currentScene = createMashupGameplayScene()
      return { opened: true }
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

    if (!['magnets', 'stamps', 'cats'].includes(tabId)) {
      return false
    }

    currentScene = {
      ...currentScene,
      selectedTab: tabId,
    }

    return true
  }

  function openCityTeamSelect() {
    history.push(currentScene)
    currentScene = createCityTeamSelectScene(
      createCityTeamOptions(contentSystem, playerState),
      playerState.cityTeam?.teamCityId ?? null,
    )

    return true
  }

  function chooseCityTeam(cityId) {
    if (currentScene.type !== 'city-team-select') {
      return false
    }

    if (playerState.cityTeam?.teamCityId) {
      return false
    }

    if (!playerState.unlockedCities.includes(cityId)) {
      return false
    }

    playerState.cityTeam = {
      ...playerState.cityTeam,
      teamCityId: cityId,
      joinedDate: createAcquiredDate(now),
      lastSwitchDate: null,
    }

    currentScene = history.pop() ?? createHomeSelectScene()
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
    currentScene = createGameplayScene({
      cityId,
      levelId,
      session: createGameSession({
        cityId,
        levelId,
        contentSystem,
      }),
    })

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

  function completeGameplayVictory(stars = 3) {
    if (currentScene.type !== 'gameplay') {
      return null
    }

    if (currentScene.mode === 'mashup') {
      const reward = awardMashupReward(contentSystem, playerState, currentScene.session.seed, now)
      currentScene = {
        ...currentScene,
        rewardSummary: reward,
      }
      return reward
    }

    completeLevel({
      cityId: currentScene.cityId,
      levelId: currentScene.levelId,
      stars,
    })

    return {
      type: 'city',
      cityId: currentScene.cityId,
      levelId: currentScene.levelId,
    }
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
    openCityTeamSelect,
    chooseCityTeam,
    openLevel,
    completeLevel,
    completeGameplayVictory,
    restartCurrentLevel,
    goBack,
  }
}

export default createSceneStore
