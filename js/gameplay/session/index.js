import { generateBoard, getClickablePieces } from '../difficulty/index.js'

function cloneBoardState(boardState) {
  return {
    ...boardState,
    pieces: boardState.pieces.map((piece) => ({ ...piece })),
    overlapGraph: Object.fromEntries(
      Object.entries(boardState.overlapGraph ?? {}).map(([pieceId, blockedIds]) => [pieceId, [...blockedIds]]),
    ),
    metrics: { ...(boardState.metrics ?? {}) },
  }
}

function getPieceById(boardState, pieceId) {
  return boardState.pieces.find((piece) => piece.id === pieceId) ?? null
}

function createSlotEntry(piece) {
  return {
    pieceId: piece.id,
    elementId: piece.elementId,
  }
}

function removeMatchedEntries(slot, elementId) {
  let remaining = 3

  return slot.filter((entry) => {
    if (entry.elementId === elementId && remaining > 0) {
      remaining -= 1
      return false
    }

    return true
  })
}

function getMatchingTriples(slot) {
  const counts = slot.reduce((map, entry) => {
    map.set(entry.elementId, (map.get(entry.elementId) ?? 0) + 1)
    return map
  }, new Map())

  const matchedElementId = [...counts.entries()].find(([, count]) => count >= 3)?.[0] ?? null

  return matchedElementId
}

function getStateSnapshot(state, boardState) {
  return {
    cityId: state.cityId,
    levelId: state.levelId,
    seed: state.seed,
    status: state.status,
    slot: [...state.slot],
    bypass: [...state.bypass],
    removedPieceIds: [...state.removedPieceIds],
    boardState,
  }
}

export function createGameSession({
  cityId,
  levelId,
  seed,
  contentSystem,
  boardState,
  restartFactory,
}) {
  const resolvedBoard = boardState ? cloneBoardState(boardState) : generateBoard({ cityId, levelId, seed, contentSystem })
  const state = {
    cityId,
    levelId,
    seed: resolvedBoard.seed,
    status: 'playing',
    slot: [],
    bypass: [],
    removedPieceIds: [],
  }

  function getState() {
    return getStateSnapshot(state, resolvedBoard)
  }

  function isBoardCleared() {
    return resolvedBoard.pieces.every((piece) => piece.removed) && state.slot.length === 0
  }

  function getClickable() {
    return getClickablePieces(resolvedBoard)
  }

  function pickPiece(pieceId) {
    if (state.status !== 'playing') {
      return {
        status: state.status,
        state: getState(),
      }
    }

    const piece = getPieceById(resolvedBoard, pieceId)

    if (!piece || piece.removed) {
      return {
        status: 'invalid',
        state: getState(),
      }
    }

    const clickableIds = new Set(getClickable().map((clickablePiece) => clickablePiece.id))
    if (!clickableIds.has(pieceId)) {
      return {
        status: 'blocked',
        state: getState(),
      }
    }

    piece.removed = true
    state.slot.push(createSlotEntry(piece))

    const matchedElementId = getMatchingTriples(state.slot)
    if (matchedElementId) {
      const matchedIds = state.slot
        .filter((entry) => entry.elementId === matchedElementId)
        .slice(0, 3)
        .map((entry) => entry.pieceId)

      state.slot = removeMatchedEntries(state.slot, matchedElementId)
      state.removedPieceIds.push(...matchedIds)

      if (isBoardCleared()) {
        state.status = 'won'
        return {
          status: 'won',
          matchedElementId,
          matchedIds,
          state: getState(),
        }
      }

      return {
        status: 'matched',
        matchedElementId,
        matchedIds,
        state: getState(),
      }
    }

    if (state.slot.length >= 7) {
      state.status = 'failed'
      return {
        status: 'failed',
        state: getState(),
      }
    }

    return {
      status: 'picked',
      state: getState(),
    }
  }

  function restart(nextSeed = seed ?? resolvedBoard.seed) {
    if (restartFactory) {
      return restartFactory(nextSeed)
    }

    const freshSession = createGameSession({
      cityId,
      levelId,
      seed: nextSeed,
      contentSystem,
    })

    return freshSession
  }

  return {
    cityId,
    levelId,
    seed: resolvedBoard.seed,
    getBoardState() {
      return resolvedBoard
    },
    getState,
    getClickablePieces() {
      return getClickable()
    },
    pickPiece,
    restart,
  }
}

export default createGameSession
