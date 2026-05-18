const { getCategories, getToolsByCategory } = require('../../utils/api.js')

Page({
  data: {
    loading: true,
    error: null,
    categories: [],
    activeCategory: null,
    categoryName: '',
    tools: [],
  },

  onLoad(options) {
    this.fetchInit(options)
  },

  async fetchInit(options) {
    this.setData({ loading: true, error: null })
    try {
      const categories = await getCategories()
      if (options.id) {
        const id   = parseInt(options.id)
        const name = decodeURIComponent(options.name || '')
        const tools = await getToolsByCategory(name)
        this.setData({ categories, activeCategory: id, categoryName: name, tools })
        wx.setNavigationBarTitle({ title: name })
      } else {
        this.setData({ categories, loading: false })
      }
    } catch (e) {
      this.setData({ loading: false, error: e.message })
    }
  },

  async selectCategory(e) {
    const { id, name } = e.currentTarget.dataset
    this.setData({ activeCategory: id, categoryName: name, loading: true })
    try {
      const tools = await getToolsByCategory(name)
      this.setData({ loading: false, tools })
      wx.setNavigationBarTitle({ title: name })
    } catch (e) {
      this.setData({ loading: false })
      wx.showToast({ title: '加载失败', icon: 'none' })
    }
  },

  goToDetail(e) {
    wx.navigateTo({ url: `/pages/detail/detail?id=${e.currentTarget.dataset.id}` })
  },

  onPullDownRefresh() {
    this.fetchInit({ id: this.data.activeCategory, name: encodeURIComponent(this.data.categoryName) })
      .finally(() => wx.stopPullDownRefresh())
  },
})
