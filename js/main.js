import { createContentSystem, createDefaultPlayerState } from './content/index.js'
import { createSceneStore } from './ui/scene-store.js'

const {
  windowWidth,
  windowHeight,
  pixelRatio = 1,
} = wx.getSystemInfoSync()

const canvas = wx.createCanvas()
canvas.width = windowWidth * pixelRatio
canvas.height = windowHeight * pixelRatio

const ctx = canvas.getContext('2d')
ctx.scale(pixelRatio, pixelRatio)
ctx.textBaseline = 'middle'

const STORAGE_KEY = 'player_state'
const contentSystem = createContentSystem()
const playerState = loadPlayerState()
const sceneStore = createSceneStore({ contentSystem, playerState })
const hitTargets = []
let transientMessage = ''
let transientMessageUntil = 0

function loadPlayerState() {
  try {
    const stored = wx.getStorageSync(STORAGE_KEY)
    if (!stored) {
      return createDefaultPlayerState()
    }

    return {
      ...createDefaultPlayerState(),
      ...stored,
      inventory: {
        ...createDefaultPlayerState().inventory,
        ...(stored.inventory ?? {}),
      },
      settings: {
        ...createDefaultPlayerState().settings,
        ...(stored.settings ?? {}),
      },
      stats: {
        ...createDefaultPlayerState().stats,
        ...(stored.stats ?? {}),
      },
      cityTeam: {
        ...createDefaultPlayerState().cityTeam,
        ...(stored.cityTeam ?? {}),
      },
    }
  } catch {
    return createDefaultPlayerState()
  }
}

function savePlayerState() {
  try {
    wx.setStorageSync(STORAGE_KEY, playerState)
  } catch {
    // Ignore storage write failures in the MVP shell.
  }
}

function triggerInviteShare() {
  playerState.stats.totalShareCount += 1
  savePlayerState()

  if (typeof wx.shareAppMessage === 'function') {
    try {
      wx.shareAppMessage({
        title: '一起来抓猫猫！',
        query: 'from=invite',
      })
      showTransientMessage('已打开分享卡片')
      return
    } catch {
      // Fall through to local feedback.
    }
  }

  showTransientMessage('分享入口已触发，真机再校验分享卡片')
}

function drawRoundedRect(x, y, width, height, radius) {
  const clampedRadius = Math.min(radius, width / 2, height / 2)

  ctx.beginPath()
  ctx.moveTo(x + clampedRadius, y)
  ctx.lineTo(x + width - clampedRadius, y)
  ctx.arcTo(x + width, y, x + width, y + clampedRadius, clampedRadius)
  ctx.lineTo(x + width, y + height - clampedRadius)
  ctx.arcTo(x + width, y + height, x + width - clampedRadius, y + height, clampedRadius)
  ctx.lineTo(x + clampedRadius, y + height)
  ctx.arcTo(x, y + height, x, y + height - clampedRadius, clampedRadius)
  ctx.lineTo(x, y + clampedRadius)
  ctx.arcTo(x, y, x + clampedRadius, y, clampedRadius)
  ctx.closePath()
}

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, windowWidth, windowHeight)
  gradient.addColorStop(0, '#fff7ef')
  gradient.addColorStop(1, '#ffe1d6')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, windowWidth, windowHeight)
}

function registerHitTarget(target) {
  hitTargets.push(target)
}

function resetHitTargets() {
  hitTargets.length = 0
}

function showTransientMessage(message, durationMs = 1800) {
  transientMessage = message
  transientMessageUntil = Date.now() + durationMs
}

function hashStringToHue(value) {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % 360
  }

  return hash
}

function getElementStyle(elementId) {
  const hue = hashStringToHue(elementId)

  return {
    fill: `hsl(${hue} 82% 87%)`,
    border: `hsl(${hue} 58% 52%)`,
  }
}

function hitTest(x, y) {
  for (let index = hitTargets.length - 1; index >= 0; index -= 1) {
    const target = hitTargets[index]
    if (
      x >= target.x
      && x <= target.x + target.width
      && y >= target.y
      && y <= target.y + target.height
    ) {
      return target
    }
  }

  return null
}

function drawHeader(title, subtitle) {
  ctx.fillStyle = '#231f2a'
  ctx.font = 'bold 30px sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(title, 24, 36)

  if (subtitle) {
    ctx.fillStyle = '#6b6474'
    ctx.font = '15px sans-serif'
    ctx.fillText(subtitle, 24, 64)
  }
}

function drawButton({ x, y, width, height, label, onTap, fillStyle = '#231f2a', textColor = '#ffffff' }) {
  ctx.fillStyle = fillStyle
  drawRoundedRect(x, y, width, height, 14)
  ctx.fill()

  ctx.fillStyle = textColor
  ctx.font = 'bold 16px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(label, x + width / 2, y + height / 2)

  if (onTap) {
    registerHitTarget({ x, y, width, height, onTap })
  }
}

function drawBackButton(onTap) {
  drawButton({
    x: 24,
    y: windowHeight - 58,
    width: 88,
    height: 38,
    label: '返回',
    onTap,
    fillStyle: '#ffffff',
    textColor: '#231f2a',
  })
}

function drawSidebarCard({ x, y, width, height, titleLines, subtitle, onTap, accentColor = '#231f2a' }) {
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = accentColor
  ctx.lineWidth = 2
  drawRoundedRect(x, y, width, height, 16)
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = accentColor
  ctx.font = 'bold 14px sans-serif'
  ctx.textAlign = 'center'
  titleLines.forEach((line, index) => {
    ctx.fillText(line, x + width / 2, y + 34 + index * 18)
  })

  if (subtitle) {
    ctx.fillStyle = '#6b6474'
    ctx.font = '11px sans-serif'
    ctx.fillText(subtitle, x + width / 2, y + height - 20)
  }

  if (onTap) {
    registerHitTarget({ x, y, width, height, onTap })
  }
}

function drawHomeScene() {
  drawHeader('城市抓猫猫', '世界主页面 · 3×3 入口')

  const homeTiles = contentSystem.getHomeTiles(sceneStore.getPlayerState())
  const playerGiftAlbums = contentSystem.getGiftAlbums(sceneStore.getPlayerState())
  const sidebarWidth = Math.max(58, Math.min(70, Math.floor(windowWidth * 0.18)))
  const sidebarGap = 8
  const centerX = 24 + sidebarWidth + sidebarGap
  const centerWidth = windowWidth - 48 - sidebarWidth * 2 - sidebarGap * 2
  const columns = 3
  const cardWidth = (centerWidth - 12 * (columns - 1)) / columns
  const cardHeight = Math.min(118, Math.max(96, Math.floor(windowHeight * 0.15)))
  const startY = 96

  drawSidebarCard({
    x: 24,
    y: startY,
    width: sidebarWidth,
    height: cardHeight,
    titleLines: ['邀请', '好友'],
    subtitle: '分享卡片',
    accentColor: '#FF8A65',
    onTap() {
      triggerInviteShare()
      render()
    },
  })

  drawSidebarCard({
    x: 24,
    y: startY + cardHeight + 12,
    width: sidebarWidth,
    height: cardHeight,
    titleLines: ['开房', 'PK'],
    subtitle: 'V1.1+',
    accentColor: '#7E57C2',
    onTap() {
      showTransientMessage('开房间 PK 需要实时同步，V1.1+ 接入')
      render()
    },
  })

  drawSidebarCard({
    x: windowWidth - 24 - sidebarWidth,
    y: startY,
    width: sidebarWidth,
    height: cardHeight,
    titleLines: ['礼物', '区'],
    subtitle: `${playerGiftAlbums[0].collectedCount + playerGiftAlbums[1].collectedCount} 个收藏`,
    accentColor: '#26A69A',
    onTap() {
      sceneStore.openGiftZone()
      render()
    },
  })

  drawSidebarCard({
    x: windowWidth - 24 - sidebarWidth,
    y: startY + cardHeight + 12,
    width: sidebarWidth,
    height: cardHeight,
    titleLines: ['排行', '榜'],
    subtitle: '城市战队',
    accentColor: '#42A5F5',
    onTap() {
      showTransientMessage('城市排行榜依赖服务端，V1.1+ 接入')
      render()
    },
  })

  homeTiles.forEach((tile, index) => {
    const row = Math.floor(index / columns)
    const column = index % columns
    const x = centerX + column * (cardWidth + 12)
    const y = startY + row * (cardHeight + 12)
    const isLocked = !tile.isUnlocked && tile.id !== 'coming_soon'

    ctx.fillStyle = tile.isUnlocked ? '#ffffff' : '#f0ebe5'
    ctx.strokeStyle = tile.themeColor
    ctx.lineWidth = 2
    drawRoundedRect(x, y, cardWidth, cardHeight, 16)
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = tile.themeColor
    ctx.beginPath()
    ctx.arc(x + cardWidth / 2, y + 34, 22, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 16px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(String(index + 1), x + cardWidth / 2, y + 34)

    ctx.fillStyle = '#231f2a'
    ctx.font = tile.name.length >= 5 ? 'bold 13px sans-serif' : 'bold 16px sans-serif'
    ctx.fillText(tile.name, x + cardWidth / 2, y + 76)

    ctx.fillStyle = '#6b6474'
    ctx.font = '12px sans-serif'
    let subtitle = '后续开放'

    if (tile.id === 'asia') {
      subtitle = 'MVP 已开放'
    } else if (tile.id === 'mashup') {
      subtitle = tile.isUnlocked ? '随机混搭' : '通关 2 城解锁'
    } else if (tile.id === 'coming_soon') {
      subtitle = '新玩法预告'
    } else if (!isLocked) {
      subtitle = '可进入'
    }

    ctx.fillText(subtitle, x + cardWidth / 2, y + 100)

    if (isLocked) {
      ctx.fillStyle = '#8d8694'
      ctx.font = 'bold 12px sans-serif'
      ctx.fillText('LOCK', x + cardWidth / 2, y + 116)
    }

    registerHitTarget({
      x,
      y,
      width: cardWidth,
      height: cardHeight,
      onTap() {
        const result = sceneStore.openHomeTile(tile.id)

        if (!result.opened) {
          if (result.reason === 'locked') {
            showTransientMessage(tile.id === 'mashup' ? '通关 2 个城市后解锁主题大混战' : `${tile.name} 后续开放`)
          } else if (result.reason === 'coming-soon') {
            showTransientMessage('新玩法即将上线，敬请期待！')
          } else if (result.reason === 'mode-unavailable') {
            showTransientMessage('主题大混战入口已预留，玩法实现下一步接入')
          } else {
            showTransientMessage('该入口暂不可用')
          }
        }

        render()
      },
    })
  })
}

function drawCitySelectScene(scene) {
  drawHeader('城市抓猫猫', '亚洲城市页 · 点击已解锁城市')

  const cityCards = contentSystem.listCityCards(scene.continentId, sceneStore.getPlayerState())
  const columns = 3
  const cardWidth = (windowWidth - 24 * 2 - 12 * (columns - 1)) / columns
  const cardHeight = 128
  const startY = 96

  cityCards.forEach((card, index) => {
    const row = Math.floor(index / columns)
    const column = index % columns
    const x = 24 + column * (cardWidth + 12)
    const y = startY + row * (cardHeight + 12)

    ctx.fillStyle = card.isUnlocked ? '#ffffff' : '#ebe5df'
    ctx.strokeStyle = card.isUnlocked ? card.bgColor : '#d3ccc4'
    ctx.lineWidth = 2
    drawRoundedRect(x, y, cardWidth, cardHeight, 16)
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = card.bgColor
    ctx.beginPath()
    ctx.arc(x + cardWidth / 2, y + 34, 22, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#231f2a'
    ctx.font = 'bold 18px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(card.name, x + cardWidth / 2, y + 76)

    ctx.fillStyle = '#6b6474'
    ctx.font = '13px sans-serif'
    ctx.fillText(
      card.isUnlocked ? `${card.completedLevels}/${card.totalLevels} 关` : '未解锁',
      x + cardWidth / 2,
      y + 100,
    )

    if (card.isUnlocked) {
      registerHitTarget({
        x,
        y,
        width: cardWidth,
        height: cardHeight,
        onTap() {
          sceneStore.openCity(card.cityId)
          render()
        },
      })
    }
  })
}

function drawLevelSelectScene(scene) {
  const city = contentSystem.getCity(scene.cityId)

  drawHeader(city.display.name, `${city.display.tagline} · 选择关卡`)

  const columns = 2
  const cardWidth = (windowWidth - 24 * 2 - 14) / columns
  const cardHeight = 100
  const startY = 104

  scene.levels.forEach((level, index) => {
    const row = Math.floor(index / columns)
    const column = index % columns
    const x = 24 + column * (cardWidth + 14)
    const y = startY + row * (cardHeight + 14)

    ctx.fillStyle = level.isUnlocked ? '#ffffff' : '#ebe5df'
    ctx.strokeStyle = level.isCompleted ? city.display.bgColor : '#d7d0c8'
    ctx.lineWidth = 2
    drawRoundedRect(x, y, cardWidth, cardHeight, 16)
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = level.isCompleted ? city.display.bgColor : '#231f2a'
    ctx.font = 'bold 22px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`关卡 ${level.levelId}`, x + 18, y + 28)

    ctx.fillStyle = '#6b6474'
    ctx.font = '14px sans-serif'
    ctx.fillText(
      level.isUnlocked ? (level.isCompleted ? `${'★'.repeat(level.stars || 3)}` : '点击开始') : '未解锁',
      x + 18,
      y + 64,
    )

    if (level.isUnlocked) {
      registerHitTarget({
        x,
        y,
        width: cardWidth,
        height: cardHeight,
        onTap() {
          sceneStore.openLevel(scene.cityId, level.levelId)
          render()
        },
      })
    }
  })

  drawBackButton(() => {
    sceneStore.goBack()
    render()
  })
}

function drawGiftZoneScene(scene) {
  const playerStateSnapshot = sceneStore.getPlayerState()
  const albums = contentSystem.getGiftAlbums(playerStateSnapshot)
  const entries = contentSystem.getGiftAlbumEntries(scene.selectedTab, playerStateSnapshot)

  drawHeader('城市主题礼物区', 'MVP 收集册 · 冰箱贴 / 邮票')

  const summaryX = 24
  const summaryY = 92
  const summaryWidth = windowWidth - 48
  const summaryHeight = 52

  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = '#d7d0c8'
  ctx.lineWidth = 2
  drawRoundedRect(summaryX, summaryY, summaryWidth, summaryHeight, 16)
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = '#231f2a'
  ctx.font = 'bold 14px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(
    albums.map((album) => `${album.name} ${album.collectedCount}/${album.totalCount}`).join('  ·  '),
    summaryX + summaryWidth / 2,
    summaryY + summaryHeight / 2,
  )

  const tabWidth = (windowWidth - 24 * 2 - 12) / 2
  const tabsY = 158

  albums.forEach((album, index) => {
    drawButton({
      x: 24 + index * (tabWidth + 12),
      y: tabsY,
      width: tabWidth,
      height: 42,
      label: album.name,
      fillStyle: scene.selectedTab === album.id ? '#231f2a' : '#ffffff',
      textColor: scene.selectedTab === album.id ? '#ffffff' : '#231f2a',
      onTap() {
        sceneStore.selectGiftTab(album.id)
        render()
      },
    })
  })

  const columns = 2
  const cardWidth = (windowWidth - 24 * 2 - 14) / columns
  const cardHeight = 82
  const startY = 216

  entries.forEach((entry, index) => {
    const row = Math.floor(index / columns)
    const column = index % columns
    const x = 24 + column * (cardWidth + 14)
    const y = startY + row * (cardHeight + 12)

    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = entry.themeColor
    ctx.lineWidth = 2
    drawRoundedRect(x, y, cardWidth, cardHeight, 16)
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = entry.themeColor
    ctx.font = 'bold 17px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(entry.cityName, x + 16, y + 24)

    ctx.fillStyle = '#6b6474'
    ctx.font = '13px sans-serif'
    if (scene.selectedTab === 'magnets') {
      ctx.fillText(`冰箱贴 ${entry.collectedCount}/${entry.totalCount}`, x + 16, y + 52)
    } else {
      ctx.fillText(entry.isCollected ? '邮票已收集' : '邮票未收集', x + 16, y + 52)
    }
  })

  drawBackButton(() => {
    sceneStore.goBack()
    render()
  })
}

function drawGameplayScene(scene) {
  const city = contentSystem.getCity(scene.cityId)
  const session = scene.session
  const boardState = session.getBoardState()
  const state = session.getState()
  const clickableIds = new Set(session.getClickablePieces().map((piece) => piece.id))
  const activePieces = boardState.pieces
    .filter((piece) => !piece.removed)
    .sort((left, right) => left.layer - right.layer)

  const elementNameMap = new Map(city.elements.map((element) => [element.id, element.name]))

  drawHeader(`${city.display.name} · 关卡 ${scene.levelId}`, `${state.slot.length}/7 槽位`)

  drawButton({
    x: windowWidth - 112,
    y: 22,
    width: 88,
    height: 34,
    label: '重开',
    onTap() {
      sceneStore.restartCurrentLevel()
      render()
    },
    fillStyle: '#ffffff',
    textColor: '#231f2a',
  })

  activePieces.forEach((piece) => {
    const style = getElementStyle(piece.elementId)
    const isClickable = clickableIds.has(piece.id)

    ctx.fillStyle = style.fill
    ctx.strokeStyle = isClickable ? style.border : '#c9c1ba'
    ctx.lineWidth = isClickable ? 2 : 1
    ctx.globalAlpha = isClickable ? 1 : 0.5
    drawRoundedRect(piece.x, piece.y, piece.width, piece.height, 12)
    ctx.fill()
    ctx.stroke()
    ctx.globalAlpha = 1

    ctx.fillStyle = '#231f2a'
    ctx.font = 'bold 12px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(
      (elementNameMap.get(piece.elementId) ?? '').slice(0, 2),
      piece.x + piece.width / 2,
      piece.y + piece.height / 2,
    )

    if (isClickable && state.status === 'playing') {
      registerHitTarget({
        x: piece.x,
        y: piece.y,
        width: piece.width,
        height: piece.height,
        onTap() {
          const result = session.pickPiece(piece.id)

          if (result.status === 'won') {
            sceneStore.completeLevel({
              cityId: scene.cityId,
              levelId: scene.levelId,
              stars: 3,
            })
            savePlayerState()
          }

          render()
        },
      })
    }
  })

  const slotY = windowHeight - 126
  const slotWidth = (windowWidth - 24 * 2 - 6 * 8) / 7

  for (let index = 0; index < 7; index += 1) {
    const x = 24 + index * (slotWidth + 8)
    const slotEntry = state.slot[index]

    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = '#d5cec7'
    ctx.lineWidth = 2
    drawRoundedRect(x, slotY, slotWidth, 54, 12)
    ctx.fill()
    ctx.stroke()

    if (slotEntry) {
      const label = elementNameMap.get(slotEntry.elementId) ?? ''
      const style = getElementStyle(slotEntry.elementId)
      ctx.fillStyle = style.border
      ctx.font = 'bold 12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(label.slice(0, 2), x + slotWidth / 2, slotY + 27)
    }
  }

  drawBackButton(() => {
    sceneStore.goBack()
    render()
  })

  if (state.status === 'won' || state.status === 'failed') {
    drawResultOverlay(state.status, city.display.bgColor)
  }
}

function drawResultOverlay(status, accentColor) {
  ctx.fillStyle = 'rgba(35, 31, 42, 0.45)'
  ctx.fillRect(0, 0, windowWidth, windowHeight)

  const boxWidth = windowWidth - 48
  const boxHeight = 180
  const x = 24
  const y = (windowHeight - boxHeight) / 2

  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = accentColor
  ctx.lineWidth = 2
  drawRoundedRect(x, y, boxWidth, boxHeight, 20)
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = '#231f2a'
  ctx.font = 'bold 28px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(status === 'won' ? '通关成功' : '挑战失败', x + boxWidth / 2, y + 48)

  ctx.fillStyle = '#6b6474'
  ctx.font = '15px sans-serif'
  ctx.fillText(
    status === 'won' ? '已记录进度，返回关卡页继续' : '可以重开当前关卡，继续测试核心循环',
    x + boxWidth / 2,
    y + 86,
  )

  drawButton({
    x: x + 20,
    y: y + 120,
    width: (boxWidth - 50) / 2,
    height: 42,
    label: status === 'won' ? '返回关卡' : '返回',
    onTap() {
      sceneStore.goBack()
      render()
    },
    fillStyle: '#ffffff',
    textColor: '#231f2a',
  })

  drawButton({
    x: x + 30 + (boxWidth - 50) / 2,
    y: y + 120,
    width: (boxWidth - 50) / 2,
    height: 42,
    label: status === 'won' ? '下一步再做' : '重新挑战',
    onTap() {
      if (status === 'won') {
        sceneStore.goBack()
      } else {
        sceneStore.restartCurrentLevel()
      }
      render()
    },
    fillStyle: '#231f2a',
    textColor: '#ffffff',
  })
}

function drawTransientMessage() {
  if (!transientMessage || transientMessageUntil <= Date.now()) {
    transientMessage = ''
    transientMessageUntil = 0
    return
  }

  const width = windowWidth - 48
  const height = 44
  const x = 24
  const y = windowHeight - 116

  ctx.fillStyle = 'rgba(35, 31, 42, 0.88)'
  drawRoundedRect(x, y, width, height, 14)
  ctx.fill()

  ctx.fillStyle = '#ffffff'
  ctx.font = '14px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(transientMessage, x + width / 2, y + height / 2)
}

function render() {
  resetHitTargets()
  drawBackground()

  const scene = sceneStore.getScene()

  if (scene.type === 'home-select') {
    drawHomeScene()
    drawTransientMessage()
    return
  }

  if (scene.type === 'city-select') {
    drawCitySelectScene(scene)
    drawTransientMessage()
    return
  }

  if (scene.type === 'level-select') {
    drawLevelSelectScene(scene)
    drawTransientMessage()
    return
  }

  if (scene.type === 'gift-zone') {
    drawGiftZoneScene(scene)
    drawTransientMessage()
    return
  }

  if (scene.type === 'gameplay') {
    drawGameplayScene(scene)
    drawTransientMessage()
  }
}

function handleTouchStart(event) {
  const touch = event.touches?.[0]
  if (!touch) {
    return
  }

  const target = hitTest(touch.clientX, touch.clientY)
  if (target) {
    target.onTap()
  }
}

if (typeof wx.onTouchStart === 'function') {
  wx.onTouchStart(handleTouchStart)
}

render()
