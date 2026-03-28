import test from 'node:test'
import assert from 'node:assert/strict'

import { createContentSystem } from '../js/content/index.js'
import {
  classifyDeadlock,
  evaluateBoard,
  generateBoard,
} from '../js/gameplay/difficulty/index.js'

test('generateBoard is deterministic for the same city, level, and seed', () => {
  const contentSystem = createContentSystem()

  const first = generateBoard({
    cityId: 'beijing',
    levelId: 1,
    seed: 11001,
    contentSystem,
  })
  const second = generateBoard({
    cityId: 'beijing',
    levelId: 1,
    seed: 11001,
    contentSystem,
  })

  assert.deepEqual(first.pieces, second.pieces)
  assert.deepEqual(first.overlapGraph, second.overlapGraph)
})

test('evaluateBoard exposes baseline metrics for intro level boards', () => {
  const contentSystem = createContentSystem()
  const board = generateBoard({
    cityId: 'beijing',
    levelId: 1,
    seed: 11001,
    contentSystem,
  })
  const levelPreset = contentSystem.getLevelPreset('beijing', 1)
  const metrics = evaluateBoard(board, levelPreset)

  assert.equal(metrics.totalPieces, 18)
  assert.ok(metrics.initialClickableRatio >= 0.3)
})

test('classifyDeadlock identifies a hard deadlock when slot is full and no match path exists', () => {
  const runtimeState = {
    slot: [
      { elementId: 'a' },
      { elementId: 'b' },
      { elementId: 'c' },
      { elementId: 'd' },
      { elementId: 'e' },
      { elementId: 'f' },
      { elementId: 'g' },
    ],
    bypass: [],
  }

  const boardState = {
    pieces: [
      { id: 'p1', elementId: 'x', removed: false },
      { id: 'p2', elementId: 'y', removed: false },
    ],
    overlapGraph: {
      p1: [],
      p2: [],
    },
  }

  const result = classifyDeadlock(runtimeState, boardState)

  assert.equal(result.type, 'hard')
})
