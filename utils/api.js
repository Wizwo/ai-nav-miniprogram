// ============================================================
// api.js — 数据服务层，统一 API 调用入口
// 支持：真实接口 > Mock 数据降级
// 调用方只需 import { getToolsList, getToolDetail, searchTools } from './api.js'
// ============================================================
const { get, set } = require('./storage.js')
const { CACHE, API_BASE, DEFAULT_LOGO } = require('./constants.js')
const { get: httpGet } = require('./request.js')

// ──────────────────────────────────────────────────
// 真实接口（项目接入时取消注释并填入真实地址）
// ──────────────────────────────────────────────────
// const BASE = 'https://your-api.com'   // 真实 API 地址
const USE_MOCK = true                    // 调试阶段用 Mock，正式上线改为 false

// ──────────────────────────────────────────────────
// Mock 数据（与 ai_tools.js 同步维护，这里聚合完整字段）
// ──────────────────────────────────────────────────
const _MOCK_TOOLS = [
  {
    id: 1, name: 'ChatGPT', logo: '/assets/logos/chatgpt.png',
    shortDesc: 'OpenAI开发的对话AI模型，支持多轮对话与代码生成',
    description: 'ChatGPT是OpenAI开发的大型语言模型，支持自然语言对话、代码编写、数学解题、内容创作等。最新版本集成了多模态能力，可处理图像、音频和文本。',
    category: '对话助手', catColor: '#64ffda',
    tags: ['免费', '中文', 'API'], free: true, chinese: true, hot: true, featured: true,
    rating: 4.9, users: '10M+', url: 'https://chat.openai.com',
    features: ['多轮对话', '代码生成', '内容创作', '数据分析'],
    pricing: '免费额度有限，Plus订阅$20/月'
  },
  {
    id: 2, name: 'Midjourney', logo: '/assets/logos/midjourney.png',
    shortDesc: 'AI绘画工具，通过文字描述生成精美艺术作品',
    description: 'Midjourney是目前最流行的AI图像生成工具之一，通过简单的文字描述即可生成极具艺术感的图像。支持多种风格调节，适合设计师和创意工作者。',
    category: 'AI绘画', catColor: '#c792ea',
    tags: ['付费', '英文'], free: false, chinese: false, hot: true, featured: true,
    rating: 4.8, users: '5M+', url: 'https://midjourney.com',
    features: ['文字生图', '风格调节', '高清输出', '社区分享'],
    pricing: '基础计划$10/月起'
  },
  {
    id: 3, name: 'Claude', logo: '/assets/logos/claude.png',
    shortDesc: 'Anthropic开发的AI助手，擅长分析、写作与编程',
    description: 'Claude是Anthropic开发的下一代AI助手，在逻辑推理、长文本处理和代码编写方面表现优异。支持100K token上下文窗口，适合处理长文档分析。',
    category: '对话助手', catColor: '#64ffda',
    tags: ['免费', '中文', 'API'], free: true, chinese: true, hot: true, featured: true,
    rating: 4.9, users: '8M+', url: 'https://claude.ai',
    features: ['长文本分析', '代码编写', '创意写作', '逻辑推理'],
    pricing: '免费使用，Pro订阅$20/月'
  },
  {
    id: 4, name: 'Stable Diffusion', logo: '/assets/logos/sd.png',
    shortDesc: '开源AI图像生成模型，支持本地部署',
    description: 'Stable Diffusion是Stability AI开源的文本到图像扩散模型，支持本地部署和定制化训练。用户可以完全控制生成过程，适合有技术背景的创作者。',
    category: 'AI绘画', catColor: '#c792ea',
    tags: ['免费', '开源', '本地部署'], free: true, chinese: false, hot: true, featured: true,
    rating: 4.7, users: '6M+', url: 'https://stability.ai',
    features: ['文生图', '图生图', 'ControlNet', '本地部署'],
    pricing: '完全免费，支持本地部署'
  },
  {
    id: 5, name: 'Notion AI', logo: '/assets/logos/notion.png',
    shortDesc: '集成在Notion中的AI写作助手，提升文档效率',
    description: 'Notion AI将AI能力深度集成到Notion笔记平台，支持智能写作、摘要、翻译、代码解释等功能。与工作流无缝结合，是知识管理的好帮手。',
    category: 'AI办公', catColor: '#ffd700',
    tags: ['付费', '中文'], free: false, chinese: true, hot: false, featured: true,
    rating: 4.6, users: '3M+', url: 'https://notion.so',
    features: ['智能写作', '摘要生成', '翻译', '代码解释'],
    pricing: 'Plus套餐$10/月含AI功能'
  },
  {
    id: 6, name: 'GitHub Copilot', logo: '/assets/logos/copilot.png',
    shortDesc: 'AI编程助手，实时辅助代码编写与补全',
    description: 'GitHub Copilot是微软推出的AI编程助手，基于GPT模型为开发者提供代码补全、错误检测、代码解释等服务。支持多种主流编程语言和IDE。',
    category: '编程工具', catColor: '#00b4d8',
    tags: ['付费', 'API'], free: false, chinese: false, hot: true, featured: true,
    rating: 4.8, users: '4M+', url: 'https://github.com/features/copilot',
    features: ['代码补全', '错误检测', '代码解释', '多语言支持'],
    pricing: '$10/月或$100/年'
  },
  {
    id: 7, name: '文心一言', logo: '/assets/logos/wenxin.png',
    shortDesc: '百度大模型AI助手，中文理解能力出色',
    description: '文心一言是百度基于文心大模型开发的生成式AI产品，在中文理解和生成方面表现优异。支持对话、创作、问答等多种场景。',
    category: '对话助手', catColor: '#64ffda',
    tags: ['免费', '中文'], free: true, chinese: true, hot: true, featured: false,
    rating: 4.5, users: '7M+', url: 'https://yiyan.baidu.com',
    features: ['中文对话', '文学创作', '知识问答', '图片生成'],
    pricing: '免费使用'
  },
  {
    id: 8, name: '通义千问', logo: '/assets/logos/tongyi.png',
    shortDesc: '阿里云大模型，支持长文本与多模态',
    description: '通义千问是阿里云自研的大语言模型，支持中英文对话、长文本处理、代码生成等。集成多种行业解决方案，适合企业用户。',
    category: '对话助手', catColor: '#64ffda',
    tags: ['免费', '中文', 'API'], free: true, chinese: true, hot: true, featured: false,
    rating: 4.6, users: '5M+', url: 'https://tongyi.aliyun.com',
    features: ['长文本处理', '多模态', '代码生成', '行业方案'],
    pricing: '免费API额度'
  },
  {
    id: 9, name: 'Kimi', logo: '/assets/logos/kimi.png',
    shortDesc: '月之暗面Moonshot AI，支持20万字上下文',
    description: 'Kimi是月之暗面公司开发的AI助手，以超长上下文著称，支持20万汉字无损上下文。主打办公场景的文件处理和内容分析。',
    category: '对话助手', catColor: '#64ffda',
    tags: ['免费', '中文'], free: true, chinese: true, hot: true, featured: false,
    rating: 4.7, users: '3M+', url: 'https://kimi.moonshot.cn',
    features: ['超长上下文', '文件分析', '网页解析', '多语言'],
    pricing: '免费使用'
  },
  {
    id: 10, name: 'DALL-E 3', logo: '/assets/logos/dalle.png',
    shortDesc: 'OpenAI图像生成模型，与ChatGPT深度集成',
    description: 'DALL-E 3是OpenAI最新图像生成模型，与ChatGPT深度集成，可以通过对话方式精确控制图像生成。支持复杂的场景和人物描述。',
    category: 'AI绘画', catColor: '#c792ea',
    tags: ['付费', 'API'], free: false, chinese: false, hot: false, featured: false,
    rating: 4.7, users: '2M+', url: 'https://openai.com/dall-e-3',
    features: ['文生图', '精确控制', 'ChatGPT集成', '高清输出'],
    pricing: '按生成次数计费'
  },
  {
    id: 11, name: 'Gamma', logo: '/assets/logos/gamma.png',
    shortDesc: 'AI演示文稿生成工具，快速创建精美PPT',
    description: 'Gamma是一款AI驱动的演示文稿工具，通过输入文字即可生成精美的PPT。支持多种主题风格一键切换，大幅提升办公效率。',
    category: 'AI办公', catColor: '#ffd700',
    tags: ['免费', '中文'], free: true, chinese: true, hot: false, featured: false,
    rating: 4.5, users: '2M+', url: 'https://gamma.app',
    features: ['AI生成PPT', '主题切换', '在线协作', '导出PDF'],
    pricing: '免费额度，Pro $12/月'
  },
  {
    id: 12, name: 'Runway', logo: '/assets/logos/runway.png',
    shortDesc: 'AI视频生成与编辑平台，支持Gen-2/Gen-3',
    description: 'Runway是领先的AI视频生成平台，最新的Gen-3模型支持文字和图像生成高质量视频。内置丰富的视频编辑功能，适合内容创作者。',
    category: 'AI视频', catColor: '#ff6b6b',
    tags: ['付费', '英文'], free: false, chinese: false, hot: true, featured: false,
    rating: 4.6, users: '3M+', url: 'https://runwayml.com',
    features: ['文生视频', '图生视频', '视频编辑', '风格迁移'],
    pricing: 'Pro计划$15/月起'
  },
]

const _MOCK_CATEGORIES = [
  { id: 1, name: '对话助手', icon: '💬', count: 45, color: '#64ffda' },
  { id: 2, name: 'AI绘画',   icon: '🎨', count: 38, color: '#c792ea' },
  { id: 3, name: 'AI视频',   icon: '🎬', count: 22, color: '#ff6b6b' },
  { id: 4, name: 'AI办公',   icon: '📊', count: 35, color: '#ffd700' },
  { id: 5, name: '编程工具', icon: '💻', count: 28, color: '#00b4d8' },
  { id: 6, name: 'AI音乐',   icon: '🎵', count: 15, color: '#ff9f43' },
  { id: 7, name: 'AI设计',   icon: '✏️', count: 20, color: '#ee5a24' },
  { id: 8, name: '搜索助手', icon: '🔍', count: 18, color: '#64ffda' },
  { id: 9, name: '效率工具', icon: '⚡', count: 42, color: '#a29bfe' },
  { id: 10, name: '学习教育', icon: '📚', count: 30, color: '#fd79a8' },
]

// ──────────────────────────────────────────────────
// 真实接口调用（接入时取消注释）
// ──────────────────────────────────────────────────
// async function _fetchFromAPI(path) {
//   const res = await httpGet(`${BASE}${path}`)
//   return res.data
// }

// ──────────────────────────────────────────────────
// 公开 API
// ──────────────────────────────────────────────────

/** 获取工具列表（带缓存） */
async function getToolsList() {
  if (USE_MOCK) {
    return _MOCK_TOOLS
  }
  // const data = await _fetchFromAPI('/tools')
  // set(CACHE.TOOLS_LIST.key, data, CACHE.TOOLS_LIST.ttl)
  // return data
}

/** 获取单个工具详情 */
async function getToolDetail(id) {
  if (USE_MOCK) {
    return _MOCK_TOOLS.find(t => t.id === Number(id)) || null
  }
  // const cacheKey = CACHE.TOOL_DETAIL.key + id
  // const cached = get(cacheKey, CACHE.TOOL_DETAIL.ttl)
  // if (cached) return cached
  // const data = await _fetchFromAPI(`/tools/${id}`)
  // set(cacheKey, data, CACHE.TOOL_DETAIL.ttl)
  // return data
}

/** 按分类获取工具 */
async function getToolsByCategory(categoryName) {
  const all = await getToolsList()
  return all.filter(t => t.category === categoryName)
}

/** 搜索工具（支持名称/描述/标签/分类） */
async function searchTools(keyword) {
  if (!keyword) return []
  const all = await getToolsList()
  const k = keyword.toLowerCase()
  return all.filter(t =>
    t.name.toLowerCase().includes(k) ||
    t.category.toLowerCase().includes(k) ||
    t.shortDesc.toLowerCase().includes(k) ||
    t.tags.some(tag => tag.toLowerCase().includes(k))
  )
}

/** 获取分类列表 */
async function getCategories() {
  if (USE_MOCK) {
    return _MOCK_CATEGORIES
  }
  // return await _fetchFromAPI('/categories')
}

/** 获取首页数据（一次性拉取所有展示数据） */
async function getHomeData() {
  const [all, categories] = await Promise.all([getToolsList(), getCategories()])
  return {
    categories,
    featuredTools: all.filter(t => t.featured).slice(0, 6),
    latestTools:   all.slice(0, 8),
    hotTools:      all.filter(t => t.hot).slice(0, 6),
  }
}

module.exports = {
  getToolsList,
  getToolDetail,
  getToolsByCategory,
  searchTools,
  getCategories,
  getHomeData,
}
