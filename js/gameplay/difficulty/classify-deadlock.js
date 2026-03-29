import { getClickablePieces } from './overlap-graph.js'

function getPotentialMatches(slot, clickablePieces) {
  return clickablePieces.filter((piece) => {
    const sameCount = slot.filter((slottedPiece) => slottedPiece.elementId === piece.elementId).length
    return sameCount >= 2
  })
}

export function classifyDeadlock(runtimeState, boardState) {
  const slot = runtimeState.slot ?? []
  const bypass = runtimeState.bypass ?? []
  const clickablePieces = getClickablePieces(boardState)

  if (slot.length < 7) {
    return {
      type: 'none',
      clickablePieces,
    }
  }

  const matchablePieces = getPotentialMatches(slot, clickablePieces)

  if (matchablePieces.length > 0) {
    return {
      type: 'none',
      clickablePieces,
      matchablePieces,
    }
  }

  if (bypass.length > 0) {
    return {
      type: 'soft',
      clickablePieces,
      matchablePieces: [],
    }
  }

  return {
    type: 'hard',
    clickablePieces,
    matchablePieces: [],
  }
}

export default classifyDeadlock
