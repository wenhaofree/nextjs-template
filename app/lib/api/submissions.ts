import { getToolsDB, type DbTool } from '@/lib/db/neon'

// 获取所有工具
export const getTools = async () => {
  const toolsDB = await getToolsDB()
  return toolsDB.getTools()
}

// 获取工具内容
export const getToolContent = async (toolId: number) => {
  const toolsDB = await getToolsDB()
  const tool = await toolsDB.getToolBySlug(toolId.toString())
  if (tool) {
    return tool.content_markdown
  }
  throw new Error('Tool not found')
}

type PriceType = 'free' | 'one-time' | 'unlimited' | 'sponsor'

// 创建工具
export const createTool = async (data: {
  name: string
  url: string
  userId: string
  userPlan?: string
  status?: 'pending' | 'active'
}) => {
  const toolsDB = await getToolsDB()
  
  // 验证和转换 price_type
  const validPriceTypes: PriceType[] = ['free', 'one-time', 'unlimited', 'sponsor']
  const priceType: PriceType = validPriceTypes.includes(data.userPlan as PriceType) 
    ? (data.userPlan as PriceType) 
    : 'free'
  
  // 检查是否存在
  const existingTool = await toolsDB.getToolByTitle(data.name)
  if (existingTool) {
    // 如果工具已存在且状态为 pending，则更新状态
    if (existingTool.status === 'pending' && data.status === 'active') {
      return await toolsDB.updateTool(existingTool.id, {
        status: 'active',
        price_type: priceType
      })
    }
    return existingTool
  }

  const newTool = await toolsDB.addTool({
    title: data.name.toString(),
    url: data.url.toString(),
    status: data.status || 'pending',
    price_type: priceType,
    submit_user_id: data.userId,
    tags: '',
    language_support: '',
    favorite_count: 0,
    view_count: 0,
    rating: 0,
    image_url: '',
    summary: '',
    content_markdown: '',
    slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  })

  return newTool
}

// 更新工具分类
export const updateToolCategory = async (toolId: number, category: string) => {
  const toolsDB = await getToolsDB()
  const tool = await toolsDB.updateTool(toolId, {
    tags: category
  })
  if (!tool) {
    throw new Error('Tool not found')
  }
  return tool
} 