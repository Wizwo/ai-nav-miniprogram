// ============================================================
// storage.js — 封装 wx.getStorageSync，支持 TTL
// ============================================================

/**
 * 读取缓存，自动判断是否过期
 * @param {string} key         完整 key（不含 TTL 后缀）
 * @param {number} ttl         缓存有效期（秒），0 = 不过期
 * @returns {*} value 或 null
 */
function get(key, ttl = 0) {
  try {
    const { value, expire } = wx.getStorageSync(key) || {}
    if (value === undefined) return null
    if (ttl > 0 && expire > 0 && Date.now() > expire) {
      wx.removeStorageSync(key)
      return null
    }
    return value
  } catch (e) {
    return null
  }
}

/**
 * 写入缓存
 * @param {string} key   完整 key
 * @param {*}      value 任意可序列化值
 * @param {number} ttl   有效期（秒），0 = 不过期
 */
function set(key, value, ttl = 0) {
  try {
    const expire = ttl > 0 ? Date.now() + ttl * 1000 : 0
    wx.setStorageSync(key, { value, expire })
  } catch (e) {}
}

/**
 * 删除指定 key
 */
function remove(key) {
  try { wx.removeStorageSync(key) } catch (e) {}
}

/**
 * 读取用户收藏列表
 */
function getCollected() {
  return get('collected', 0) || []
}

/**
 * 切换收藏状态
 * @returns {boolean} 更新后的收藏状态
 */
function toggleCollect(id) {
  const list = getCollected()
  const idx = list.indexOf(id)
  let collected
  if (idx >= 0) {
    list.splice(idx, 1)
    collected = false
  } else {
    list.push(id)
    collected = true
  }
  set('collected', list, 0)
  return collected
}

/**
 * 读取搜索历史
 */
function getRecentSearch() {
  return get('recentSearch', 86400) || []
}

/**
 * 添加搜索词到历史
 */
function addRecentSearch(word) {
  let list = getRecentSearch()
  list = list.filter(w => w !== word)
  list.unshift(word)
  if (list.length > 10) list = list.slice(0, 10)
  set('recentSearch', list, 86400)
  return list
}

/**
 * 清空搜索历史
 */
function clearRecentSearch() {
  remove('recentSearch')
}

module.exports = { get, set, remove, getCollected, toggleCollect, getRecentSearch, addRecentSearch, clearRecentSearch }
