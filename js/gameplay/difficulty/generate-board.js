import { createAnchorGrid, allocateLayerCounts } from './anchors.js'
import { evaluateBoard } from './evaluate-board.js'
import { buildOverlapGraph } from './overlap-graph.js'
import { createRng, shuffleWithRng } from './random.js'

function normalizePiecesPerElement(piecesPerElement, elementCount) {
  if (Array.isArray(piecesPerElement)) {
    return piecesPerElement.slice(0, elementCount)
  }

  return Array.from({ length: elementCount }, () => piecesPerElement)
}

function pickElements(city, levelPreset, rng) {
  const shuffled = shuffleWithRng(city.elements, rng)
  const categorySeen = new Set()
  const selected = []

  for (const element of shuffled) {
    if (!categorySeen.has(element.category)) {
      selected.push(element)
      categorySeen.add(element.category)
    }
    if (selected.length === levelPreset.elementCount) {
      return selected
    }
  }

  for (const element of shuffled) {
    if (!selected.includes(element)) {
      selected.push(element)
    }
    if (selected.length === levelPreset.elementCount) {
      break
    }
  }

  return selected
}

function createPiecePool(selectedElements, counts) {
  const pieces = []
  let sequence = 1

  selectedElements.forEach((element, elementIndex) => {
    const count = counts[elementIndex]
    for (let offset = 0; offset < count; offset += 1) {
      pieces.push({
        id: `piece_${String(sequence).padStart(4, '0')}`,
        elementId: element.id,
      })
      sequence += 1
    }
  })

  return pieces
}

function createLayerAnchors(anchorGrid, rng) {
  return shuffleWithRng(anchorGrid, rng)
}

function placePieces(piecePool, levelPreset, rng) {
  const anchors = createAnchorGrid()
  const layerCounts = allocateLayerCounts(piecePool.length, levelPreset.density, levelPreset.layers)
  const placedPieces = []
  let poolIndex = 0

  for (let layer = 0; layer < layerCounts.length; layer += 1) {
    const layerAnchors = createLayerAnchors(anchors, rng)
    const previousLayerPieces = placedPieces.filter((piece) => piece.layer === layer - 1)

    for (let index = 0; index < layerCounts[layer]; index += 1) {
      const source = piecePool[poolIndex]
      const overlapChance = levelPreset.density === 'high'
        ? 0.85
        : levelPreset.density === 'medium_high'
          ? 0.7
          : levelPreset.density === 'medium'
            ? 0.55
            : 0.35

      let anchor = layerAnchors[index % layerAnchors.length]

      if (layer > 0 && previousLayerPieces.length > 0 && rng() < overlapChance) {
        const target = previousLayerPieces[Math.floor(rng() * previousLayerPieces.length)]
        anchor = { x: target.x + 6, y: target.y + 6 }
      }

      placedPieces.push({
        ...source,
        layer,
        x: Math.round(anchor.x + (rng() - 0.5) * 12),
        y: Math.round(anchor.y + (rng() - 0.5) * 12),
        width: 64,
        height: 64,
        rotation: Math.round((rng() - 0.5) * 12),
        removed: false,
      })

      poolIndex += 1
    }
  }

  return placedPieces
}

export function generateBoard({ cityId, levelId, seed, contentSystem }) {
  const city = contentSystem.getCity(cityId)
  const levelPreset = contentSystem.getLevelPreset(cityId, levelId)

  if (!city || !levelPreset) {
    throw new Error(`Unknown board target: ${cityId}#${levelId}`)
  }

  const effectiveSeed = seed ?? levelPreset.seedBase
  const rng = createRng(effectiveSeed)
  const selectedElements = pickElements(city, levelPreset, rng)
  const counts = normalizePiecesPerElement(levelPreset.piecesPerElement, levelPreset.elementCount)
  const piecePool = createPiecePool(selectedElements, counts)
  const pieces = placePieces(shuffleWithRng(piecePool, rng), levelPreset, rng)
  const overlapGraph = buildOverlapGraph(pieces)
  const boardState = {
    boardId: `${cityId}-${levelId}-${effectiveSeed}`,
    cityId,
    levelId,
    seed: effectiveSeed,
    pieces,
    overlapGraph,
    metrics: {},
  }

  boardState.metrics = evaluateBoard(boardState, levelPreset)

  return boardState
}

export default generateBoard
