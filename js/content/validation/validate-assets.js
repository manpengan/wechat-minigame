export function validateAssets(city, assetExists) {
  const errors = []
  const warnings = []

  if (typeof assetExists !== 'function') {
    return { errors, warnings }
  }

  const assetPaths = [
    city.cover?.catImage,
    city.cover?.catThumb,
    ...(city.elements ?? []).map((element) => element.image),
  ].filter(Boolean)

  for (const assetPath of assetPaths) {
    if (!assetExists(assetPath)) {
      errors.push(`City "${city.id}" asset is missing: ${assetPath}`)
    }
  }

  return { errors, warnings }
}

export default validateAssets
