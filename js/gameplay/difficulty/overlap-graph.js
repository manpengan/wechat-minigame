function getPieceArea(piece) {
  return piece.width * piece.height
}

function overlapArea(left, right) {
  const overlapWidth = Math.max(0, Math.min(left.x + left.width, right.x + right.width) - Math.max(left.x, right.x))
  const overlapHeight = Math.max(0, Math.min(left.y + left.height, right.y + right.height) - Math.max(left.y, right.y))

  return overlapWidth * overlapHeight
}

function overlapsCenterZone(lower, upper) {
  const centerWidth = lower.width * 0.5
  const centerHeight = lower.height * 0.5
  const centerBox = {
    x: lower.x + lower.width * 0.25,
    y: lower.y + lower.height * 0.25,
    width: centerWidth,
    height: centerHeight,
  }

  return overlapArea(centerBox, upper) > 0
}

export function buildOverlapGraph(pieces) {
  const graph = Object.fromEntries(pieces.map((piece) => [piece.id, []]))

  for (let leftIndex = 0; leftIndex < pieces.length; leftIndex += 1) {
    for (let rightIndex = 0; rightIndex < pieces.length; rightIndex += 1) {
      if (leftIndex === rightIndex) {
        continue
      }

      const blocker = pieces[leftIndex]
      const blocked = pieces[rightIndex]

      if (blocker.layer <= blocked.layer) {
        continue
      }

      const ratio = overlapArea(blocker, blocked) / getPieceArea(blocked)

      if (ratio >= 0.2 && overlapsCenterZone(blocked, blocker)) {
        graph[blocker.id].push(blocked.id)
      }
    }
  }

  return graph
}

export function getClickablePieces(boardState) {
  const pieces = (boardState.pieces ?? []).filter((piece) => !piece.removed)
  const indegree = Object.fromEntries(pieces.map((piece) => [piece.id, 0]))
  const graph = boardState.overlapGraph ?? {}

  for (const blockedIds of Object.values(graph)) {
    for (const blockedId of blockedIds) {
      if (blockedId in indegree) {
        indegree[blockedId] += 1
      }
    }
  }

  return pieces.filter((piece) => indegree[piece.id] === 0)
}

export function rebuildGraphAfterShuffle(boardState) {
  return buildOverlapGraph(boardState.pieces ?? [])
}

export function rebuildGraphAfterUndo(boardState) {
  return buildOverlapGraph(boardState.pieces ?? [])
}
