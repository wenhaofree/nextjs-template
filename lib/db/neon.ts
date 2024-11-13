import { neon, neonConfig } from '@neondatabase/serverless'
import { Tool } from '@/data/tools'

// 配置 neon
neonConfig.fetchConnectionCache = true

// 验证数据库连接字符串
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables')
}

// 创建数据库连接
const sql = neon(process.env.DATABASE_URL)

// 初始化数据库表
const initDb = async () => {
  try {
    // 创建 tools 表
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
      );
    `

    // 验证表是否创建成功
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'tools'
      );
    `

    if (tableExists[0]?.exists) {
      console.log('✅ Database table "tools" initialized')
    } else {
      throw new Error('Failed to create tools table')
    }

  } catch (error) {
    console.error('❌ Database initialization error:', error)
    throw error
  }
}

// 工具数据访问类
export class ToolsDB {
  private static instance: ToolsDB
  private initialized = false

  private constructor() {}

  static async getInstance(): Promise<ToolsDB> {
    if (!ToolsDB.instance) {
      ToolsDB.instance = new ToolsDB()
      await ToolsDB.instance.initialize()
    }
    return ToolsDB.instance
  }

  private async initialize() {
    if (!this.initialized) {
      await initDb()
      this.initialized = true
    }
  }

  async addTool(tool: Omit<Tool, 'id'>): Promise<Tool> {
    try {
      // 确保数据库已初始化
      if (!this.initialized) {
        await this.initialize()
      }

      const [newTool] = await sql`
        INSERT INTO tools 
        (name, description, image_url, link, rating, categories, submitter_id, is_paid, status)
        VALUES 
        (
          ${tool.name},
          ${tool.description},
          ${tool.imageUrl},
          ${tool.link},
          ${tool.rating},
          ${tool.categories},
          ${tool.submitterId},
          ${tool.isPaid},
          ${tool.status || 'pending'}
        )
        RETURNING *;
      `

      console.log('✅ Tool added to database:', newTool)
      return this.mapDbToolToTool(newTool)
    } catch (error) {
      console.error('❌ Error adding tool:', error)
      throw error
    }
  }

  async getTools(): Promise<Tool[]> {
    try {
      const tools = await sql<Tool[]>`
        SELECT * FROM tools ORDER BY id ASC
      `
      return tools.map(this.mapDbToolToTool)
    } catch (error) {
      console.error('❌ Error fetching tools:', error)
      return []
    }
  }

  async getToolsByUser(userId: string): Promise<Tool[]> {
    try {
      const tools = await sql<Tool[]>`
        SELECT * FROM tools WHERE submitter_id = ${userId}
      `
      return tools.map(this.mapDbToolToTool)
    } catch (error) {
      console.error('❌ Error fetching user tools:', error)
      return []
    }
  }

  async getPaidTools(): Promise<Tool[]> {
    try {
      const tools = await sql<Tool[]>`
        SELECT * FROM tools WHERE is_paid = true
      `
      return tools.map(this.mapDbToolToTool)
    } catch (error) {
      console.error('❌ Error fetching paid tools:', error)
      return []
    }
  }

  async updateTool(id: number, updates: Partial<Tool>): Promise<Tool | null> {
    try {
      const [updatedTool] = await sql<Tool[]>`
        UPDATE tools 
        SET 
          name = COALESCE(${updates.name}, name),
          description = COALESCE(${updates.description}, description),
          image_url = COALESCE(${updates.imageUrl}, image_url),
          link = COALESCE(${updates.link}, link),
          rating = COALESCE(${updates.rating}, rating),
          categories = COALESCE(${updates.categories}::text[], categories),
          status = COALESCE(${updates.status}, status),
          update_date = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `
      return updatedTool ? this.mapDbToolToTool(updatedTool) : null
    } catch (error) {
      console.error('❌ Error updating tool:', error)
      return null
    }
  }

  async deleteTool(id: number): Promise<boolean> {
    try {
      const result = await sql`
        DELETE FROM tools WHERE id = ${id}
      `
      return result.count > 0
    } catch (error) {
      console.error('❌ Error deleting tool:', error)
      return false
    }
  }

  private mapDbToolToTool(dbTool: Record<string, any>): Tool {
    try {
      return {
        id: Number(dbTool.id),
        name: String(dbTool.name),
        description: String(dbTool.description || ''),
        imageUrl: String(dbTool.image_url || ''),
        link: String(dbTool.link),
        rating: Number(dbTool.rating || 0),
        categories: Array.isArray(dbTool.categories) ? dbTool.categories : [],
        updateDate: dbTool.update_date?.toISOString() || new Date().toISOString(),
        submitterId: dbTool.submitter_id,
        isPaid: Boolean(dbTool.is_paid),
        status: dbTool.status || 'pending'
      }
    } catch (error) {
      console.error('❌ Error mapping database tool:', error)
      throw new Error('Failed to map database tool')
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await sql`SELECT 1`
      return true
    } catch (error) {
      console.error('❌ Database health check failed:', error)
      return false
    }
  }
}

// 导出获取实例的辅助函数
export const getToolsDB = () => ToolsDB.getInstance() 