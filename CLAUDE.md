# wechat-minigame

<!-- BRIEFING: auto-maintained, do not edit manually -->
## 项目速览
- **项目**：wechat-minigame — 微信小游戏
- **阶段**：Phase 1 立项（待开始）
- **上次结论**：项目初始化 + 标准开发流程接入
- **下一步**：Phase 1 立项 — 确定游戏类型、目标用户、项目愿景
- **开发流程**：10 阶段门禁制（~/pro/kb/workflows/standard-dev-process/SKILL.md）
- **关键约束**：Canvas 渲染 | 首包 4MB | 无 DOM/BOM | 60fps 目标
- **KB 指针**：~/pro/kb/projects/wechat-minigame/
<!-- END BRIEFING -->

## 开发环境

- 平台：微信小游戏（非小程序）
- 渲染：Canvas 2D / WebGL
- 调试工具：微信开发者工具
- 无 npm/build/test CLI，在 DevTools 中模拟器验证

## 项目结构

```
game.js              # 入口
game.json            # 全局配置
project.config.json  # DevTools 项目配置
js/                  # 游戏逻辑
images/              # 图片素材
audio/               # 音频素材
docs/                # 阶段文档（00-10）
```

## 平台约束

- `require()` 不支持 JSON，数据用 JS module 包装
- 首包 ≤ 4MB，分包总计 ≤ 20MB
- 不支持 DOM/BOM，仅微信 API 子集
- Canvas 是全局单例，通过 `wx.createCanvas()` 获取
