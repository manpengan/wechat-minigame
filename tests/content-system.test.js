import test from 'node:test'
import assert from 'node:assert/strict'

import {
  createContentSystem,
  createDefaultPlayerState,
  validateContent,
} from '../js/content/index.js'

test('built-in content validates without errors', () => {
  const result = validateContent()

  assert.equal(result.errors.length, 0)
})

test('content system projects city cards from player state', () => {
  const contentSystem = createContentSystem()
  const playerState = createDefaultPlayerState()

  const beijingCard = contentSystem.getCityCardView('beijing', playerState)
  const tokyoCardBefore = contentSystem.getCityCardView('tokyo', playerState)

  assert.equal(beijingCard.isUnlocked, true)
  assert.equal(beijingCard.isCollected, false)
  assert.equal(tokyoCardBefore.isUnlocked, false)

  playerState.levelProgress.beijing = {
    1: { completed: true, stars: 3 },
    2: { completed: true, stars: 3 },
    3: { completed: true, stars: 3 },
    4: { completed: true, stars: 3 },
    5: { completed: true, stars: 3 },
    6: { completed: true, stars: 3 },
  }
  playerState.unlockedCities.push('tokyo')
  playerState.collectedCats.push('beijing')
  playerState.passportStamps.push('beijing')

  const beijingAfter = contentSystem.getCityCardView('beijing', playerState)
  const tokyoCardAfter = contentSystem.getCityCardView('tokyo', playerState)

  assert.equal(beijingAfter.isCompleted, true)
  assert.equal(beijingAfter.isCollected, true)
  assert.equal(tokyoCardAfter.isUnlocked, true)
})

test('content system exposes runtime navigation roots and city children for the MVP map', () => {
  const contentSystem = createContentSystem()
  const playerState = createDefaultPlayerState()

  const roots = contentSystem.getRootNavNodes()
  const asia = contentSystem.getNavNode('asia')
  const children = contentSystem.getNavChildren('asia', playerState)

  assert.deepEqual(roots.map((node) => node.id), ['asia', 'mashup', 'coming_soon'])
  assert.equal(asia.childType, 'city')
  assert.deepEqual(
    children.map((entry) => entry.id),
    ['beijing', 'tokyo', 'bangkok', 'seoul', 'singapore', 'istanbul'],
  )
  assert.equal(children[0].type, 'city')
  assert.equal(children[0].parentId, 'asia')
  assert.equal(children[0].isUnlocked, true)
  assert.equal(children[1].isUnlocked, false)
})

test('content system exposes nine home tiles and gates mashup behind two completed cities', () => {
  const contentSystem = createContentSystem()
  const playerState = createDefaultPlayerState()

  const initialTiles = contentSystem.getHomeTiles(playerState)

  assert.deepEqual(
    initialTiles.map((tile) => tile.id),
    ['asia', 'europe', 'north_america', 'south_america', 'africa', 'oceania', 'antarctica', 'mashup', 'coming_soon'],
  )
  assert.equal(initialTiles[0].isUnlocked, true)
  assert.equal(initialTiles[1].isUnlocked, false)
  assert.equal(initialTiles[7].isUnlocked, false)
  assert.equal(initialTiles[8].isInteractive, true)

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

  const unlockedTiles = contentSystem.getHomeTiles(playerState)
  const mashupTile = unlockedTiles.find((tile) => tile.id === 'mashup')

  assert.equal(mashupTile.isUnlocked, true)
})

test('default player state includes city team and empty collection albums', () => {
  const playerState = createDefaultPlayerState()

  assert.deepEqual(playerState.cityTeam, {
    teamCityId: null,
    joinedDate: null,
    lastSwitchDate: null,
  })
  assert.deepEqual(playerState.collectedMagnets, [])
  assert.deepEqual(playerState.collectedStamps, [])
})

test('content system summarizes MVP gift albums and per-city progress', () => {
  const contentSystem = createContentSystem()
  const playerState = createDefaultPlayerState()

  playerState.collectedMagnets.push({
    magnetId: 'magnet_beijing_1',
    cityId: 'beijing',
    levelId: 1,
    acquiredDate: '2026-03-29T00:00:00.000Z',
  })
  playerState.collectedStamps.push({
    stampId: 'stamp_beijing',
    cityId: 'beijing',
    acquiredDate: '2026-03-29T00:00:00.000Z',
  })

  const albums = contentSystem.getGiftAlbums(playerState)
  const magnetEntries = contentSystem.getGiftAlbumEntries('magnets', playerState)
  const stampEntries = contentSystem.getGiftAlbumEntries('stamps', playerState)

  assert.deepEqual(albums.map((album) => album.id), ['magnets', 'stamps'])
  assert.deepEqual(albums.map((album) => album.collectedCount), [1, 1])
  assert.deepEqual(albums.map((album) => album.totalCount), [36, 6])
  assert.equal(magnetEntries[0].cityId, 'beijing')
  assert.equal(magnetEntries[0].collectedCount, 1)
  assert.equal(magnetEntries[0].totalCount, 6)
  assert.equal(stampEntries[0].cityId, 'beijing')
  assert.equal(stampEntries[0].isCollected, true)
  assert.equal(stampEntries[1].isCollected, false)
})
