"use server"

import { neon, neonConfig } from "@neondatabase/serverless"
import { DbTool } from '@/lib/db/neon'
import { Tool } from '@/types/tools'

// 配置 neon
neonConfig.fetchConnectionCache = true

// 创建数据库连接
const sql = neon(process.env.DATABASE_URL!)

/**
 * 从数据库获取工具数据
 */
const fetchToolsFromDB = async (): Promise<DbTool[]> => {
  try {
    console.log('🔍 Fetching tools from database...')
    const startTime = Date.now()

    const result = await sql<DbTool[]>`
      SELECT * FROM tools 
      WHERE status = 'active'
      ORDER BY created_at DESC
    `

    console.log('📊 Database query result:', {
      count: result.length,
      duration: `${Date.now() - startTime}ms`,
      firstTool: result[0] ? {
        id: result[0].id,
        title: result[0].title
      } : null
    })

    return result
  } catch (error) {
    console.error('❌ Error fetching tools from DB:', error)
    return []
  }
}

// 数据库记录转换为前端类型
function mapDbToolToTool(dbTool: DbTool): Tool {
  return {
    id: dbTool.id,
    name: dbTool.title,
    description: dbTool.summary || '',
    imageUrl: dbTool.image_url || '/tools/default.png',
    link: dbTool.url,
    rating: Number(dbTool.rating) || 0,
    categories: dbTool.tags ? dbTool.tags.split(',') : [],
    updateDate: dbTool.updated_at?.toISOString(),
    submitterId: dbTool.submit_user_id?.toString(),
    isPaid: dbTool.price_type !== 'free',
    status: dbTool.status
  }
}

/**
 * 创建新工具
 */
export async function createTool(data: { name: string, link: string }): Promise<DbTool> {
  try {
    console.log('📝 Creating new tool:', data)

    // 从名称中提取标签
    const defaultTags = data.name.toLowerCase().includes('ai') ? 'AI工具' : '其他'

    const [newTool] = await sql<DbTool[]>`
      INSERT INTO tools (
        title,              -- 工具标题
        url,                -- 工具链接
        image_url,          -- 图片URL
        summary,            -- 工具简介
        tags,              -- 标签（逗号分隔）
        language_support,   -- 支持的语言
        content_markdown,   -- Markdown格式的详细内容
        price_type,        -- 价格类型
        rating             -- 初始评分
      ) VALUES (
        ${data.name},                        -- 标题：直接使用提交的名称
        ${data.link},                        -- URL：直接使用提交的链接
        ${null},                             -- 图片URL：暂时为空
        ${`${data.name} - AI工具简介`},      -- 简介：生成默认简介
        ${defaultTags},                      -- 标签：设置默认标签
        ${'中文,英文'},                      -- 语言支持：默认支持中英文
        ${`# ${data.name}\n\n这是一个AI工具`}, -- Markdown内容：生成默认内容
        ${'free'},                           -- 价格类型：默认免费
        ${4.0}                               -- 评分：默认4分
      )
      RETURNING *
    `

    console.log('✅ Tool created:', {
      id: newTool.id,
      title: newTool.title,
      url: newTool.url,
      tags: newTool.tags,
      price_type: newTool.price_type,
      created_at: newTool.created_at
    })

    return newTool
  } catch (error) {
    console.error('❌ Error creating tool:', error)
    throw new Error('Failed to create tool')
  }
}

/**
 * 获取工具数据
 */
export async function getTools(): Promise<Tool[]> {
  try {
    console.log('🔄 Getting tools...')
    const startTime = Date.now()

    const dbTools = await fetchToolsFromDB()
    const tools = dbTools.map(mapDbToolToTool)
    
    console.log('✅ Tools fetched and mapped:', {
      count: tools.length,
      duration: `${Date.now() - startTime}ms`
    })

    return tools
  } catch (error) {
    console.error('❌ Error getting tools:', error)
    return []
  }
}

/**
 * 获取用户的工具
 */
export async function getToolsByUser(userId: string): Promise<Tool[]> {
  try {
    const dbTools = await sql<DbTool[]>`
      SELECT * FROM tools 
      WHERE submit_user_id = ${parseInt(userId)}
    `
    return dbTools.map(mapDbToolToTool)
  } catch (error) {
    console.error('❌ Error fetching user tools:', error)
    return []
  }
}

/**
 * 更新工具
 */
export async function updateTool(id: number, updates: Partial<DbTool>): Promise<DbTool | null> {
  try {
    const [updatedTool] = await sql<DbTool[]>`
      UPDATE tools 
      SET 
        title = COALESCE(${updates.title}, title),
        url = COALESCE(${updates.url}, url),
        image_url = COALESCE(${updates.image_url}, image_url),
        summary = COALESCE(${updates.summary}, summary),
        tags = COALESCE(${updates.tags}, tags),
        status = COALESCE(${updates.status}, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `
    return updatedTool || null
  } catch (error) {
    console.error('❌ Error updating tool:', error)
    return null
  }
}

export async function deleteTool(id: number): Promise<boolean> {
  try {
    const result = await sql`
      DELETE FROM tools 
      WHERE id = ${id}
    `
    return result.length > 0
  } catch (error) {
    console.error('❌ Error deleting tool:', error)
    return false
  }
}

// 初始化数据库表
export async function initDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS tools (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(255),
        link VARCHAR(255) NOT NULL,
        rating DECIMAL(2,1) DEFAULT 0,
        categories TEXT[],
        update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        submitter_id VARCHAR(255),
        is_paid BOOLEAN DEFAULT false,
        status VARCHAR(50) DEFAULT 'pending'
      )
    `
    console.log('✅ Database initialized')
  } catch (error) {
    console.error('❌ Database initialization error:', error)
    throw error
  }
}
  