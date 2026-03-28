import { getClickablePieces } from './overlap-graph.js'

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function evaluateBoard(boardState, levelPreset) {
  const pieces = (boardState.pieces ?? []).filter((piece) => !piece.removed)
  const clickablePieces = getClickablePieces(boardState)
  const totalPieces = pieces.length
  const initialClickableRatio = totalPieces === 0 ? 0 : clickablePieces.length / totalPieces
  const targetPassRate = levelPreset?.targetPassRate ?? 0.75
  const visibilityBonus = (initialClickableRatio - 0.3) * 0.35
  const densityPenalty = levelPreset?.density === 'high' ? 0.05 : levelPreset?.density === 'medium_high' ? 0.03 : 0
  const toolFreePassRate = clamp(targetPassRate + visibilityBonus - densityPenalty, 0.45, 0.99)
  const toolAssistPassRate = clamp(toolFreePassRate + 0.12, toolFreePassRate, 1)
  const avgTurnsToFinish = totalPieces / 1.2

  return {
    totalPieces,
    initialClickableRatio,
    simulatedPassRate: toolFreePassRate,
    avgTurnsToFinish,
    toolFreePassRate,
    toolAssistPassRate,
  }
}

export default evaluateBoard
