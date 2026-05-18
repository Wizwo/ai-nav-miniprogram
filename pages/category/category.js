const { aiTools, categories } = require('../../utils/ai_tools.js')
Page({
  data: { categories, activeCategory: null, categoryName: '', tools: [] },
  onLoad(options) {
    if (options.id) {
      const id = parseInt(options.id)
      const name = options.name || ''
      this.setData({ activeCategory: id, categoryName: name, tools: aiTools.filter(t => t.category === name) })
      wx.setNavigationBarTitle({ title: name })
    } else {
      this.setData({ categories })
    }
  },
  selectCategory(e) {
    const { id, name } = e.currentTarget.dataset
    this.setData({ activeCategory: id, categoryName: name, tools: aiTools.filter(t => t.category === name) })
    wx.setNavigationBarTitle({ title: name })
  },
  goToDetail(e) { wx.navigateTo({ url: `/pages/detail/detail?id=${e.currentTarget.dataset.id}` }) },
})