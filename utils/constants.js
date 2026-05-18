// ============================================================
// 全局常量
// ============================================================

module.exports = {
  // ── 主题色 ──
  THEME: {
    PRIMARY:        '#64ffda',   // 主色（青绿）
    PRIMARY_ALPHA:  'rgba(100, 255, 218, 0.15)',
    BG:             '#0f0f1a',   // 页面背景
    BG_CARD:        '#1a1a2e',   // 卡片背景
    BG_CARD2:       '#16213e',   // 卡片背景渐变层
    TEXT:           '#e6e6e6',   // 正文
    TEXT_SEC:       '#a0a0b0',   // 次要文字
    TEXT_MUTED:     '#8892b0',   // 弱化文字
    BORDER:         'rgba(100, 255, 218, 0.08)',
    GOLD:           '#ffd700',
    PURPLE:         '#c792ea',
    BLUE:           '#00b4d8',
    RED:            '#ff6b6b',
    ORANGE:         '#ff9f43',
    PINK:           '#fd79a8',
    VIOLET:         '#a29bfe',
  },

  // ── 分类颜色映射 ──
  CATEGORY_COLORS: {
    '对话助手': '#64ffda',
    'AI绘画':   '#c792ea',
    'AI视频':   '#ff6b6b',
    'AI办公':   '#ffd700',
    '编程工具': '#00b4d8',
    'AI音乐':   '#ff9f43',
    'AI设计':   '#ee5a24',
    '搜索助手': '#64ffda',
    '效率工具': '#a29bfe',
    '学习教育': '#fd79a8',
  },

  // ── API 配置 ──
  API_BASE: 'https://www.aiux.top',
  API_TIMEOUT: 10000,

  // ── 缓存 Key & TTL（秒）──
  CACHE: {
    TOOLS_LIST:  { key: 'cache_tools_list',   ttl: 3600 },
    TOOL_DETAIL: { key: 'cache_tool_detail_', ttl: 7200 },
    COLLECTED:   { key: 'collected',           ttl: 0    },
    RECENT_SEARCH:{ key: 'recentSearch',       ttl: 86400 },
  },

  // ── 工具字段默认值（防图片 404）──
  DEFAULT_LOGO: '/assets/logos/default.png',
}
