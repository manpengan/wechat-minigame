const { windowWidth, windowHeight } = wx.getSystemInfoSync()

const canvas = wx.createCanvas()
const ctx = canvas.getContext('2d')

ctx.fillStyle = '#ffffff'
ctx.fillRect(0, 0, windowWidth, windowHeight)

ctx.fillStyle = '#333333'
ctx.font = '24px sans-serif'
ctx.textAlign = 'center'
ctx.fillText('微信小游戏', windowWidth / 2, windowHeight / 2)
