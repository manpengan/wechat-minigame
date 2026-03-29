# 美术生产指南 — 城市抓猫猫

## 1. 总体风格定义

风格关键词：扁平冰箱贴风（Flat fridge magnet style）

- 圆角矩形白底卡片
- 高饱和度彩色图标
- 1px 浅灰描边
- 微投影（轻微立体感）
- 简洁线条，无复杂细节
- 可爱、清新、适合小尺寸显示

参考风格：旅行冰箱贴、emoji sticker pack、Notion 风格图标

## 2. 素材类型与规格

| 素材类型 | 尺寸 | 格式 | 数量/城市 | AI Prompt 后缀 |
|---------|------|------|----------|---------------|
| 元素图标 | 128×128px @2x | PNG 透明底 | 12-15 个 | 见模板 A |
| 猫猫封面 | 256×256px @2x | PNG 透明底 | 1 个 | 见模板 B |
| 猫猫缩略图 | 128×128px @2x | PNG 透明底 | 1 个 | 同封面缩小 |
| 冰箱贴（收集品版） | 128×128px @2x | PNG 透明底 | 6 个/城市 | 同元素图标 |
| 城市邮票 | 192×256px @2x | PNG 透明底 | 1 个/城市 | 见模板 C |
| 地区猫猫 | 256×256px @2x | PNG 透明底 | 8 个（中国） | 见模板 D |
| 国家动物 | 256×256px @2x | PNG 透明底 | 按国家 | 见模板 E |
| 洲地图 | 512×512px @2x | PNG 透明底 | 6 张 | 见模板 F |

## 3. Prompt 模板

### 模板 A — 城市元素图标

```
Base prompt:
flat design icon of [物品名], [物品描述], cute sticker style,
rounded rectangle white background with thin light gray border,
subtle drop shadow, high saturation colors, simple clean lines,
no text, isolated on white background, 128x128px

Color guidance: [城市主色调] accent

Negative prompt:
realistic, 3D render, photograph, complex details, text, watermark, blurry, dark
```

示例 — 北京糖葫芦：

```
flat design icon of Chinese tanghulu (candied hawthorn on stick), red glossy berries on wooden stick, cute sticker style, rounded rectangle white background with thin light gray border, subtle drop shadow, high saturation colors, simple clean lines, no text, isolated on white background
```

### 模板 B — 城市猫猫封面

```
Base prompt:
flat design cat head icon, front-facing [毛色] cat with [花纹] pattern,
wearing [装饰], [表情] expression, cute kawaii style,
simple clean lines, sticker style, white background, no text,
high saturation colors, 256x256px

Negative prompt:
realistic, photograph, full body, complex background, text, watermark
```

示例 — 北京猫猫（京京）：

```
flat design cat head icon, front-facing orange tabby cat with darker orange stripes, wearing a traditional Chinese tiger hat (虎头帽), cute smiling expression, kawaii style, simple clean lines, sticker style, white background, no text, high saturation colors
```

### 模板 C — 城市邮票

```
flat design postage stamp of [城市名], vintage stamp border with perforated edges,
[城市标志元素] in center, city name "[英文名]" at bottom,
[城市主色调] color scheme, retro travel poster style,
simple clean illustration, no photograph, white background
```

### 模板 D — 地区猫猫（中国）

```
flat design cat head icon, front-facing [品种] cat,
[毛色和花纹描述], wearing [地区特色装饰],
cute kawaii style, simple clean lines, sticker style,
white background, no text, high saturation colors
```

### 模板 E — 国家代表动物

```
flat design icon of [动物名], cute cartoon style,
wearing [国家特色小装饰], [国旗配色 accent],
simple clean lines, sticker style, rounded rectangle white background,
thin light gray border, subtle drop shadow, no text, isolated on white
```

### 模板 F — 洲地图

```
flat design illustrated map of [洲名], [风格描述],
showing continent outline with cute landmark icons,
[色调] color scheme, hand-drawn travel map style,
simple clean illustration, white background, no text labels
```

## 4. 色彩参照

| 城市 | 主色 | HEX | 应用 |
|------|------|-----|------|
| 北京 | 中国红 | #CC2936 | 元素边框高亮、邮票底色 |
| 东京 | 樱花粉红 | #E84057 | — |
| 曼谷 | 泰国金 | #FFB347 | — |
| 首尔 | 太极蓝 | #4A90D9 | — |
| 新加坡 | 热带绿 | #00A896 | — |
| 伊斯坦布尔 | 奥斯曼蓝 | #1A5276 | — |

## 5. AI 工具推荐

| 工具 | 优势 | 推荐用途 |
|------|------|---------|
| Midjourney V6 | 风格一致性最好 | 元素图标、猫猫 |
| DALL-E 3 | Prompt 理解力强 | 邮票、地图 |
| Stable Diffusion + ControlNet | 可控性最高 | 批量统一风格 |

## 6. 后处理 Checklist

每张图 AI 出图后需要人工修正：

- [ ] 去除多余背景（确保透明底）
- [ ] 统一尺寸裁切（元素 128px / 猫猫 256px）
- [ ] 检查线条粗细一致性
- [ ] 调整饱和度到统一水平
- [ ] 添加白底圆角矩形卡片背景（如果 AI 没生成）
- [ ] 添加 1px 浅灰描边 + 微投影
- [ ] 导出 @2x PNG
- [ ] 按命名规范重命名

## 7. 命名规范

```
元素图标：  images/elements/{cityId}/{cityId}_{序号}.png
猫猫封面：  images/cats/cat_{cityId}.png
猫猫缩略图：images/cats/cat_{cityId}_thumb.png
冰箱贴：    images/magnets/{cityId}/magnet_{cityId}_{levelId}.png
邮票：      images/stamps/stamp_{cityId}.png
地区猫猫：  images/cats/region/cat_{regionId}.png
国家动物：  images/animals/animal_{countryId}.png
洲地图：    images/maps/map_{continentId}.png
```

## 8. 生产优先级

| 优先级 | 素材 | 数量 | 说明 |
|--------|------|------|------|
| P0 | 北京 14 元素 + 猫猫 | 15 张 | 首城，开发验证用 |
| P0 | 通用 UI（按钮、槽位、背景） | ~10 张 | 游戏核心界面 |
| P1 | 其他 5 城市元素 + 猫猫 | ~75 张 | MVP 完整内容 |
| P1 | 6 城市邮票 | 6 张 | 收集系统 |
| P2 | 音效 | 6-8 个 | 通用交互音 |
| P3 | 地区猫猫、国家动物、洲地图 | ~20 张 | V1.1+ |
