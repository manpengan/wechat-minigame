<!-- BRIEFING: auto-maintained -->
## Project State
- **Project**: 城市抓猫猫 (wechat-minigame) — City-themed stacking match-3 WeChat mini game
- **Stage**: Phase 1 + Phase 4 done, 5 design decisions pending
- **Last action**: 5 docs complete (01-05), Codex review fixes applied
- **Next task**: Lock 5 decisions → code scaffolding (js/content/* + level generator) → dev
- **Dev process**: 10-phase gated flow (~/pro/kb/workflows/standard-dev-process/SKILL.md)
- **Hard constraints**: Canvas 2D (no engine) | 4MB first package | No DOM/BOM | 60fps
- **KB**: ~/pro/kb/projects/wechat-minigame/
<!-- END BRIEFING -->

## Project Structure

```
game.js              # Entry point
game.json            # Global config
project.config.json  # DevTools project config
js/                  # Game logic
images/              # Image assets
audio/               # Audio assets
```

## Build & Dev Commands

No CLI build/test commands. Use WeChat DevTools for preview and debugging.

## Coding Style

- ES6+ modules (import/export)
- Canvas-based rendering, no DOM
- Data files use JS module wrapping (no JSON require)
