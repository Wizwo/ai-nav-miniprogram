const { searchTools } = require('../../utils/api.js')
const { getRecentSearch, addRecentSearch, clearRecentSearch } = require('../../utils/storage.js')
const { THEME } = require('../../utils/constants.js')

Page({
  data: {
    searchValue: '',
    result: [],
    recentSearch: [],
    hotWords: ['ChatGPT', 'Claude', 'Midjourney', 'AI绘画', '免费工具'],
    showHistory: true,   // 未输入时显示历史/热词
    loading: false,
    THEME,
  },

  onLoad() {
    this.setData({ recentSearch: getRecentSearch() })
  },

  onInput(e) {
    const value = e.detail.value.trim()
    this.setData({ searchValue: value, showHistory: value === '' })
    if (value.length > 0) {
      this.doSearch(value)
    } else {
      this.setData({ result: [] })
    }
  },

  async doSearch(value) {
    this.setData({ loading: true })
    try {
      const result = await searchTools(value)
      this.setData({ result, loading: false })
    } catch (e) {
      this.setData({ result: [], loading: false })
    }
  },

  // 触发搜索（回车/点击搜索按钮）
  onSearch(e) {
    const value = (e.detail?.value || '').trim() || this.data.searchValue.trim()
    if (!value) return
    addRecentSearch(value)
    this.setData({ recentSearch: getRecentSearch(), showHistory: false })
    this.doSearch(value)
  },

  // 清空历史
  onClearHistory() {
    clearRecentSearch()
    this.setData({ recentSearch: [] })
  },

  // 点击历史词 / 热词 / 分类
  onTapChip(e) {
    const value = e.currentTarget.dataset.value
    this.setData({ searchValue: value, showHistory: false })
    addRecentSearch(value)
    this.setData({ recentSearch: getRecentSearch() })
    this.doSearch(value)
  },

  // 跳转详情
  goToDetail(e) {
    wx.navigateTo({ url: `/pages/detail/detail?id=${e.currentTarget.dataset.id}` })
  },
})
