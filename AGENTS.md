<!-- BRIEFING: auto-maintained -->
## Project State
- **Project**: wechat-minigame — 微信小游戏
- **Stage**: Phase 1 立项（待开始）
- **Last action**: project init + standard dev process setup
- **Next task**: Phase 1 — define game type, target users, project charter
- **Dev process**: 10-phase gated flow (~/pro/kb/workflows/standard-dev-process/SKILL.md)
- **Hard constraints**: Canvas rendering | 4MB first package | No DOM/BOM | 60fps target
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
