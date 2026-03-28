const CATEGORY_MINIMUMS = {
  landmark: 2,
  food: 3,
  culture: 2,
  item: 2,
  nature: 2,
}

function countCategories(elements) {
  return elements.reduce((counts, element) => {
    counts[element.category] = (counts[element.category] ?? 0) + 1
    return counts
  }, {})
}

function isMultipleOfThree(value) {
  return Number.isInteger(value) && value > 0 && value % 3 === 0
}

export function validateCity(city, continentIds, cityIds) {
  const errors = []
  const warnings = []

  if (!city.id) {
    errors.push('City is missing id')
    return { errors, warnings }
  }

  if (!continentIds.has(city.continentId)) {
    errors.push(`City "${city.id}" references unknown continent "${city.continentId}"`)
  }

  if (!city.display?.name || !city.display?.bgColor) {
    errors.push(`City "${city.id}" is missing display metadata`)
  }

  if (!city.cover?.catImage || !city.cover?.catThumb) {
    errors.push(`City "${city.id}" is missing cat cover assets`)
  }

  if (!Array.isArray(city.elements) || city.elements.length < 12 || city.elements.length > 15) {
    errors.push(`City "${city.id}" must declare 12-15 elements`)
  }

  if (!Array.isArray(city.levelPresets) || city.levelPresets.length !== 6) {
    errors.push(`City "${city.id}" must declare exactly 6 level presets`)
  }

  if (city.unlockAfterCityId && !cityIds.has(city.unlockAfterCityId)) {
    errors.push(`City "${city.id}" unlockAfterCityId references unknown city "${city.unlockAfterCityId}"`)
  }

  const seenElementIds = new Set()
  const seenElementNames = new Set()
  const categoryCounts = countCategories(city.elements ?? [])

  for (const element of city.elements ?? []) {
    if (seenElementIds.has(element.id)) {
      errors.push(`City "${city.id}" has duplicate element id "${element.id}"`)
    }
    seenElementIds.add(element.id)

    if (seenElementNames.has(element.name)) {
      warnings.push(`City "${city.id}" has duplicate element name "${element.name}"`)
    }
    seenElementNames.add(element.name)
  }

  for (const [category, minimum] of Object.entries(CATEGORY_MINIMUMS)) {
    if ((categoryCounts[category] ?? 0) < minimum) {
      errors.push(`City "${city.id}" category "${category}" must contain at least ${minimum} elements`)
    }
  }

  for (const preset of city.levelPresets ?? []) {
    const values = Array.isArray(preset.piecesPerElement) ? preset.piecesPerElement : [preset.piecesPerElement]

    if (Array.isArray(preset.piecesPerElement) && preset.piecesPerElement.length !== preset.elementCount) {
      errors.push(`City "${city.id}" level ${preset.id} piecesPerElement array length must match elementCount`)
    }

    if (!values.every(isMultipleOfThree)) {
      errors.push(`City "${city.id}" level ${preset.id} piecesPerElement must contain only multiples of 3`)
    }
  }

  return { errors, warnings }
}

export default validateCity
