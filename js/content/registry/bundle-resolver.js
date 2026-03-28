export function createBundleResolver(cityRegistry) {
  return {
    resolveCityBundle(cityId) {
      const city = cityRegistry.getCity(cityId)

      return city ? city.bundle : null
    },
    ensureCityBundle(cityId) {
      const bundle = this.resolveCityBundle(cityId)

      if (!bundle) {
        return null
      }

      return {
        cityId,
        ...bundle,
        status: 'ready',
      }
    },
  }
}

export default createBundleResolver
