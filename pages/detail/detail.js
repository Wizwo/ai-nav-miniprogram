const { aiTools } = require('../../utils/ai_tools.js')
Page({
  data: { tool: null, collected: false },
  onLoad(options) {
    const id = parseInt(options.id)
    const tool = aiTools.find(t => t.id === id)
    if (tool) {
      this.setData({ tool })
      wx.setNavigationBarTitle({ title: tool.name })
      const collected = wx.getStorageSync('collected') || []
      this.setData({ collected: collected.includes(id) })
    }
  },
  toggleCollect() {
    let collected = wx.getStorageSync('collected') || []
    const id = this.data.tool.id
    if (collected.includes(id)) {
      collected = collected.filter(c => c !== id)
      this.setData({ collected: false })
      wx.showToast({ title: '已取消收藏', icon: 'none' })
    } else {
      collected.push(id)
      this.setData({ collected: true })
      wx.showToast({ title: '已收藏', icon: 'none' })
    }
    wx.setStorageSync('collected', collected)
  },
  copyUrl() {
    wx.setClipboardData({ data: this.data.tool.url, success: () => { wx.showToast({ title: '链接已复制', icon: 'none' }) } })
  },
  openUrl() {
    if (this.data.tool.url) {
      wx.setClipboardData({ data: this.data.tool.url, success: () => { wx.showToast({ title: '链接已复制，请在浏览器打开', icon: 'none' }) } })
    }
  },
  onImgErr(e) { this.setData({ 'tool.logo': '/assets/logos/default.png' }) },
})