import test from 'node:test'
import assert from 'node:assert/strict'

import { createContentSystem } from '../js/content/index.js'
import { createGameSession } from '../js/gameplay/session/index.js'

test('pickPiece adds a clickable piece to the slot', () => {
  const session = createGameSession({
    cityId: 'beijing',
    levelId: 1,
    seed: 11001,
    contentSystem: createContentSystem(),
  })
  const clickablePiece = session.getClickablePieces()[0]

  const result = session.pickPiece(clickablePiece.id)

  assert.equal(result.status, 'picked')
  assert.equal(session.getState().slot.length, 1)
  assert.equal(session.getState().slot[0].pieceId, clickablePiece.id)
})

test('pickPiece auto clears triples from the slot', () => {
  const contentSystem = createContentSystem()
  const session = createGameSession({
    cityId: 'beijing',
    levelId: 1,
    seed: 11001,
    contentSystem,
    boardState: {
      boardId: 'test',
      cityId: 'beijing',
      levelId: 1,
      seed: 1,
      pieces: [
        { id: 'p1', elementId: 'beijing_01', layer: 0, x: 0, y: 0, width: 64, height: 64, rotation: 0, removed: false },
        { id: 'p2', elementId: 'beijing_01', layer: 0, x: 70, y: 0, width: 64, height: 64, rotation: 0, removed: false },
        { id: 'p3', elementId: 'beijing_01', layer: 0, x: 140, y: 0, width: 64, height: 64, rotation: 0, removed: false },
        { id: 'p4', elementId: 'beijing_02', layer: 0, x: 0, y: 70, width: 64, height: 64, rotation: 0, removed: false },
        { id: 'p5', elementId: 'beijing_02', layer: 0, x: 70, y: 70, width: 64, height: 64, rotation: 0, removed: false },
        { id: 'p6', elementId: 'beijing_02', layer: 0, x: 140, y: 70, width: 64, height: 64, rotation: 0, removed: false },
      ],
      overlapGraph: {
        p1: [],
        p2: [],
        p3: [],
        p4: [],
        p5: [],
        p6: [],
      },
      metrics: {},
    },
  })

  session.pickPiece('p1')
  session.pickPiece('p2')
  const third = session.pickPiece('p3')

  assert.equal(third.status, 'matched')
  assert.equal(session.getState().slot.length, 0)
  assert.equal(session.getState().removedPieceIds.length, 3)
})

test('session fails when slot fills without a match', () => {
  const session = createGameSession({
    cityId: 'beijing',
    levelId: 1,
    seed: 11001,
    contentSystem: createContentSystem(),
    boardState: {
      boardId: 'full-slot',
      cityId: 'beijing',
      levelId: 1,
      seed: 2,
      pieces: ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((key, index) => ({
        id: `p${index + 1}`,
        elementId: key,
        layer: 0,
        x: index * 70,
        y: 0,
        width: 64,
        height: 64,
        rotation: 0,
        removed: false,
      })),
      overlapGraph: {
        p1: [],
        p2: [],
        p3: [],
        p4: [],
        p5: [],
        p6: [],
        p7: [],
      },
      metrics: {},
    },
  })

  for (let index = 1; index <= 6; index += 1) {
    session.pickPiece(`p${index}`)
  }

  const last = session.pickPiece('p7')

  assert.equal(last.status, 'failed')
  assert.equal(session.getState().status, 'failed')
})

test('session wins when the final triple clears the board', () => {
  const session = createGameSession({
    cityId: 'beijing',
    levelId: 1,
    seed: 11001,
    contentSystem: createContentSystem(),
    boardState: {
      boardId: 'win-state',
      cityId: 'beijing',
      levelId: 1,
      seed: 3,
      pieces: [
        { id: 'p1', elementId: 'beijing_01', layer: 0, x: 0, y: 0, width: 64, height: 64, rotation: 0, removed: false },
        { id: 'p2', elementId: 'beijing_01', layer: 0, x: 70, y: 0, width: 64, height: 64, rotation: 0, removed: false },
        { id: 'p3', elementId: 'beijing_01', layer: 0, x: 140, y: 0, width: 64, height: 64, rotation: 0, removed: false },
      ],
      overlapGraph: {
        p1: [],
        p2: [],
        p3: [],
      },
      metrics: {},
    },
  })

  session.pickPiece('p1')
  session.pickPiece('p2')
  const third = session.pickPiece('p3')

  assert.equal(third.status, 'won')
  assert.equal(session.getState().status, 'won')
})
