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
  const playerStateSnapshot = sceneStore.getPlayerState()
  drawHeader('城市抓猫猫', '世界主页面 · 3×3 入口')

  const homeTiles = contentSystem.getHomeTiles(playerStateSnapshot)
  const playerGiftAlbums = contentSystem.getGiftAlbums(playerStateSnapshot)
  const teamCity = playerStateSnapshot.cityTeam?.teamCityId
    ? contentSystem.getCity(playerStateSnapshot.cityTeam.teamCityId)
    : null
  const totalGiftCount = playerGiftAlbums.reduce((sum, album) => sum + album.collectedCount, 0)
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
    subtitle: `${totalGiftCount} 个收藏`,
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
    subtitle: teamCity ? `${teamCity.display.name} 战队` : '选择战队',
    accentColor: '#42A5F5',
    onTap() {
      sceneStore.openCityTeamSelect()
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
  const teamCity = playerStateSnapshot.cityTeam?.teamCityId
    ? contentSystem.getCity(playerStateSnapshot.cityTeam.teamCityId)
    : null

  drawHeader('城市主题礼物区', 'MVP 收集册 · 冰箱贴 / 邮票 / 猫猫')

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

  const teamCardY = 156
  const teamCardHeight = 58

  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = teamCity ? teamCity.display.bgColor : '#8aa3ff'
  ctx.lineWidth = 2
  drawRoundedRect(summaryX, teamCardY, summaryWidth, teamCardHeight, 16)
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = '#231f2a'
  ctx.font = 'bold 15px sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(
    teamCity ? `${teamCity.display.name} 战队` : '还没加入城市战队',
    summaryX + 16,
    teamCardY + 22,
  )

  ctx.fillStyle = '#6b6474'
  ctx.font = '12px sans-serif'
  ctx.fillText(
    teamCity ? '本地已锁定，排行榜继续占位' : '先选已解锁城市，本地状态先走通',
    summaryX + 16,
    teamCardY + 42,
  )

  drawButton({
    x: summaryX + summaryWidth - 116,
    y: teamCardY + 12,
    width: 100,
    height: 34,
    label: teamCity ? '查看战队' : '选择战队',
    onTap() {
      sceneStore.openCityTeamSelect()
      render()
    },
    fillStyle: teamCity ? teamCity.display.bgColor : '#231f2a',
    textColor: '#ffffff',
  })

  const tabGap = 12
  const tabWidth = (windowWidth - 24 * 2 - tabGap * (albums.length - 1)) / albums.length
  const tabsY = 228

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
  const startY = 286

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
    } else if (scene.selectedTab === 'stamps') {
      ctx.fillText(entry.isCollected ? '邮票已收集' : '邮票未收集', x + 16, y + 52)
    } else {
      ctx.fillText(entry.isCollected ? `${entry.catName} 已收集` : '通关城市后收集', x + 16, y + 52)
    }
  })

  drawBackButton(() => {
    sceneStore.goBack()
    render()
  })
}

function drawCityTeamSelectScene(scene) {
  const isLocked = Boolean(scene.selectedTeamCityId)
  const selectedCity = isLocked ? contentSystem.getCity(scene.selectedTeamCityId) : null

  drawHeader(
    '选择城市战队',
    selectedCity ? `当前所属 ${selectedCity.display.name} 战队 · 本地先锁定` : '从已解锁城市里选择一个战队',
  )

  const columns = 2
  const cardWidth = (windowWidth - 24 * 2 - 14) / columns
  const cardHeight = 94
  const startY = 104

  scene.options.forEach((entry, index) => {
    const row = Math.floor(index / columns)
    const column = index % columns
    const x = 24 + column * (cardWidth + 14)
    const y = startY + row * (cardHeight + 12)
    const isSelected = scene.selectedTeamCityId === entry.cityId

    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = entry.themeColor
    ctx.lineWidth = 2
    drawRoundedRect(x, y, cardWidth, cardHeight, 16)
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = entry.themeColor
    ctx.font = 'bold 18px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(entry.cityName, x + 16, y + 24)

    ctx.fillStyle = '#6b6474'
    ctx.font = '13px sans-serif'
    ctx.fillText(`猫猫 ${entry.catName}`, x + 16, y + 48)
    ctx.fillText(isSelected ? '已加入，当前不可更换' : '可加入本地战队', x + 16, y + 72)

    registerHitTarget({
      x,
      y,
      width: cardWidth,
      height: cardHeight,
      onTap() {
        const selected = sceneStore.chooseCityTeam(entry.cityId)
        if (selected) {
          savePlayerState()
          showTransientMessage(`已加入 ${entry.cityName} 战队`)
        } else if (isLocked) {
          showTransientMessage('当前版本先锁定首次选队')
        } else {
          showTransientMessage('只能选择已解锁城市')
        }
        render()
      },
    })
  })

  drawBackButton(() => {
    sceneStore.goBack()
    render()
  })
}

function drawGameplayScene(scene) {
  const isMashup = scene.mode === 'mashup'
  const city = isMashup ? null : contentSystem.getCity(scene.cityId)
  const session = scene.session
  const boardState = session.getBoardState()
  const state = session.getState()
  const clickableIds = new Set(session.getClickablePieces().map((piece) => piece.id))
  const activePieces = boardState.pieces
    .filter((piece) => !piece.removed)
    .sort((left, right) => left.layer - right.layer)
  const elementNameMap = isMashup
    ? new Map(scene.elementDefinitions.map((element) => [element.elementId, element.name]))
    : new Map(city.elements.map((element) => [element.id, element.name]))
  const title = isMashup ? scene.title : `${city.display.name} · 关卡 ${scene.levelId}`
  const subtitle = isMashup
    ? `${scene.subtitle ?? '随机混搭'} · ${state.slot.length}/7 槽位`
    : `${state.slot.length}/7 槽位`

  drawHeader(title, subtitle)

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
            sceneStore.completeGameplayVictory(3)
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
    drawResultOverlay(scene, state.status, isMashup ? scene.accentColor : city.display.bgColor)
  }
}

function drawResultOverlay(scene, status, accentColor) {
  const isMashup = scene.mode === 'mashup'
  const rewardSummary = scene.rewardSummary
  const title = status === 'won' ? '通关成功' : '挑战失败'
  let detail = '可以重开当前关卡，继续测试核心循环'

  if (status === 'won' && isMashup) {
    if (rewardSummary?.type === 'magnet') {
      const rewardCity = contentSystem.getCity(rewardSummary.cityId)
      detail = `奖励：${rewardCity?.display.name ?? rewardSummary.cityId} 冰箱贴 ${rewardSummary.levelId}`
    } else if (rewardSummary?.type === 'inventory') {
      detail = '奖励：Shuffle +1'
    } else {
      detail = '已结算本地混战奖励'
    }
  } else if (status === 'won') {
    detail = '已记录进度，返回关卡页继续'
  }

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
  ctx.fillText(title, x + boxWidth / 2, y + 48)

  ctx.fillStyle = '#6b6474'
  ctx.font = '15px sans-serif'
  ctx.fillText(detail, x + boxWidth / 2, y + 86)

  drawButton({
    x: x + 20,
    y: y + 120,
    width: (boxWidth - 50) / 2,
    height: 42,
    label: status === 'won' ? (isMashup ? '返回主页' : '返回关卡') : '返回',
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
    label: status === 'won' ? (isMashup ? '再来一局' : '下一步再做') : '重新挑战',
    onTap() {
      if (status === 'won') {
        if (isMashup) {
          sceneStore.restartCurrentLevel()
        } else {
          sceneStore.goBack()
        }
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

  if (scene.type === 'city-team-select') {
    drawCityTeamSelectScene(scene)
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
