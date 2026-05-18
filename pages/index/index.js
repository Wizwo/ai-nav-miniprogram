const { aiTools, categories } = require('../../utils/ai_tools.js')
Page({
  data: {
    searchWord: '',
    categories: categories,
    featuredTools: [],
    latestTools: [],
    hotTools: [],
    banners: [
      { id: 1, title: '发现AI新工具', subtitle: '每周更新100+优质AI应用', color: '#667eea' },
      { id: 2, title: 'AI工具排行', subtitle: '真实用户评分与使用数据', color: '#f093fb' },
      { id: 3, title: '免费工具精选', subtitle: '精选免费AI工具合集', color: '#4facfe' },
    ],
    currentBanner: 0,
  },
  onLoad() {
    this.setData({
      featuredTools: aiTools.filter(t => t.featured).slice(0, 6),
      latestTools: aiTools.slice(0, 8),
      hotTools: aiTools.filter(t => t.hot).slice(0, 6),
    })
  },
  goToCategory(e) {
    const { id, name } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/category/category?id=${id}&name=${name}` })
  },
  goToDetail(e) {
    wx.navigateTo({ url: `/pages/detail/detail?id=${e.currentTarget.dataset.id}` })
  },
  goToSearch() { wx.switchTab({ url: '/pages/search/search' }) },
  onSearchInput(e) { this.setData({ searchWord: e.detail.value }) },
  onBannerChange(e) { this.setData({ currentBanner: e.detail.current }) },
  onImgErr(e) { this.setData({ 'tool.logo': '/assets/logos/default.png' }) },
})