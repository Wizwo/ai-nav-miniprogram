const { getHomeData } = require('../../utils/api.js')
const { THEME } = require('../../utils/constants.js')

Page({
  data: {
    loading: true,
    error: null,
    categories: [],
    featuredTools: [],
    latestTools: [],
    hotTools: [],
    banners: [
      { id: 1, title: '发现AI新工具', subtitle: '每周更新100+优质AI应用', color: '#667eea' },
      { id: 2, title: 'AI工具排行',   subtitle: '真实用户评分与使用数据',  color: '#f093fb' },
      { id: 3, title: '免费工具精选', subtitle: '精选免费AI工具合集',      color: '#4facfe' },
    ],
    currentBanner: 0,
    THEME,
  },

  onLoad() {
    this.fetchHome()
  },

  async fetchHome() {
    this.setData({ loading: true, error: null })
    try {
      const data = await getHomeData()
      this.setData({
        loading: false,
        categories:    data.categories,
        featuredTools: data.featuredTools,
        latestTools:   data.latestTools,
        hotTools:      data.hotTools,
      })
    } catch (e) {
      this.setData({ loading: false, error: e.message })
      wx.showToast({ title: '加载失败，下拉重试', icon: 'none' })
    }
  },

  onPullDownRefresh() {
    this.fetchHome().finally(() => wx.stopPullDownRefresh())
  },

  // 跳转分类页
  goToCategory(e) {
    const { id, name } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/category/category?id=${id}&name=${encodeURIComponent(name)}` })
  },

  // 跳转详情页
  goToDetail(e) {
    wx.navigateTo({ url: `/pages/detail/detail?id=${e.currentTarget.dataset.id}` })
  },

  // 跳转搜索（Tab页必须用switchTab）
  goToSearch() {
    wx.switchTab({ url: '/pages/search/search' })
  },

  onBannerChange(e) {
    this.setData({ currentBanner: e.detail.current })
  },

  // 图片加载失败兜底
  onImgErr(e) {
    const { id } = e.currentTarget.dataset
    const key = `tools[${e.target.dataset.idx}].logo`
    // 动态设置默认图标
    this.setData({ [key]: '/assets/logos/default.png' })
  },
})
