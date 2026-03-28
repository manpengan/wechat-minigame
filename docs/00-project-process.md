# 微信小游戏 — 标准开发流程

> 创建日期：2026-03-28
> 项目仓库：https://github.com/manpengan/wechat-minigame
> 标准流程：~/pro/kb/workflows/standard-dev-process/SKILL.md
> 当前阶段：Phase 7 开发实现（进行中）

---

## 流程总览

```
Phase 1 ──→ Phase 2 ──→ Phase 3 ──→ Phase 4 ──→ Phase 5
 立项       市场调研     需求分析     技术方案     项目计划
  │           │           │           │           │
  ▼           ▼           ▼           ▼           ▼
Phase 6 ──→ Phase 7 ──→ Phase 8 ──→ Phase 9 ──→ Phase 10
 设计阶段     开发实现     测试验收     发布上线     运营迭代
```

### 门禁规则

| 门禁 | 条件 | 说明 |
|------|------|------|
| 1→2 | 立项书评审通过 | 方向未定不做调研 |
| 2→3 | 调研报告评审通过 | 市场未验证不冻结需求 |
| 3→4 | PRD 确认 | 需求未确认不做技术设计 |
| 4→5 | 技术方案评审通过 | 方案未评审不排期 |
| 5→6 | 项目计划确认 | 计划未确认不做设计 |
| 6→7 | 设计稿确认 | 设计未通过不写代码 |
| 7→8 | 开发自测通过 | 自测未过不提测 |
| 8→9 | 测试用例全部通过 | 测试未过不上线 |
| 9→10 | 线上稳定运行 | 未验证不进迭代 |

---

## 各阶段状态

| 阶段 | 状态 | 产出文档 | 备注 |
|------|------|----------|------|
| Phase 1 立项 | ✅ 已完成 | docs/01-project-charter.md | 方向确定为城市抓猫猫，5 项决策已锁定 |
| Phase 2 市场调研 | 🔒 未开始 | docs/02-market-research.md | |
| Phase 3 需求分析 | 🔒 未开始 | docs/03-prd.md | |
| Phase 4 技术方案 | ✅ 已完成 | docs/04-technical-design.md | 04-city-content-system + 05-difficulty-generator |
| Phase 5 项目计划 | 🔒 未开始 | docs/05-project-plan.md | |
| Phase 6 设计阶段 | 🔒 未开始 | docs/06-design-spec.md | |
| Phase 7 开发实现 | 🔧 进行中 | docs/07-dev-notes.md | Codex 落代码骨架 js/content/* |
| Phase 8 测试验收 | 🔒 未开始 | docs/08-test-report.md | |
| Phase 9 发布上线 | 🔒 未开始 | docs/09-release-checklist.md | |
| Phase 10 运营迭代 | 🔒 未开始 | docs/10-operations.md | |

---

## 分工

| 角色 | 负责人 | 职责 |
|------|--------|------|
| 产品负责人 | manpengan | 方向决策、资质办理、设计审核、集成验收、运营 |
| 策划/设计 | Claude | 调研、PRD、UI 设计、合规文本、代码审查、KB 维护 |
| 开发实现 | Codex | 核心开发、前端实现、后端逻辑、测试用例 |

---

## 文档目录

```
wechat-minigame/
├── docs/
│   ├── 00-project-process.md      ← 本文件（流程总览）
│   ├── 01-project-charter.md      ← Phase 1 立项书
│   ├── 02-market-research.md      ← Phase 2 市场调研
│   ├── 03-prd.md                  ← Phase 3 产品需求文档
│   ├── 04-technical-design.md     ← Phase 4 技术方案
│   ├── 05-project-plan.md         ← Phase 5 项目计划
│   ├── 06-design-spec.md          ← Phase 6 设计规范
│   ├── 07-dev-notes.md            ← Phase 7 开发记录
│   ├── 08-test-report.md          ← Phase 8 测试报告
│   ├── 09-release-checklist.md    ← Phase 9 发布检查表
│   └── 10-operations.md           ← Phase 10 运营记录
├── game.js                        ← 入口
├── game.json                      ← 全局配置
├── project.config.json            ← DevTools 配置
├── js/                            ← 游戏逻辑
├── images/                        ← 图片素材
├── audio/                         ← 音频素材
├── CLAUDE.md
└── AGENTS.md
```
