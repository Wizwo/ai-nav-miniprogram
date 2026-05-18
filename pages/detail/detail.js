const { getToolDetail } = require('../../utils/api.js')
const { toggleCollect, getCollected } = require('../../utils/storage.js')
const { DEFAULT_LOGO } = require('../../utils/constants.js')

Page({
  data: {
    loading: true,
    error: null,
    tool: null,
    collected: false,
  },

  onLoad(options) {
    this.fetchDetail(options.id)
  },

  async fetchDetail(id) {
    this.setData({ loading: true, error: null })
    try {
      const tool = await getToolDetail(id)
      if (!tool) {
        this.setData({ loading: false, error: '工具不存在' })
        return
      }
      const collected = getCollected().includes(Number(id))
      this.setData({ loading: false, tool, collected })
      wx.setNavigationBarTitle({ title: tool.name })
    } catch (e) {
      this.setData({ loading: false, error: e.message })
    }
  },

  // 切换收藏
  toggleCollect() {
    const { tool } = this.data
    if (!tool) return
    const collected = toggleCollect(tool.id)
    this.setData({ collected })
    wx.showToast({ title: collected ? '已收藏' : '已取消', icon: 'none' })
  },

  // 复制链接
  copyUrl() {
    wx.setClipboardData({
      data: this.data.tool?.url || '',
      success: () => wx.showToast({ title: '链接已复制', icon: 'none' }),
    })
  },

  // 访问（复制链接，引导到浏览器）
  openUrl() {
    const url = this.data.tool?.url
    if (!url) return
    wx.setClipboardData({
      data: url,
      success: () => wx.showModal({
        title: '已复制链接',
        content: '请在浏览器打开，或跳转对应App',
        showCancel: false,
      }),
    })
  },

  onImgErr() {
    this.setData({ 'tool.logo': DEFAULT_LOGO })
  },

  onPullDownRefresh() {
    this.fetchDetail(this.data.tool?.id).finally(() => wx.stopPullDownRefresh())
  },
})
