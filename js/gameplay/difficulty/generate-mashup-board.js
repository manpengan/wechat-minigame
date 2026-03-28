import { generateBoardFromDefinition } from './generate-board.js'
import { createRng, shuffleWithRng } from './random.js'

function createMashupLevelPreset(elementCount) {
  return {
    id: 1,
    seedBase: 31001,
    elementCount,
    piecesPerElement: Array.from({ length: elementCount }, () => 3),
    layers: 4,
    density: 'medium_high',
  }
}

function getSourceCities(cityIds, contentSystem) {
  return cityIds
    .map((cityId) => contentSystem.getCity(cityId))
    .filter(Boolean)
}

function createCityElementPools(cities, rng) {
  return cities.map((city) => ({
    cityId: city.id,
    cursor: 0,
    elements: shuffleWithRng(
      city.elements.map((element) => ({
        ...element,
        sourceCityId: city.id,
        sourceCityName: city.display.name,
      })),
      rng,
    ),
  }))
}

function pickMashupElements(cities, targetCount, rng) {
  const pools = createCityElementPools(cities, rng)
  const selected = []

  while (selected.length < targetCount) {
    let didAdd = false

    for (const pool of pools) {
      const element = pool.elements[pool.cursor]
      if (!element) {
        continue
      }

      selected.push(element)
      pool.cursor += 1
      didAdd = true

      if (selected.length === targetCount) {
        break
      }
    }

    if (!didAdd) {
      break
    }
  }

  return selected
}

export function generateMashupBoard({ cityIds, seed, contentSystem }) {
  const cities = getSourceCities(cityIds, contentSystem)

  if (cities.length === 0) {
    throw new Error('Mashup mode requires at least one source city')
  }

  const effectiveSeed = seed ?? 31001
  const rng = createRng(effectiveSeed)
  const maxElementCount = cities.reduce((sum, city) => sum + city.elements.length, 0)
  const elementCount = Math.min(8, maxElementCount)
  const levelPreset = createMashupLevelPreset(elementCount)
  const selectedElements = pickMashupElements(cities, elementCount, rng)

  return generateBoardFromDefinition({
    boardId: `mashup-${effectiveSeed}`,
    cityId: 'mashup',
    levelId: 1,
    seed: effectiveSeed,
    elements: selectedElements,
    levelPreset,
    extraState: {
      sourceCityIds: cities.map((city) => city.id),
      elementDefinitions: selectedElements.map((element) => ({
        elementId: element.id,
        name: element.name,
        sourceCityId: element.sourceCityId,
        sourceCityName: element.sourceCityName,
      })),
    },
  })
}

export default generateMashupBoard
