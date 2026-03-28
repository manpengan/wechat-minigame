export function createContinentRegistry(continents) {
  const continentMap = new Map(
    [...continents]
      .sort((left, right) => left.sortOrder - right.sortOrder)
      .map((continent) => [continent.id, continent]),
  )

  return {
    getContinentList() {
      return [...continentMap.values()]
    },
    getContinent(continentId) {
      return continentMap.get(continentId) ?? null
    },
    hasContinent(continentId) {
      return continentMap.has(continentId)
    },
  }
}

export default createContinentRegistry
