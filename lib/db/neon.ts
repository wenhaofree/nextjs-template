import { neon, neonConfig } from '@neondatabase/serverless'

// 配置 neon
neonConfig.fetchConnectionCache = true

// 创建数据库连接
const sql = neon(process.env.DATABASE_URL!)

// 工具数据类型
export interface DbTool {
  id: number;
  title: string;
  url: string;
  image_url?: string;
  summary?: string;
  tags: string;
  language_support: string;
  favorite_count: number;
  content_markdown?: string;
  created_at: Date;
  updated_at: Date;
  status: 'active' | 'inactive' | 'pending' | 'removed' | 'featured';
  view_count: number;
  price_type: 'free' | 'one-time' | 'unlimited' |'sponsor';
  submit_user_id?: string;
  last_check_time?: Date;
  rating: number;
  slug: string;
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
      await this.initDb()
      this.initialized = true
    }
  }

  private async initDb() {
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS tools (
          id BIGSERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          url VARCHAR(512) NOT NULL,
          image_url VARCHAR(512),
          summary VARCHAR(1000),
          tags VARCHAR(255) DEFAULT '',
          language_support VARCHAR(100) DEFAULT '',
          favorite_count INTEGER DEFAULT 0,
          content_markdown TEXT,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          status VARCHAR(20) DEFAULT 'active',
          view_count INTEGER DEFAULT 0,
          price_type VARCHAR(20) DEFAULT 'free',
          submit_user_id BIGINT,
          last_check_time TIMESTAMPTZ,
          rating NUMERIC(3,2) DEFAULT 0.0,
          slug VARCHAR(255) NOT NULL UNIQUE,

          CONSTRAINT url_unique UNIQUE (url),
          CONSTRAINT rating_range CHECK (rating >= 0 AND rating <= 5.0),
          CONSTRAINT status_values CHECK (status IN ('active', 'inactive', 'pending', 'removed', 'featured')),
          CONSTRAINT price_type_values CHECK (price_type IN ('free', 'paid', 'freemium'))
        );
      `
      console.log('✅ Database initialized')
    } catch (error) {
      console.error('❌ Database initialization error:', error)
      throw error
    }
  }

  async addTool(tool: Omit<DbTool, 'id' | 'created_at' | 'updated_at'>): Promise<DbTool> {
    try {
      const [newTool] = await sql<DbTool[]>`
        INSERT INTO tools (
          title,
          url,
          image_url,
          summary,
          tags,
          language_support,
          content_markdown,
          status,
          price_type,
          submit_user_id,
          rating,
          slug
        ) VALUES (
          ${tool.title},
          ${tool.url},
          ${tool.image_url},
          ${tool.summary},
          ${tool.tags},
          ${tool.language_support},
          ${tool.content_markdown},
          ${tool.status || 'pending'},
          ${tool.price_type || 'free'},
          ${tool.submit_user_id},
          ${tool.rating || 0},
          LOWER(REGEXP_REPLACE(${tool.title}, '[^a-zA-Z0-9]+', '-', 'g'))
        )
        RETURNING *
      `
      return newTool
    } catch (error) {
      console.error('❌ Error adding tool:', error)
      throw error
    }
  }

  async getTools(): Promise<DbTool[]> {
    try {
      return await sql<DbTool[]>`
        SELECT * FROM tools 
        WHERE status = 'active'
        ORDER BY created_at DESC
      `
    } catch (error) {
      console.error('❌ Error fetching tools:', error)
      return []
    }
  }

  async getToolsByUser(userId: number): Promise<DbTool[]> {
    try {
      return await sql<DbTool[]>`
        SELECT * FROM tools 
        WHERE submit_user_id = ${userId}
      `
    } catch (error) {
      console.error('❌ Error fetching user tools:', error)
      return []
    }
  }

  async updateTool(id: number, updates: Partial<DbTool>): Promise<DbTool | null> {
    try {
      const [updatedTool] = await sql<DbTool[]>`
        UPDATE tools 
        SET 
          title = COALESCE(${updates.title}, title),
          url = COALESCE(${updates.url}, url),
          image_url = COALESCE(${updates.image_url}, image_url),
          summary = COALESCE(${updates.summary}, summary),
          tags = COALESCE(${updates.tags}, tags),
          language_support = COALESCE(${updates.language_support}, language_support),
          content_markdown = COALESCE(${updates.content_markdown}, content_markdown),
          status = COALESCE(${updates.status}, status),
          price_type = COALESCE(${updates.price_type}, price_type),
          rating = COALESCE(${updates.rating}, rating),
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

  async deleteTool(id: number): Promise<boolean> {
    try {
      const result = await sql`
        UPDATE tools 
        SET status = 'removed' 
        WHERE id = ${id}
      `
      return result.length > 0
    } catch (error) {
      console.error('❌ Error deleting tool:', error)
      return false
    }
  }

  async incrementViewCount(id: number): Promise<void> {
    try {
      await sql`
        UPDATE tools 
        SET view_count = view_count + 1 
        WHERE id = ${id}
      `
    } catch (error) {
      console.error('❌ Error incrementing view count:', error)
    }
  }

  async incrementFavoriteCount(id: number): Promise<void> {
    try {
      await sql`
        UPDATE tools 
        SET favorite_count = favorite_count + 1 
        WHERE id = ${id}
      `
    } catch (error) {
      console.error('❌ Error incrementing favorite count:', error)
    }
  }

  async getToolBySlug(slug: string): Promise<DbTool | null> {
    try {
      const [tool] = await sql<DbTool[]>`
        SELECT * FROM tools 
        WHERE LOWER(REGEXP_REPLACE(slug, '[^a-z0-9]+', '-', 'g')) = ${slug}
        LIMIT 1
      `
      return tool || null
    } catch (error) {
      console.error('❌ Error fetching tool by slug:', error)
      return null
    }
  }

  async getToolByTitle(title: string): Promise<DbTool | null> {
    try {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const [tool] = await sql<DbTool[]>`
        SELECT * FROM tools 
        WHERE slug = ${slug}
        LIMIT 1
      `
      return tool || null
    } catch (error) {
      console.error('❌ Error fetching tool by title:', error)
      return null
    }
  }
}

// 导出获取实例的辅助函数
export const getToolsDB = () => ToolsDB.getInstance() 