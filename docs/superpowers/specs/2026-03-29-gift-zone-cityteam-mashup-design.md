# Gift Zone CityTeam Mashup Design

## Goal

在现有 MVP 壳子上补齐三个紧邻切片：

- 礼物区从 2 册扩到 3 册，先把 `猫猫册` 做成可浏览的 MVP 版本
- 接通本地 `cityTeam` 选队入口，只做本地选择和展示，不做服务端排行
- 把 `主题大混战` 做成可进入的独立对局，并提供本地奖励回写

## Scope

### In

- `gift-zone` 增加 `cats` tab 和汇总计数
- `cityTeam` 选择页、本地入队状态、入口按钮
- `mashup` 入口从首页可进入独立对局
- `mashup` 使用已解锁城市元素混搭生成棋盘
- `mashup` 通关奖励写回本地存档

### Out

- 真正的分享卡片视觉内容
- 开房 PK
- 城市战队排行榜服务端逻辑
- 礼物区 `动物册 / 地图册`
- 地区级猫猫收集规则

## Design Decisions

### 1. 猫猫册口径

先用“已通关城市猫”作为 `猫猫册` MVP 口径，而不是文档里的“地区猫”正式口径。

原因：

- 现有存档里已经有 `collectedCats[]` 城市完成态
- 现有 CityManifest 已经有 `cat` 和 `cover.catThumb`
- 这样可以不引入新资源、不改通关发奖链路

后续若升级为“地区猫”，只需要替换 `cats` album 的数据投影层，不必重写礼物区 UI 框架。

### 2. cityTeam 入口

`cityTeam` 入口同时挂在两个地方：

- 礼物区顶部信息卡
- 主页右侧“排行榜”卡片

如果未选队，进入 `city-team-select` 选择页；如果已选队，则展示当前所属战队的本地状态说明。选择仅允许已解锁城市，首次选择后本地锁定。

### 3. 主题大混战实现方式

不把 `mashup` 硬塞进现有城市关卡合同，而是新增一条轻量 mode 路径：

- `scene-store` 增加 `mashup` scene
- 生成器增加 mashup board 构建辅助函数
- `gameplay` 复用现有 `GameSession`
- `main.js` 根据 scene metadata 渲染 mashup 标题、结果和奖励文案

这样不需要把 `contentSystem.getCity()` 改成兼容“虚拟城市”，能控制改动面。

### 4. 混战奖励

混战不计入城市关卡进度。通关奖励规则：

- 优先随机发一个当前已解锁城市的冰箱贴
- 如果随机命中的冰箱贴已拥有，则发 `shuffle +1`

奖励完全本地化，只做存档回写和结果展示。

## Data Flow

### Gift Zone

`playerState` -> `contentSystem.getGiftAlbums()` / `getGiftAlbumEntries()` -> `scene-store gift-zone` -> `main.js` 礼物区页面

### CityTeam

`playerState.cityTeam` -> `scene-store` 入口判断 / 选择写回 -> `main.js` 选择页与状态卡

### Mashup

首页 `mashup` tile -> `scene-store.openHomeTile('mashup')` -> 构建 mashup board + session -> `main.js` gameplay -> 通关后 `scene-store.completeMashupRun()`

## Testing

- 内容系统测试：礼物区 album 列表包含 `cats`，计数与条目投影正确
- scene-store 测试：cityTeam 选择页可打开、可选择、选后锁定
- scene-store 测试：`mashup` 在通关 2 城后可进入
- 对局/难度测试：mashup board 由多个城市元素组成且可复现
- scene-store 测试：mashup 通关可写入奖励
