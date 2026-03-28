# 05 Difficulty Generator — 城市抓猫猫

## 1. 目标

可控难度生成器负责把 `CityManifest.levelPresets` 变成可玩的单局棋盘，并保证：

- 同一关卡能通过 `seed` 复现
- 关卡默认可解，不能依赖广告道具救不可能局
- 不同城市和关卡能被放进统一的难度带
- 生成器输出不仅是“布局”，还是“布局质量评估结果”

## 2. 非目标

这套系统暂时不做这些事：

- 不做人类级最优解搜索
- 不做手工逐关摆盘编辑器
- 不把难度完全交给在线热更新动态生成
- 不在 MVP 阶段做实时个性化难度

MVP 的目标是：`离线可复现 + 可校验 + 能调参`。

## 3. 设计原则

### 3.1 关卡必须先“无道具可过”

道具是纠错和商业化入口，不是不可解关卡的补丁。

要求：

- 所有基础关卡必须存在无道具通关路径
- 关 1-4 的目标通关率以无道具为准
- 关 5-6 可以允许少量玩家依赖道具，但不能依赖道具才有解

### 3.2 同一 seed 必须得到同一布局

- 便于复现 bug
- 便于分享每日挑战
- 便于离线验证和埋点对齐

### 3.3 “难”来自信息压力，不来自脏规则

- 难度主要来自种类数、可见物件密度、遮挡深度、误点代价
- 不做肉眼不可识别的遮挡判定
- 不做首屏几乎无可操作空间的恶意布局

## 4. 核心数据模型

### 4.1 DifficultyProfile

```javascript
{
  cityId: 'beijing',
  levelId: 1,
  seed: 11001,
  elementCount: 6,
  piecesPerElement: 3,
  layers: 2,
  density: 'low',
  targetPassRate: 0.95,
  targetDurationSec: [90, 150],
}
```

### 4.2 PieceInstance

```javascript
{
  id: 'piece_0001',
  elementId: 'beijing_01',
  layer: 1,
  x: 220,
  y: 340,
  width: 64,
  height: 64,
  rotation: -4,
  removed: false,
}
```

### 4.3 BoardState

```javascript
{
  boardId: 'beijing-1-11001',
  cityId: 'beijing',
  levelId: 1,
  seed: 11001,
  pieces: [],
  overlapGraph: {},
  metrics: {
    totalPieces: 18,
    initialClickableRatio: 0.39,
    simulatedPassRate: 0.97,
    avgTurnsToFinish: 15.2,
    toolFreePassRate: 0.97,
    toolAssistPassRate: 1.0,
  },
}
```

### 4.4 RuntimeState

```javascript
{
  slot: [],       // 最多 7 个
  bypass: [],     // Remove 使用，最多 3 个
  removedPieceIds: [],
}
```

## 5. 坐标系与布局空间

### 5.1 画布布局区

棋盘不直接自由散点，而是在“布局安全区”中放置：

- 上方预留标题和城市信息区
- 下方预留 7 格槽位和道具按钮区
- 中间主区域作为堆叠区

建议生成器使用一套固定的 `anchor grid`：

- 列数：6-8
- 行数：7-9
- 每个 anchor 可带随机偏移
- 每层共享同一批 anchor，但偏移不同

这样做的目的：

- 让视觉上看起来是自然堆叠
- 实现上仍然可控、可校验

### 5.2 顶层回退落点

Undo 不恢复原位，而是回到“场景顶层空闲位置”。这个位置必须由生成器提前预留安全落点：

- `returnLanes` 是一组不与标题区、按钮区重叠的顶层 anchor
- 回退件只落在 `returnLanes`
- 回退后不能让“初始唯一可点击物件”全部被堵死

## 6. Overlap Graph

Overlap Graph 是生成器和运行时共同使用的核心结构。

### 6.1 定义

- 每个物件是一个节点
- 若 A 遮挡 B，则存在有向边 `A -> B`
- 节点入度为 0 表示当前可点击

### 6.2 遮挡判定

两个物件存在遮挡关系，需同时满足：

- `A.layer > B.layer`
- 包围盒重叠面积超过 `B` 面积的阈值
- 且重叠区域命中了 `B` 的中心活跃区

推荐阈值：

- `overlapRatio >= 0.2`
- 中心活跃区为物件中心 `50% x 50%`

这样可以避免“边角轻微擦到就算完全遮挡”的脏判定。

### 6.3 图结构接口

```javascript
buildOverlapGraph(pieces)
getClickablePieces(boardState)
rebuildGraphAfterShuffle(boardState)
rebuildGraphAfterUndo(boardState)
```

## 7. 可点击判定

运行时的点击条件统一为：

1. 物件未被移除
2. 物件不在暂存槽和旁路寄存区
3. 在 `overlapGraph` 中入度为 0

不引入额外“半可点”状态，避免玩家心智混乱。

## 8. 生成流水线

### 8.1 输入

- `CityManifest`
- `LevelPreset`
- `seed`

### 8.2 输出

- `BoardState`
- 评估指标 `metrics`
- 若生成失败则返回错误原因和重试次数

### 8.3 流程

```text
1. 依据 level preset 生成元素池
2. 根据 seed 洗牌元素池
3. 计算 layerDistribution
4. 在 anchor grid 中逐层放置物件
5. 构建 overlap graph
6. 计算初始可点击集合
7. 跑 solver / validator
8. 若指标不达标则调参重试
9. 输出最终 board + metrics
```

## 9. 元素池生成

### 9.1 规则

- `elementCount` 决定本关启用多少种元素
- `piecesPerElement` 可以是单值，也可以是数组
- 所有值必须是 3 的倍数

### 9.2 采样原则

- 优先从城市 `elements` 中选取高辨识度元素
- 尽量覆盖多类目，不让一关全是美食或全是建筑
- 同一城市 6 关的元素组合需要有节奏变化，不应完全重复

推荐策略：

- 先抽每个类目至少 1 个
- 剩余名额按权重补齐

## 10. 分层与密度模型

### 10.1 layerDistribution

按 `density` 决定每层占比。

建议默认分布：

| density | 分层建议 |
|--------|---------|
| `low` | `[0.40, 0.35, 0.25]` |
| `medium` | `[0.30, 0.30, 0.25, 0.15]` |
| `medium_high` | `[0.28, 0.27, 0.25, 0.20]` |
| `high` | `[0.25, 0.25, 0.25, 0.25]` |

注意：

- 实际层数少于数组长度时，截断并重新归一化
- 最顶层占比不能低到“首屏没有明显可点物件”

### 10.2 初始可见性约束

基础约束：

- 初始可点击物件占比 `>= 0.30`
- 初始可点击集合中，至少存在 `2` 组可形成潜在三消的元素链
- 首关至少有 `1` 组直接三消机会

这三条是“避免开局恶心人”的底线。

## 11. 布局放置规则

### 11.1 放置策略

- 从底层到顶层放置
- 每层物件先选 anchor，再施加轻微随机偏移
- 同类元素默认不要 3 个全堆在同一小区域

### 11.2 同类分散规则

同类元素放置时遵循：

- 至少 1 个在首屏可点击层附近
- 不允许 3 个完全同层紧邻，避免白给三消过多
- 也不允许 3 个全部深埋，避免“直到残局才第一次看到”

这是影响手感最明显的隐藏规则之一。

### 11.3 冲突规避

放置时要避开：

- 顶部标题安全区
- 底部槽位和道具按钮区
- Undo 回退通道 `returnLanes`

## 12. Seed 机制

### 12.1 来源

- 常规关：`hash(cityId + ':' + levelId + ':' + revision)`
- 每日挑战：`hash(utcDate + ':daily:' + cityId)`
- 调试复现：可直接手输 seed

### 12.2 用途

- 复现线上问题
- 让同一日挑战全量玩家拿到同一盘
- 把埋点和具体布局绑定起来

### 12.3 revision

如果某关布局难度整体偏离目标，不直接改 `levelId`，而是增加 `revision`。

这样可以区分：

- `levelId`：设计上的第几关
- `revision`：该关当前采用的生成版本

## 13. Solver 设计

生成器不能只靠一条贪心策略，否则评估噪音太大。

### 13.1 Solver 策略集

至少跑 3 类策略：

- `match-first`
  优先选择能立刻三消的物件
- `slot-build`
  优先补齐槽里已有 1-2 个的类型
- `risk-averse`
  避免把槽位铺得过散，优先减少槽中类型数

### 13.2 单次模拟流程

```text
1. 初始化 board / slot / bypass
2. 获取 clickable pieces
3. 按当前策略给每个可点物件打分
4. 选择得分最高的候选
5. 放入槽位并执行三消
6. 若触发 bypass 回归，则先回归再重新判定槽位
7. 重建可点击集合
8. 直到清盘成功或失败
```

### 13.3 输出指标

每批模拟需要统计：

- `toolFreePassRate`
- `avgTurnsToFinish`
- `avgPeakSlotUsage`
- `openingStability`
  定义为前 5 步中失败样本占比
- `stuckRate`
  定义为进入硬死局的比例

## 14. 死局分类

### 14.1 Hard Deadlock

满足以下条件时，判为硬死局：

- 暂存槽已满 7 格
- 当前无任何可形成三消的点击路径
- 旁路寄存区为空或回归后仍失败
- 无道具情况下不可能继续

### 14.2 Soft Deadlock

满足以下条件时，判为软死局：

- 当前直接继续大概率失败
- 但使用 `Undo`、`Remove` 或 `Shuffle` 可恢复可玩态

设计原则：

- 生成器允许出现软死局
- 生成器不允许把基础通关路径设计成必经硬死局

## 15. 验收门槛

### 15.1 关卡级门槛

| 关卡 | `toolFreePassRate` | `toolAssistPassRate` | `initialClickableRatio` |
|------|--------------------|----------------------|-------------------------|
| 1 | `>= 0.95` | `1.00` | `>= 0.38` |
| 2 | `>= 0.90` | `>= 0.98` | `>= 0.35` |
| 3 | `>= 0.80` | `>= 0.92` | `>= 0.33` |
| 4 | `>= 0.70` | `>= 0.88` | `>= 0.32` |
| 5 | `>= 0.60` | `>= 0.82` | `>= 0.30` |
| 6 | `0.50 - 0.60` | `>= 0.75` | `>= 0.30` |

说明：

- `toolFreePassRate` 是核心门槛
- `toolAssistPassRate` 用来衡量道具价值，不是救火指标

### 15.2 批量生成门槛

如果某个 `LevelPreset` 连续重试 `50` 次仍无法达到目标区间，应判为参数设计有问题，而不是继续无限重试。

## 16. 调参顺序

当某关过难时，按这个顺序调：

1. 降低 `density`
2. 降低 `layers`
3. 降低 `elementCount`
4. 调整 `layerDistribution`
5. 调整同类元素分散规则

当某关过易时，反向调整。

不要优先改槽位大小，不要动基础规则。

## 17. 埋点与闭环

线上埋点至少记录：

- `cityId`
- `levelId`
- `revision`
- `seed`
- `result`（win / fail / revive / quit）
- `peakSlotUsage`
- `toolUsage`
- `timeSpentSec`
- `firstFailStep`

这些数据用来做三件事：

- 验证离线模拟是否接近真实玩家
- 找出异常 seed
- 调整不同关卡的目标通关率

## 18. 推荐接口

```javascript
generateBoard(cityId, levelId, seed)
buildOverlapGraph(pieces)
getClickablePieces(boardState)
simulateBoard(boardState, policy)
evaluateBoard(boardState, levelPreset)
classifyDeadlock(runtimeState, boardState)
regenerateWithTweaks(levelPreset, failureReason)
```

## 19. 与 04 文档的边界

05 文档消费 [04-city-content-system.md](./04-city-content-system.md) 提供的这些输入：

- `CityManifest.elements`
- `CityManifest.levelPresets`
- `cityId / levelId / revision`

05 文档输出给运行时的是：

- 单局布局
- 评估指标
- 可复现 seed

内容系统负责“有什么内容”，难度生成器负责“这些内容如何排成一盘可玩的局”。
