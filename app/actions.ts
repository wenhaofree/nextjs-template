"use server"

import { neon, neonConfig } from "@neondatabase/serverless"
import { Tool } from '@/types/tools'

// 配置 neon
neonConfig.fetchConnectionCache = true

// 创建数据库连接
const sql = neon(process.env.DATABASE_URL!)

// 工具相关的数据库操作
export async function createTool(tool: Omit<Tool, 'id'>): Promise<Tool> {
  try {
    const [newTool] = await sql<Tool[]>`
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
      RETURNING *
    `
    console.log('✅ Tool created:', newTool)
    return mapDbToolToTool(newTool)
  } catch (error) {
    console.error('❌ Error creating tool:', error)
    throw new Error('Failed to create tool')
  }
}

export async function getTools(): Promise<Tool[]> {
  try {
    const tools = await sql<Tool[]>`
      SELECT * FROM tools 
      ORDER BY id ASC
    `
    return tools.map(mapDbToolToTool)
  } catch (error) {
    console.error('❌ Error fetching tools:', error)
    return []
  }
}

export async function getToolsByUser(userId: string): Promise<Tool[]> {
  try {
    const tools = await sql<Tool[]>`
      SELECT * FROM tools 
      WHERE submitter_id = ${userId}
    `
    return tools.map(mapDbToolToTool)
  } catch (error) {
    console.error('❌ Error fetching user tools:', error)
    return []
  }
}

export async function getPaidTools(): Promise<Tool[]> {
  try {
    const tools = await sql<Tool[]>`
      SELECT * FROM tools 
      WHERE is_paid = true
    `
    return tools.map(mapDbToolToTool)
  } catch (error) {
    console.error('❌ Error fetching paid tools:', error)
    return []
  }
}

export async function updateTool(id: number, updates: Partial<Tool>): Promise<Tool | null> {
  try {
    const [updatedTool] = await sql<Tool[]>`
      UPDATE tools 
      SET 
        name = COALESCE(${updates.name}, name),
        description = COALESCE(${updates.description}, description),
        image_url = COALESCE(${updates.imageUrl}, image_url),
        link = COALESCE(${updates.link}, link),
        rating = COALESCE(${updates.rating}, rating),
        categories = COALESCE(${updates.categories}, categories),
        status = COALESCE(${updates.status}, status),
        update_date = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `
    return updatedTool ? mapDbToolToTool(updatedTool) : null
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

// 辅助函数：数据库记录映射到 Tool 类型
function mapDbToolToTool(dbTool: Record<string, any>): Tool {
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
} 