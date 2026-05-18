const formatNumber = (n) => { n = n.toString(); return n[1] ? n : '0' + n }
const formatTime = (date) => {
  const year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate()
  const hour = date.getHours(), minute = date.getMinutes(), second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const debounce = (fn, delay = 300) => { let timer = null; return function(...args) { if (timer) clearTimeout(timer); timer = setTimeout(() => { fn.apply(this, args) }, delay) } }
module.exports = { formatTime, debounce }