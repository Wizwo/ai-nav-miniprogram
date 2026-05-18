const { aiTools, categories } = require('../../utils/ai_tools.js')
Page({
  data: { searchValue: '', result: [], recentSearch: [], hotWords: ['ChatGPT', 'AI绘画', '免费工具', 'Claude', 'Midjourney'], categories: categories, showHistory: true },
  onLoad() { const recent = wx.getStorageSync('recentSearch') || []; this.setData({ recentSearch: recent }) },
  onInput(e) {
    const value = e.detail.value.trim()
    this.setData({ searchValue: value, showHistory: value === '' })
    if (value.length > 0) { this.doSearch(value) } else { this.setData({ result: [] }) }
  },
  doSearch(value) {
    const lower = value.toLowerCase()
    const result = aiTools.filter(t => t.name.toLowerCase().includes(lower) || t.category.toLowerCase().includes(lower) || t.shortDesc.toLowerCase().includes(lower) || t.tags.some(tag => tag.toLowerCase().includes(lower)))
    this.setData({ result })
  },
  onSearch(e) {
    const value = e.detail.value.trim() || this.data.searchValue
    if (!value) return
    let recent = wx.getStorageSync('recentSearch') || []
    recent = recent.filter(r => r !== value); recent.unshift(value)
    if (recent.length > 10) recent = recent.slice(0, 10)
    wx.setStorageSync('recentSearch', recent)
    this.setData({ recentSearch: recent, showHistory: false })
    this.doSearch(value)
  },
  clearHistory() { wx.removeStorageSync('recentSearch'); this.setData({ recentSearch: [] }) },
  tapHistory(e) { const value = e.currentTarget.dataset.value; this.setData({ searchValue: value, showHistory: false }); this.doSearch(value) },
  goToDetail(e) { wx.navigateTo({ url: `/pages/detail/detail?id=${e.currentTarget.dataset.id}` }) },
})