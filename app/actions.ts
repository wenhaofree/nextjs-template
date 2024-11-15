"use server"

import { neon, neonConfig } from "@neondatabase/serverless"
import { DbTool } from '@/lib/db/neon'
import { Tool } from '@/types/tools'

// 配置 neon
neonConfig.fetchConnectionCache = true

// 创建数据库连接
const sql = neon(process.env.DATABASE_URL!)

// 定义允许的价格类型
const ALLOWED_PRICE_TYPES = ['free', 'paid', 'premium', 'sponsor'] as const
type AllowedPriceType = typeof ALLOWED_PRICE_TYPES[number]

// 价格类型映射
const PRICE_TYPE_MAP: Record<string, AllowedPriceType> = {
  'free': 'free',
  'one-time': 'paid',
  'unlimited': 'premium',
  'sponsor': 'sponsor'
}

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

// 添加 slug 生成函数
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // 将非字母数字字符替换为连字符
    .replace(/^-+|-+$/g, '') // 移除首尾连字符
    .substring(0, 50) // 限制长度
}

/**
 * 创建新工具
 */
export async function createTool(data: { 
  name: string, 
  link: string,
  userId?: string | number, // 支持 string 或 number 类型
  status?: 'pending' | 'active' | 'inactive',
  priceType?: string
}): Promise<DbTool | null> {
  try {
    // 验证必要字段
    if (!data.name?.trim() || !data.link?.trim()) {
      throw new Error('Missing required fields')
    }

    // 验证 userId 格式
    if (data.userId) {
      const userIdStr = String(data.userId)
      if (typeof data.userId === 'string' && !userIdStr.startsWith('user_')) {
        console.log('⚠️ Non-Clerk user ID format:', data.userId)
      }
    }

    console.log('📝 Creating tool:', {
      name: data.name,
      url: data.link,
      userId: data.userId,
      status: data.status,
      priceType: data.priceType
    })

    const priceType = data.priceType || 'free'
    const toolStatus = data.status || (priceType === 'free' ? 'pending' : 'active')
    const slug = `${generateSlug(data.name)}-${Date.now()}`
    const mappedPriceType = PRICE_TYPE_MAP[priceType] || 'free'

    // 检查 URL 是否已存在
    const existingTool = await sql<DbTool[]>`
      SELECT id FROM tools WHERE url = ${data.link.trim()}
    `

    if (existingTool.length > 0) {
      console.log('⚠️ Tool with this URL already exists')
      return null
    }

    // 执行插入操作
    const [newTool] = await sql<DbTool[]>`
      INSERT INTO tools (
        title,
        url,
        slug,
        image_url,
        summary,
        tags,
        language_support,
        content_markdown,
        price_type,
        rating,
        status,
        submit_user_id    -- 存储 userId（string 类型）
      ) VALUES (
        ${data.name.trim()},
        ${data.link.trim()},
        ${slug},
        ${null},
        ${`${data.name.trim()} - AI工具简介`},
        ${'AI工具'},
        ${'中文,英文'},
        ${`# ${data.name.trim()}\n\n这是一个AI工具`},
        ${mappedPriceType},
        ${4.0},
        ${toolStatus},
        ${data.userId ? String(data.userId) : null}
      )
      RETURNING *
    `

    console.log('✅ Tool created successfully:', {
      id: newTool.id,
      title: newTool.title,
      status: newTool.status,
      userId: newTool.submit_user_id
    })

    return newTool
  } catch (error) {
    console.error('❌ Error creating tool:', {
      error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      data
    })
    return null
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
      WHERE submit_user_id = ${userId}
      ORDER BY created_at DESC
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
  