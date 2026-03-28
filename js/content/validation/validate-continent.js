function sameMembers(left, right) {
  if (left.length !== right.length) {
    return false
  }

  const rightSet = new Set(right)

  return left.every((item) => rightSet.has(item))
}

export function validateContinent(continent, cityIds) {
  const errors = []
  const warnings = []

  if (!continent.id) {
    errors.push('Continent is missing id')
  }

  const hasRuntimeCityOrder = Array.isArray(continent.cityIds) && continent.cityIds.length > 0
  const hasUnlockOrder = Array.isArray(continent.unlockOrder) && continent.unlockOrder.length > 0

  if (hasRuntimeCityOrder && hasUnlockOrder && !sameMembers(continent.cityIds, continent.unlockOrder)) {
    errors.push(`Continent "${continent.id}" cityIds and unlockOrder must contain the same cities`)
  }

  for (const cityId of continent.cityIds ?? []) {
    if (!cityIds.has(cityId)) {
      errors.push(`Continent "${continent.id}" references unknown city "${cityId}"`)
    }
  }

  if (hasRuntimeCityOrder && !hasUnlockOrder) {
    errors.push(`Continent "${continent.id}" must declare unlockOrder when cityIds are present`)
  }

  if (hasUnlockOrder && !hasRuntimeCityOrder) {
    errors.push(`Continent "${continent.id}" must declare cityIds when unlockOrder is present`)
  }

  if (continent.bundle && !continent.bundle.packId) {
    warnings.push(`Continent "${continent.id}" has no bundle packId`)
  }

  return { errors, warnings }
}

export default validateContinent
