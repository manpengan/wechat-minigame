# 03 Content Pipeline — 城市抓猫猫

## 1. 城市数据结构

每个城市是一个独立的内容包。使用 JS module 格式（微信小游戏 `require()` 不支持 JSON）。

### 1.1 城市配置

```javascript
// cities/beijing.js
module.exports = {
  id: 'beijing',
  name: '北京',
  nameEn: 'Beijing',
  continent: 'asia',
  // 地图封面
  cover: {
    catImage: 'images/cats/beijing.png',    // 猫猫头像
    bgColor: '#CC2936',                      // 城市主色调
  },
  // 城市文化信息
  culture: {
    tagline: '天安门前看猫猫',               // 一句话标语
    funFact: '北京是世界上拥有最多宫殿的城市', // 文化冷知识
  },
  // 特色元素列表（12-15个）
  elements: [
    { id: 'beijing_01', name: '糖葫芦', category: 'food', image: 'elements/beijing/tanghulu.png' },
    { id: 'beijing_02', name: '京剧脸谱', category: 'culture', image: 'elements/beijing/opera_mask.png' },
    // ... 12-15 个
  ],
  // 关卡配置（6关）
  levels: [
    { id: 1, elementCount: 6,  piecesPerElement: 3, layers: 2, density: 'low' },
    { id: 2, elementCount: 7,  piecesPerElement: 3, layers: 2, density: 'low' },
    { id: 3, elementCount: 8,  piecesPerElement: 3, layers: 3, density: 'medium' },
    { id: 4, elementCount: 9,  piecesPerElement: 3, layers: 3, density: 'medium' },
    { id: 5, elementCount: 10, piecesPerElement: 3, layers: 4, density: 'medium_high' },
    { id: 6, elementCount: 10, piecesPerElement: [3,3,3,3,3,6,3,3,3,3], layers: 4, density: 'high' },
  ],
}
```

**字段说明：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | Y | 城市唯一标识，小写英文，用于文件路径 |
| `name` | string | Y | 中文名 |
| `nameEn` | string | Y | 英文名 |
| `continent` | string | Y | 所属洲 id |
| `cover.catImage` | string | Y | 猫猫头像路径（相对于资源根目录） |
| `cover.bgColor` | string | Y | 城市主色调 HEX |
| `culture.tagline` | string | Y | 一句话标语，不超过 10 个字 |
| `culture.funFact` | string | Y | 文化冷知识，不超过 25 个字 |
| `elements[].id` | string | Y | 格式 `{city_id}_{两位序号}` |
| `elements[].name` | string | Y | 元素中文名 |
| `elements[].category` | string | Y | 分类：`food` / `culture` / `landmark` / `nature` / `item` |
| `elements[].image` | string | Y | 图片路径（相对于资源根目录） |
| `levels[].piecesPerElement` | number\|number[] | Y | 3 的倍数；数组时长度须等于 `elementCount` |

### 1.2 洲索引配置

```javascript
// continents/asia.js
module.exports = {
  id: 'asia',
  name: '亚洲',
  nameEn: 'Asia',
  bgColor: '#FF6B6B',
  cities: ['beijing', 'tokyo', 'bangkok', 'seoul', 'singapore', 'istanbul'],
  unlockOrder: ['beijing', 'tokyo', 'bangkok', 'seoul', 'singapore', 'istanbul'],
}
```

`unlockOrder` 决定城市解锁顺序：通关前一个城市后解锁下一个。

---

## 2. 素材规范

### 2.1 元素图标

| 项目 | 规范 |
|------|------|
| 尺寸 | 128x128px @2x（实际渲染 64x64） |
| 格式 | PNG，透明背景 |
| 风格 | 扁平冰箱贴风 -- 圆角矩形白底 + 彩色图标 + 1px 浅灰描边 + 微投影 |
| 色彩 | 高饱和度，同城市内元素色彩需有区分度（消除时快速识别） |
| 命名 | `{city_id}_{序号}.png`，如 `beijing_01.png` |

### 2.2 猫猫头像

| 项目 | 规范 |
|------|------|
| 尺寸 | 封面 256x256px @2x + 图鉴 128x128px @2x |
| 格式 | PNG，透明背景 |
| 风格 | 正面朝向的扁平猫猫头，统一基础轮廓 + 城市特色装饰 |
| 差异化 | 通过颜色、花纹、头饰/装饰体现城市特色 |
| 命名 | `cat_{city_id}.png`（封面）、`cat_{city_id}_thumb.png`（图鉴） |

### 2.3 城市背景

- 不做复杂背景图
- 用城市主色调 (`bgColor`) 作为纯色/渐变底
- 可选：底部用 2-3 个城市地标的简笔剪影

### 2.4 音效

| 音效 | 描述 | 时长 |
|------|------|------|
| 点击拾取 | 轻快的"叮" | 0.1s |
| 三消消除 | 满足感的"嗒嗒嗒"连续音 | 0.3s |
| 通关 | 猫叫 + 欢快音效 | 1s |
| 失败 | 温和的失望音（不要太负面） | 0.5s |

格式要求：MP3，单声道，44.1kHz，单个文件 < 50KB。

---

## 3. 猫猫生成规则

### 3.1 基础模板

所有猫猫基于统一的基础轮廓模板：

- 圆形头部
- 三角形耳朵
- 简笔五官（两眼 + 鼻 + 嘴 + 胡须）

### 3.2 差异化参数

| 参数 | 说明 | 示例 |
|------|------|------|
| `baseColor` | 主体毛色 | 北京: 橘色, 东京: 白色 |
| `pattern` | 花纹类型 | 虎斑 / 纯色 / 三花 / 奶牛 |
| `patternColor` | 花纹颜色 | -- |
| `accessory` | 头饰/装饰 | 北京: 虎头帽, 东京: 招财猫铃铛 |
| `expression` | 表情 | 微笑 / 眯眼 / 吐舌 |

### 3.3 生产流程

1. 用 AI 工具（Midjourney / DALL-E / Stable Diffusion）按参数生成初稿
2. Prompt 模板：
   ```
   flat design cat head icon, {baseColor} cat with {pattern},
   wearing {accessory}, cute, simple, sticker style,
   white background, no text
   ```
3. 人工修正：统一线条粗细、色彩饱和度、整体风格一致性
4. 导出 2 个尺寸（256px + 128px）

---

## 4. 关卡配置格式

### 4.1 难度参数

```javascript
{
  elementCount: 8,        // 使用多少种元素
  piecesPerElement: 3,    // 每种元素几个（必须是 3 的倍数）
  layers: 3,              // 堆叠层数
  density: 'medium',      // 遮挡密度：low / medium / medium_high / high
}
```

**难度递进规律：** 关 1-2 低密度入门 -> 关 3-4 中密度爬坡 -> 关 5-6 高密度挑战。关 6 允许 `piecesPerElement` 为数组，制造不均匀分布的额外难度。

### 4.2 关卡布局生成

不手工摆放物件位置，用程序化生成器：

- **输入：** 难度参数 + 城市元素列表
- **输出：** 每个物件的 `{ elementId, x, y, layer, rotation }`
- **生成约束：**
  - 每层物件不超过总数的 40%
  - 最底层至少有 30% 的物件初始可点击
  - 保证可解性（从目标状态反向推导）

### 4.3 难度验证

用脚本模拟 1000 次随机合理操作，验证通关率：

| 关卡 | 目标通关率 |
|------|-----------|
| 关 1 | > 95% |
| 关 2 | > 90% |
| 关 3 | > 80% |
| 关 4 | > 70% |
| 关 5 | > 60% |
| 关 6 | 50-60% |

失败率过高时降低 `density` 或 `layers`。

---

## 5. 分包策略

### 5.1 包体划分

```
主包（<= 4MB）：
├── game.js + js/（核心框架、渲染引擎、游戏逻辑）    ~150KB
├── images/ui/（通用 UI 元素、按钮、图标）            ~300KB
├── images/cats/beijing.png（首个城市猫猫头像）        ~50KB
├── audio/（通用音效，6-8 个）                        ~300KB
├── cities/beijing.js（首个城市数据配置）               ~5KB
└── images/elements/beijing/（首个城市元素图标）       ~200KB
                                                    ─────────
                                                    ~1005KB

分包 - 城市包（每包 <= 2MB）：
└── sub-asia/
    ├── cities/tokyo.js + bangkok.js + ...
    ├── images/elements/tokyo/ + bangkok/ + ...
    └── images/cats/tokyo.png + bangkok.png + ...
```

### 5.2 首包预算分配

| 内容 | 预估大小 | 说明 |
|------|---------|------|
| 代码（框架 + 逻辑） | ~150KB | 纯 Canvas 手写，无引擎 |
| 通用 UI 素材 | ~300KB | 按钮、图标、背景、字体 |
| 首城市素材（北京） | ~250KB | 15 元素 + 猫猫 + 封面 |
| 音效 | ~300KB | 6-8 个通用音效 |
| **合计** | **~1000KB** | **利用率 25%，空间充裕** |

### 5.3 加载策略

- 进入洲页面时预下载该洲分包（`wx.preDownloadSubpackage`）
- 单个城市包预估：配置 ~5KB + 元素图 15x10KB = ~155KB + 猫猫 ~30KB = ~190KB
- 6 城市约 1.14MB，在分包限制内

---

## 6. MVP 城市清单与素材计划

### 6.1 首批 6 城市

| 城市 | 元素主题方向 | 猫猫特色 |
|------|------------|---------|
| 北京 | 糖葫芦、京剧脸谱、天安门、烤鸭、兔儿爷、长城砖、故宫角楼、豆汁、二锅头、鸟巢、铜锣、毛笔 | 橘猫 + 虎头帽 |
| 东京 | 寿司、招财猫、富士山、樱花、鸟居、拉面、抹茶、浮世绘、新干线、达摩、和服扇、章鱼烧 | 白猫 + 招财猫铃铛 |
| 曼谷 | 冬阴功、嘟嘟车、大象、泰拳手套、芒果糯米饭、金佛、莲花、榴莲、泰丝、椰子、船面、佛塔 | 暹罗猫配色 + 泰式花环 |
| 首尔 | 泡菜坛、石锅拌饭、韩服、景福宫、烧酒瓶、年糕、K-pop 话筒、太极旗扇、韩式炸鸡、柿子、海苔卷 | 韩国短尾猫 + 韩服小帽 |
| 新加坡 | 鱼尾狮、辣椒螃蟹、榴莲建筑、叻沙、金沙酒店、兰花、肉骨茶、冰激凌三明治、组屋、咖椰吐司 | 花猫 + 小狮子鬃毛 |
| 伊斯坦布尔 | 土耳其红茶、蓝色清真寺、热气球、烤肉串、郁金香、恶魔之眼、土耳其冰淇淋、地毯、石榴、旋转舞裙 | 安哥拉猫 + 恶魔之眼项圈 |

### 6.2 生产时间估算（单城市）

| 步骤 | 耗时 | 说明 |
|------|------|------|
| 元素清单确认 | 0.5h | 确定 12-15 个特色元素 |
| AI 出图 | 1h | Prompt 生成 + 筛选 |
| 人工修正 | 2-3h | 统一风格、调色、切图 |
| 猫猫设计 | 1h | AI 出图 + 人工修正 |
| 数据配置 | 0.5h | 写城市 JS module |
| **单城市合计** | **5-6h** | -- |
| **6 城市合计** | **30-36h** | 可并行压缩 |
