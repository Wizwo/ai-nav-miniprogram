// ============================================================
// request.js — wx.request 封装，统一错误处理 / 超时 / 响应转换
// ============================================================
const { API_BASE, API_TIMEOUT } = require('./constants.js')

/**
 * 统一请求函数
 * @param {object} opts   同 wx.request，新增字段：
 *   - loading : string  加载提示文字，默认 '加载中...'
 *   - silent  : boolean 是否静默（不显示 toast / 错误提示）
 * @returns {Promise<any>} res.data
 */
function request(opts = {}) {
  const {
    url,
    method = 'GET',
    data,
    header = {},
    loading = '加载中...',
    silent = false,
  } = opts

  // 自动拼接 baseURL
  const fullUrl = url.startsWith('http') ? url : API_BASE + url

  // 显示 loading
  if (!silent) wx.showLoading({ title: loading, mask: true })

  return new Promise((resolve, reject) => {
    wx.request({
      url: fullUrl,
      method,
      data,
      header: { 'Content-Type': 'application/json', ...header },
      timeout: API_TIMEOUT,
      success(res) {
        wx.hideLoading()
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
          handleError(res.statusCode, res.data, silent, reject)
        }
      },
      fail(err) {
        wx.hideLoading()
        handleNetworkError(err, silent, reject)
      },
    })
  })
}

function handleError(code, data, silent, reject) {
  const msg = data?.message || `请求失败 (${code})`
  if (!silent) wx.showToast({ title: msg, icon: 'none', duration: 2500 })
  reject(new Error(msg))
}

function handleNetworkError(err, silent, reject) {
  if (!silent) {
    wx.showToast({ title: '网络开小差了~', icon: 'none', duration: 2500 })
  }
  reject(new Error('network_error'))
}

// ── 快捷方法 ──
const get  = (url, data, opts = {}) => request({ url, method: 'GET',  data, ...opts })
const post = (url, data, opts = {}) => request({ url, method: 'POST', data, ...opts })

module.exports = { request, get, post }
