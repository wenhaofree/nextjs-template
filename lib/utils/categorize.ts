import { categoryGroups } from '@/data/categories'

// 获取所有有效的分类
const allValidCategories = new Set(Object.values(categoryGroups).flat())

// 关键词到分类的映射
const keywordCategories: Record<string, string[]> = {
  // AI 助手相关
  'chat': ['AI助手', '文字写作'],
  'gpt': ['AI助手', '文字写作'],
  'bot': ['AI助手'],
  'assistant': ['AI助手'],
  'ai': ['AI助手'],

  // 文字写作相关
  'write': ['文字写作'],
  'text': ['文字写作'],
  'content': ['文字写作', '内容创作'],
  'blog': ['文字写作', '内容创作'],

  // 编程开发相关
  'code': ['编程开发', '开发工具'],
  'dev': ['编程开发', '开发工具'],
  'git': ['编程开发', '开发工具'],
  'program': ['编程开发'],

  // 图像处理相关
  'image': ['图像处理', 'AI绘画'],
  'photo': ['图像处理'],
  'art': ['AI绘画', '创意设计'],
  'draw': ['AI绘画'],
  'design': ['创意设计'],

  // 视频音频相关
  'video': ['视频制作'],
  'audio': ['音频处理'],
  'music': ['音频处理'],
  'sound': ['音频处理'],

  // 营销工具相关
  'market': ['营销工具'],
  'seo': ['营销工具'],
  'ads': ['营销工具'],

  // 其他分类
  'research': ['学术研究'],
  'team': ['团队协作'],
  'productivity': ['生产力工具'],
  'open': ['开源工具'],
}

/**
 * 根据 URL 和名称自动分类
 * @param url - 工具的 URL
 * @param name - 工具的名称
 * @returns 分类数组
 */
export const categorizeTool = (url: string, name: string): string[] => {
  try {
    const urlLower = url.toLowerCase()
    const nameLower = name.toLowerCase()
    const categories = new Set<string>()

    // 遍历关键词映射
    Object.entries(keywordCategories).forEach(([keyword, cats]) => {
      if (urlLower.includes(keyword) || nameLower.includes(keyword)) {
        cats.forEach(cat => {
          if (allValidCategories.has(cat)) {
            categories.add(cat)
          }
        })
      }
    })

    // 如果没有找到匹配的分类，添加"其他"
    if (categories.size === 0) {
      categories.add('其他')
    }

    console.log('🏷️ Tool categorized:', {
      url,
      name,
      categories: Array.from(categories)
    })

    return Array.from(categories)
  } catch (error) {
    console.error('❌ Error categorizing tool:', error)
    return ['其他']
  }
}

/**
 * 验证分类是否有效
 * @param category - 要验证的分类
 * @returns 是否为有效分类
 */
export const isValidCategory = (category: string): boolean => {
  return allValidCategories.has(category)
}

/**
 * 获取所有有效分类
 * @returns 所有有效分类的数组
 */
export const getAllCategories = (): string[] => {
  return Array.from(allValidCategories)
} 