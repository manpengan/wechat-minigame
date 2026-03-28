# 04 City Content System — 城市抓猫猫

## 1. 目标

城市内容系统负责把"北京/东京/曼谷"这类城市内容变成稳定、可校验、可扩展、可分包加载的数据资产。

它解决 4 个问题：

- 新增一个城市时，尽量只新增配置和资源，不改玩法代码
- 运行时能快速拿到城市列表、封面、元素、猫猫、关卡参数
- 内容出错时能在入库前被校验出来，而不是上线后炸在运行时
- 内容包和玩家进度解耦，后续扩城市、扩洲、做活动都不改存档结构

## 2. 设计原则

### 2.1 配置驱动

- 玩法代码不写死城市名、元素名、解锁顺序
- 城市、洲、猫猫、护照、分享卡片都从 JS module 配置读取
- 运行时只依赖稳定 id，不依赖中文展示名

### 2.2 稳定标识优先

- `continentId`、`cityId`、`elementId`、`catId` 一旦上线不可重命名
- 展示文案、美术资源可迭代，稳定 id 不变
- 玩家存档只记录 id 和进度，不直接记录资源路径

### 2.3 内容与进度解耦

- 内容是只读配置
- 进度来自 `playerState`
- UI 展示由 `content + playerState` 合成，不把内容字段写回存档

### 2.4 可校验优先于可编辑

- 城市配置必须显式、冗余、容易校验
- 不追求“最短配置”，追求“新手也不容易配错”

## 3. 逻辑模块

| 模块 | 职责 |
|------|------|
| `ContinentRegistry` | 管理洲索引、城市顺序、预下载策略 |
| `CityRegistry` | 加载单个城市配置、提供城市查询接口 |
| `ContentResolver` | 根据 id 解析封面、猫猫、元素、护照、分享资源 |
| `ContentValidator` | 在入库前做结构校验、语义校验、跨文件校验 |
| `ProgressProjector` | 用 `playerState` 投影出解锁态、通关态、图鉴态 |
| `BundleResolver` | 决定某个城市资源在主包还是分包，何时预加载 |

## 4. 数据层级

运行时的数据层级固定为：

```text
ContinentManifest
  -> CityManifest
      -> ElementSpec[]
      -> CatSpec
      -> LevelPreset[]
      -> PassportSpec
      -> ShareCardSpec
```

### 4.1 ContinentManifest

洲配置只描述“入口”和“顺序”，不重复城市详情。

```javascript
module.exports = {
  id: 'asia',
  name: '亚洲',
  sortOrder: 1,
  themeColor: '#FF6B6B',
  cityIds: ['beijing', 'tokyo', 'bangkok', 'seoul', 'singapore', 'istanbul'],
  unlockOrder: ['beijing', 'tokyo', 'bangkok', 'seoul', 'singapore', 'istanbul'],
  bundle: {
    packId: 'asia-rest',
    preloadOnEnter: true,
  },
}
```

约束：

- `cityIds` 和 `unlockOrder` 必须一一对应
- MVP 只启用 `asia`
- 后续新增洲时，`sortOrder` 决定大地图排序

### 4.2 CityManifest

城市配置是运行时的主实体。

```javascript
module.exports = {
  id: 'beijing',
  contentVersion: 1,
  continentId: 'asia',
  sortOrder: 1,
  unlockAfterCityId: null,
  bundle: {
    packId: 'main',
    preload: 'startup',
  },
  display: {
    name: '北京',
    nameEn: 'Beijing',
    bgColor: '#CC2936',
    tagline: '天安门前看猫猫',
    funFact: '北京是世界上拥有最多宫殿的城市',
  },
  cover: {
    catImage: 'images/cats/cat_beijing.png',
    catThumb: 'images/cats/cat_beijing_thumb.png',
    shareAccent: '#F6D365',
  },
  cat: {
    id: 'cat_beijing',
    name: '京京',
    baseColor: '#F28C28',
    pattern: 'tabby',
    accessory: '虎头帽',
  },
  passport: {
    stampId: 'stamp_beijing',
    stampLabel: '北京',
  },
  elements: [
    // 12-15 个
  ],
  levelPresets: [
    // 6 个基础关卡
  ],
  shareCard: {
    titleUnlocked: '我解锁了北京猫！',
    titlePassport: '北京护照盖章完成',
  },
}
```

### 4.3 ElementSpec

元素是关卡和图鉴的最小单位。

```javascript
{
  id: 'beijing_01',
  name: '糖葫芦',
  category: 'food',
  rarity: 'core',
  image: 'images/elements/beijing/beijing_01.png',
  tags: ['sweet', 'street-food', 'red'],
}
```

字段约束：

- `id` 全局唯一
- `category` 只能来自固定枚举：`landmark` / `food` / `culture` / `item` / `nature`
- `rarity` 先保留 `core` / `accent` 两档，MVP 默认都可用 `core`
- `tags` 给后续活动筛选、图鉴展示、搜索扩展留接口

### 4.4 LevelPreset

关卡不直接保存所有物件坐标，只保存生成输入。

```javascript
{
  id: 1,
  difficultyTier: 'intro',
  seedBase: 11001,
  elementCount: 6,
  piecesPerElement: 3,
  layers: 2,
  density: 'low',
  targetPassRate: 0.95,
  targetDurationSec: [90, 150],
}
```

设计原则：

- 关卡配置是“生成器输入 + 目标指标”
- 真正布局由 `difficulty generator` 按 `seed` 生成
- 同一关卡可复现实例，不手工存静态坐标表

## 5. 推荐目录结构

系统层推荐的逻辑目录如下：

```text
js/content/
  continents/
    asia.js
    index.js
  cities/
    beijing.js
    tokyo.js
    ...
  registry/
    continent-registry.js
    city-registry.js
    bundle-resolver.js
    progress-projector.js
  validation/
    validate-continent.js
    validate-city.js
    validate-assets.js
```

说明：

- `docs/03` 里的 `cities/*.js`、`continents/*.js` 是逻辑格式，不要求现在就按这个目录实现
- 真的写代码时，建议统一挂到 `js/content/` 下，避免根目录膨胀

## 6. 运行时读取流程

### 6.1 启动阶段

1. 读取 `continents/index`
2. 初始化 `ContinentRegistry`
3. 读取主包内首城市 `beijing`
4. 生成城市页卡片数据
5. 用 `playerState` 投影出解锁态和通关态

### 6.2 进入城市页

1. 取亚洲 `unlockOrder`
2. 读取所有已在本地可用的 `CityManifest` 摘要
3. 对未下载但已可见的城市展示灰态卡片
4. 对“下一目标城市”预触发分包预下载

### 6.3 进入单城市

1. 检查 `bundle.packId`
2. 若分包未加载，则先下载/加载
3. 加载 `CityManifest`
4. 加载该城市封面猫猫、元素图标、分享卡资源
5. 生成 6 个关卡入口及对应种子

### 6.4 完成城市

1. `levelProgress` 全部满 6 关
2. 写入 `collectedCats`
3. 写入 `passportStamps`
4. 解锁 `unlockAfterCityId` 的后续城市
5. 预下载下一个城市内容包

## 7. 内容与存档的映射关系

内容系统不直接写存档，它只定义映射规则。

| 内容字段 | 存档字段 | 用途 |
|---------|---------|------|
| `city.id` | `unlockedCities[]` | 城市解锁 |
| `levelPresets[].id` | `levelProgress[cityId][levelId]` | 关卡进度 |
| `city.id` | `collectedCats[]` | 猫猫图鉴完成态 |
| `city.id` | `passportStamps[]` | 护照盖章完成态 |
| `bundle.packId` | 不入存档 | 运行时加载决策 |
| `contentVersion` | 不入存档 | 内容升级和兼容判定 |

规则：

- 存档永远记录 `cityId`，不记录中文名
- `cat.id` 和 `passport.stampId` 只作为配置内标识，MVP 存档阶段继续只记 `cityId`
- 这样后面猫猫重命名、护照表现样式调整、城市文案微调都不影响旧存档

## 8. 分包与资源边界

### 8.1 包划分原则

- 主包只放启动必需内容
- 分包按“玩家最可能连续访问的内容”组织，而不是按文件类型组织
- 对 MVP 来说，推荐：
  - 主包：框架、通用 UI、北京城市包
  - 亚洲分包：其余 5 个城市

### 8.2 Bundle 元数据

每个城市都带自己的包信息：

```javascript
bundle: {
  packId: 'asia-rest',
  preload: 'on-city-page',
}
```

`preload` 枚举建议：

- `startup`：随启动主包一起可用
- `on-city-page`：进入城市页即预下载
- `on-demand`：用户点击城市时再拉取

### 8.3 资源命名规则

- 猫猫封面：`images/cats/cat_{cityId}.png`
- 猫猫缩略图：`images/cats/cat_{cityId}_thumb.png`
- 元素图标：`images/elements/{cityId}/{cityId}_{seq}.png`
- 分享资源如需额外图层：`images/share/{cityId}_*.png`

## 9. 校验体系

### 9.1 结构校验

结构校验回答“字段有没有、类型对不对”。

校验项：

- 必填字段完整
- 枚举值合法
- `levelPresets` 固定为 6 个
- `elements.length` 在 12-15 之间
- `piecesPerElement` 为 3 的倍数

### 9.2 语义校验

语义校验回答“内容合理不合理”。

校验项：

- 5 类目配比满足：`landmark >= 2`、`food >= 3`、`culture >= 2`、`item >= 2`、`nature >= 2`
- 同城市元素名称不能重复
- `unlockAfterCityId` 必须和洲内顺序一致
- `display.bgColor` 与封面资源不能缺失
- `cat.id` 与 `city.id` 一一对应

### 9.3 跨文件校验

跨文件校验回答“城市、洲、资源之间有没有断链”。

校验项：

- `continent.cityIds` 里的每个城市文件都存在
- `city.continentId` 必须回指到合法洲
- `cover.catImage`、`cover.catThumb`、`elements[].image` 必须存在
- `unlockOrder` 和 `sortOrder` 不冲突

### 9.4 校验输出

校验输出分两类：

- `error`：阻止入库，比如资源缺失、id 重复、类目不达标
- `warning`：允许入库，但需要人工确认，比如 `funFact` 过长、色彩接近、标签过少

推荐接口：

```javascript
validateContinent(continentConfig)
validateCity(cityConfig, allContinentConfigs)
validateAssetPaths(cityConfig, assetIndex)
```

## 10. 内容扩展流程

新增一个城市时，流程固定为：

1. 创建 `CityManifest`
2. 准备 12-15 个元素图标
3. 准备猫猫封面和缩略图
4. 补齐护照和分享文案
5. 跑内容校验
6. 跑难度生成器验证 6 个基础关卡
7. 把城市 id 挂到对应洲的 `cityIds` 和 `unlockOrder`
8. 再跑一次跨文件校验

只有第 7 步会影响洲索引，其余步骤都不该动玩法代码。

## 11. 版本与兼容策略

### 11.1 contentVersion

- `contentVersion` 用来标记城市配置版本
- 仅当字段结构变化或默认行为变化时递增
- 纯文案或美术替换不必改版本

### 11.2 删除与下线

上线后不建议真正删除城市 id。

若后续城市下线：

- 内容层标为 `disabled: true`
- 入口层不再展示
- 存档里旧 `cityId` 仍然保留，避免脏存档

## 12. 对工程实现的要求

内容系统落地时需要优先保证这些接口稳定：

```javascript
getContinentList()
getContinent(continentId)
getCity(cityId)
getCityCardView(cityId, playerState)
getLevelPreset(cityId, levelId)
ensureCityBundle(cityId)
validateContent()
```

这批接口一旦稳定，UI、地图、图鉴、护照、分享页都能复用同一层内容数据。

## 13. 本文档不负责的事情

以下内容不在 04 文档内定义：

- 具体关卡布局算法
- overlap graph 结构
- solver / validator 的实现
- 道具状态机细节

这些交给 [05-difficulty-generator.md](./05-difficulty-generator.md)。
