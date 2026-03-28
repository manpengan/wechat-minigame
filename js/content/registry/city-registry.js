export function createCityRegistry(cities) {
  const cityMap = new Map(
    [...cities]
      .sort((left, right) => left.sortOrder - right.sortOrder)
      .map((city) => [city.id, city]),
  )

  return {
    getAllCities() {
      return [...cityMap.values()]
    },
    getCity(cityId) {
      return cityMap.get(cityId) ?? null
    },
    listCitiesByContinent(continentId) {
      return [...cityMap.values()].filter((city) => city.continentId === continentId)
    },
    getLevelPreset(cityId, levelId) {
      const city = cityMap.get(cityId)

      if (!city) {
        return null
      }

      return city.levelPresets.find((preset) => preset.id === levelId) ?? null
    },
  }
}

export default createCityRegistry
