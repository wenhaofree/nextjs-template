import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

const dbPromise = open({
  filename: './data/tools.db',
  driver: sqlite3.Database
})

export const ToolsDB = {
  async create(tool: Tool) {
    const db = await dbPromise
    return db.run(`
      INSERT INTO tools (name, description, link, rating, categories)
      VALUES (?, ?, ?, ?, ?)
    `, [tool.name, tool.description, tool.link, tool.rating, JSON.stringify(tool.categories)])
  },

  async getAll() {
    const db = await dbPromise
    return db.all('SELECT * FROM tools')
  }
} 