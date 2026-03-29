const BOUNDS = {
  left: 32,
  right: 358,
  top: 130,
  bottom: 560,
}

export function createAnchorGrid(columns = 6, rows = 8) {
  const anchors = []
  const width = BOUNDS.right - BOUNDS.left
  const height = BOUNDS.bottom - BOUNDS.top
  const stepX = width / (columns - 1)
  const stepY = height / (rows - 1)

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      anchors.push({
        id: `anchor_${row}_${column}`,
        x: BOUNDS.left + column * stepX,
        y: BOUNDS.top + row * stepY,
      })
    }
  }

  return anchors
}

export function getLayerDistribution(density, layers) {
  const presets = {
    low: [0.4, 0.35, 0.25],
    medium: [0.3, 0.3, 0.25, 0.15],
    medium_high: [0.28, 0.27, 0.25, 0.2],
    high: [0.25, 0.25, 0.25, 0.25],
  }
  const base = presets[density] ?? presets.medium
  const sliced = base.slice(0, layers)
  const total = sliced.reduce((sum, value) => sum + value, 0)

  return sliced.map((value) => value / total)
}

export function allocateLayerCounts(totalPieces, density, layers) {
  const distribution = getLayerDistribution(density, layers)
  const counts = distribution.map((value) => Math.floor(totalPieces * value))
  let assigned = counts.reduce((sum, value) => sum + value, 0)

  while (assigned < totalPieces) {
    for (let index = 0; index < counts.length && assigned < totalPieces; index += 1) {
      counts[index] += 1
      assigned += 1
    }
  }

  return counts
}
