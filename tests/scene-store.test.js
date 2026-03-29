import test from 'node:test'
import assert from 'node:assert/strict'

import { createContentSystem, createDefaultPlayerState } from '../js/content/index.js'
import { createSceneStore } from '../js/ui/scene-store.js'

test('scene store starts on the home selection page', () => {
  const contentSystem = createContentSystem()
  const playerState = createDefaultPlayerState()
  const sceneStore = createSceneStore({ contentSystem, playerState })

  assert.equal(sceneStore.getScene().type, 'home-select')
})

test('scene store opens level selection for unlocked city and returns back', () => {
  const contentSystem = createContentSystem()
  const playerState = createDefaultPlayerState()
  const sceneStore = createSceneStore({ contentSystem, playerState })

  const openedHome = sceneStore.openHomeTile('asia')
  const opened = sceneStore.openCity('beijing')

  assert.equal(openedHome.opened, true)
  assert.equal(opened, true)
  assert.equal(sceneStore.getScene().type, 'level-select')
  assert.equal(sceneStore.getScene().cityId, 'beijing')

  sceneStore.goBack()

  assert.equal(sceneStore.getScene().type, 'city-select')
})

test('scene store opens gameplay scene from a valid level', () => {
  const contentSystem = createContentSystem()
  const playerState = createDefaultPlayerState()
  const sceneStore = createSceneStore({ contentSystem, playerState })

  sceneStore.openHomeTile('asia')
  sceneStore.openCity('beijing')
  const opened = sceneStore.openLevel('beijing', 1)

  assert.equal(opened, true)
  assert.equal(sceneStore.getScene().type, 'gameplay')
  assert.equal(sceneStore.getScene().session.cityId, 'beijing')
  assert.equal(sceneStore.getScene().session.levelId, 1)
})

test('scene store awards magnets, stamps, and unlocks the next city on completion', () => {
  const contentSystem = createContentSystem()
  const playerState = createDefaultPlayerState()
  const sceneStore = createSceneStore({
    contentSystem,
    playerState,
    now: () => new Date('2026-03-28T12:00:00.000Z').getTime(),
  })

  sceneStore.completeLevel({
    cityId: 'beijing',
    levelId: 1,
    stars: 3,
  })

  assert.deepEqual(playerState.collectedMagnets, [
    {
      magnetId: 'magnet_beijing_1',
      cityId: 'beijing',
      levelId: 1,
      acquiredDate: '2026-03-28T12:00:00.000Z',
    },
  ])

  for (let levelId = 2; levelId <= 6; levelId += 1) {
    sceneStore.completeLevel({
      cityId: 'beijing',
      levelId,
      stars: 3,
    })
  }

  assert.equal(playerState.collectedCats.includes('beijing'), true)
  assert.equal(playerState.passportStamps.includes('beijing'), true)
  assert.equal(playerState.unlockedCities.includes('tokyo'), true)
  assert.deepEqual(playerState.collectedStamps, [
    {
      stampId: 'stamp_beijing',
      cityId: 'beijing',
      acquiredDate: '2026-03-28T12:00:00.000Z',
    },
  ])
})

test('scene store reports locked and placeholder home tiles without leaving the home scene', () => {
  const contentSystem = createContentSystem()
  const playerState = createDefaultPlayerState()
  const sceneStore = createSceneStore({ contentSystem, playerState })

  const locked = sceneStore.openHomeTile('europe')
  const soon = sceneStore.openHomeTile('coming_soon')

  assert.deepEqual(locked, { opened: false, reason: 'locked' })
  assert.deepEqual(soon, { opened: false, reason: 'coming-soon' })
  assert.equal(sceneStore.getScene().type, 'home-select')
})

test('scene store opens the gift zone and switches between MVP tabs', () => {
  const contentSystem = createContentSystem()
  const playerState = createDefaultPlayerState()
  const sceneStore = createSceneStore({ contentSystem, playerState })

  const opened = sceneStore.openGiftZone()

  assert.equal(opened, true)
  assert.equal(sceneStore.getScene().type, 'gift-zone')
  assert.equal(sceneStore.getScene().selectedTab, 'magnets')

  const switched = sceneStore.selectGiftTab('stamps')

  assert.equal(switched, true)
  assert.equal(sceneStore.getScene().selectedTab, 'stamps')

  const switchedToCats = sceneStore.selectGiftTab('cats')

  assert.equal(switchedToCats, true)
  assert.equal(sceneStore.getScene().selectedTab, 'cats')

  sceneStore.goBack()

  assert.equal(sceneStore.getScene().type, 'home-select')
})

test('scene store opens city team selection and locks the first chosen team', () => {
  const contentSystem = createContentSystem()
  const playerState = createDefaultPlayerState()
  const sceneStore = createSceneStore({
    contentSystem,
    playerState,
    now: () => new Date('2026-03-29T08:00:00.000Z').getTime(),
  })

  const opened = sceneStore.openCityTeamSelect()

  assert.equal(opened, true)
  assert.equal(sceneStore.getScene().type, 'city-team-select')
  assert.deepEqual(sceneStore.getScene().options.map((entry) => entry.cityId), ['beijing'])

  const selected = sceneStore.chooseCityTeam('beijing')

  assert.equal(selected, true)
  assert.deepEqual(playerState.cityTeam, {
    teamCityId: 'beijing',
    joinedDate: '2026-03-29T08:00:00.000Z',
    lastSwitchDate: null,
  })
  assert.equal(sceneStore.getScene().type, 'home-select')

  sceneStore.openCityTeamSelect()
  const reselected = sceneStore.chooseCityTeam('beijing')

  assert.equal(reselected, false)
  assert.equal(playerState.cityTeam.teamCityId, 'beijing')
})

test('scene store opens mashup gameplay after two completed cities', () => {
  const contentSystem = createContentSystem()
  const playerState = createDefaultPlayerState()
  const sceneStore = createSceneStore({
    contentSystem,
    playerState,
    now: () => 33001,
  })

  playerState.unlockedCities.push('tokyo')
  playerState.levelProgress.beijing = {
    1: { completed: true, stars: 3 },
    2: { completed: true, stars: 3 },
    3: { completed: true, stars: 3 },
    4: { completed: true, stars: 3 },
    5: { completed: true, stars: 3 },
    6: { completed: true, stars: 3 },
  }
  playerState.levelProgress.tokyo = {
    1: { completed: true, stars: 3 },
    2: { completed: true, stars: 3 },
    3: { completed: true, stars: 3 },
    4: { completed: true, stars: 3 },
    5: { completed: true, stars: 3 },
    6: { completed: true, stars: 3 },
  }

  const opened = sceneStore.openHomeTile('mashup')

  assert.deepEqual(opened, { opened: true })
  assert.equal(sceneStore.getScene().type, 'gameplay')
  assert.equal(sceneStore.getScene().mode, 'mashup')
  assert.deepEqual(sceneStore.getScene().sourceCityIds, ['beijing', 'tokyo'])
})

test('scene store awards a deterministic local mashup reward', () => {
  const contentSystem = createContentSystem()
  const playerState = createDefaultPlayerState()
  const sceneStore = createSceneStore({
    contentSystem,
    playerState,
    now: () => 33001,
  })

  playerState.unlockedCities.push('tokyo')
  playerState.levelProgress.beijing = {
    1: { completed: true, stars: 3 },
    2: { completed: true, stars: 3 },
    3: { completed: true, stars: 3 },
    4: { completed: true, stars: 3 },
    5: { completed: true, stars: 3 },
    6: { completed: true, stars: 3 },
  }
  playerState.levelProgress.tokyo = {
    1: { completed: true, stars: 3 },
    2: { completed: true, stars: 3 },
    3: { completed: true, stars: 3 },
    4: { completed: true, stars: 3 },
    5: { completed: true, stars: 3 },
    6: { completed: true, stars: 3 },
  }

  sceneStore.openHomeTile('mashup')
  const reward = sceneStore.completeGameplayVictory()

  assert.deepEqual(reward, {
    type: 'magnet',
    magnetId: 'magnet_beijing_2',
    cityId: 'beijing',
    levelId: 2,
  })
  assert.deepEqual(playerState.collectedMagnets, [
    {
      magnetId: 'magnet_beijing_2',
      cityId: 'beijing',
      levelId: 2,
      acquiredDate: '1970-01-01T00:00:33.001Z',
    },
  ])
})
