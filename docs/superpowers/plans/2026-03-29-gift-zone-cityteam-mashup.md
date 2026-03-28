# Gift Zone CityTeam Mashup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the MVP cat album and local cityTeam entry flow, then wire the mashup home tile into a playable standalone round with local rewards.

**Architecture:** Extend the existing `contentSystem` and `scene-store` contracts instead of refactoring core navigation. Reuse the current gameplay session for mashup by feeding it generated board metadata and handling mashup completion in a separate local reward path.

**Tech Stack:** ES modules, Node test runner, WeChat mini-game canvas shell

---

### Task 1: Docs And Data Contracts

**Files:**
- Create: `docs/superpowers/specs/2026-03-29-gift-zone-cityteam-mashup-design.md`
- Create: `docs/superpowers/plans/2026-03-29-gift-zone-cityteam-mashup.md`
- Modify: `js/content/index.js`

- [ ] Define the MVP cat album contract in `contentSystem`
- [ ] Keep `animals` and `maps` out of scope
- [ ] Add any helper projections needed for cityTeam and mashup

### Task 2: Gift Zone And CityTeam

**Files:**
- Modify: `tests/content-system.test.js`
- Modify: `tests/scene-store.test.js`
- Modify: `js/content/index.js`
- Modify: `js/ui/scene-store.js`
- Modify: `js/main.js`

- [ ] Write failing tests for `cats` album visibility and counts
- [ ] Write failing tests for cityTeam selection flow
- [ ] Implement `cats` album projections with existing city cat data
- [ ] Implement `city-team-select` scene and local selection writeback
- [ ] Render cityTeam status and entry buttons in the canvas UI
- [ ] Re-run targeted tests until green

### Task 3: Mashup Gameplay

**Files:**
- Modify: `tests/difficulty-generator.test.js`
- Modify: `tests/scene-store.test.js`
- Modify: `js/gameplay/difficulty/generate-board.js`
- Create: `js/gameplay/difficulty/generate-mashup-board.js`
- Modify: `js/gameplay/difficulty/index.js`
- Modify: `js/gameplay/session/index.js`
- Modify: `js/ui/scene-store.js`
- Modify: `js/main.js`

- [ ] Write failing tests for mashup board generation
- [ ] Write failing tests for mashup scene entry and reward writeback
- [ ] Implement mashup board builder from unlocked city content
- [ ] Implement mashup scene/session creation in `scene-store`
- [ ] Implement mashup win reward path and result messaging
- [ ] Re-run targeted tests until green

### Task 4: Full Verification

**Files:**
- Modify: `tests/*` as needed
- Modify: `js/*` as needed

- [ ] Run the full test suite with `npm test`
- [ ] Verify no unrelated placeholders were implemented
- [ ] Summarize remaining placeholder areas in the final report
