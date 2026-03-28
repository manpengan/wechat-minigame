<!-- BRIEFING: auto-maintained -->
## Project State
- **Project**: wechat-minigame — 微信小游戏
- **Stage**: 初始化
- **Last action**: project init
- **Next task**: 讨论游戏类型、玩法设计和技术方案，制定开发计划
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
