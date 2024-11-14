import { getToolsDB, DbTool } from './neon'
import { getToolContent } from '@/app/lib/tools/content'

export interface Tool {
  name: string
  description: string
  link: string
  rating: number
  categories: string[]
  slug: string
  imageUrl?: string
  features?: string[]
  pricing?: {
    startingPrice: string
    plans: string[]
  }
  updateDate?: string
  content_markdown?: string
}

// 将数据库工具转换为前端工具格式
function convertDbToolToTool(dbTool: DbTool): Tool {
  return {
    name: dbTool.title,
    description: dbTool.summary || '',
    link: dbTool.url,
    rating: Number(dbTool.rating),
    // 将tags字符串转换为数组
    categories: dbTool.tags.split(',').map(tag => tag.trim()),
    // 从标题生成slug
    slug: dbTool.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    imageUrl: dbTool.image_url,
    // 将markdown内容中的特性列表提取出来
    features: dbTool.content_markdown
      ? extractFeatures(dbTool.content_markdown)
      : undefined,
    // 根据price_type设置价格信息
    pricing: getPricingInfo(dbTool),
    updateDate: dbTool.updated_at.toISOString().split('T')[0],
    content_markdown: dbTool.content_markdown
  }
}

// 从markdown内容中提取特性列表
function extractFeatures(markdown: string): string[] {
  const features: string[] = []
  const lines = markdown.split('\n')
  let inFeaturesList = false

  for (const line of lines) {
    if (line.includes('## Features') || line.includes('## 特性')) {
      inFeaturesList = true
      continue
    } else if (inFeaturesList && line.startsWith('##')) {
      break
    }

    if (inFeaturesList && line.trim().startsWith('- ')) {
      features.push(line.trim().slice(2))
    }
  }

  return features
}

// 根据数据库中的价格类型生成价格信息
function getPricingInfo(dbTool: DbTool): Tool['pricing'] {
  switch (dbTool.price_type) {
    case 'free':
      return {
        startingPrice: 'Free',
        plans: ['Free']
      }
    case 'paid':
      return {
        startingPrice: 'Paid',
        plans: ['Pro']
      }
    case 'freemium':
      return {
        startingPrice: 'Free to start',
        plans: ['Free', 'Pro', 'Enterprise']
      }
    default:
      return undefined
  }
}

export const ToolsDB = {
  async getAll(): Promise<Tool[]> {
    const db = await getToolsDB()
    const dbTools = await db.getTools()
    return dbTools.map(convertDbToolToTool)
  },

  async getToolBySlug(slug: string): Promise<Tool | undefined> {
    const db = await getToolsDB()
    const dbTool = await db.getToolBySlug(slug)
    
    if (!dbTool) return undefined

    // 获取markdown内容
    const content = await getToolContent(slug)
    
    const tool = convertDbToolToTool(dbTool)
    if (content) {
      tool.content_markdown = content
    }
    
    return tool
  }
} 