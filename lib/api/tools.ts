import { Tool } from '@/data/tools'

const TOOLS_STORAGE_KEY = 'ai_tools_data'

interface ToolsData {
  tools: Tool[];
  lastUpdated: string;
}

export class ToolsStorage {
  private static instance: ToolsStorage
  private data: ToolsData = {
    tools: [],
    lastUpdated: new Date().toISOString()
  }

  private constructor() {}

  static async getInstance(): Promise<ToolsStorage> {
    if (!ToolsStorage.instance) {
      ToolsStorage.instance = new ToolsStorage()
      await ToolsStorage.instance.load()
    }
    return ToolsStorage.instance
  }

  private async load() {
    try {
      const storedData = localStorage.getItem(TOOLS_STORAGE_KEY)
      if (storedData) {
        this.data = JSON.parse(storedData)
      }
      console.log('📚 Loaded tools from storage:', {
        count: this.data.tools.length,
        lastUpdated: this.data.lastUpdated
      })
    } catch (error) {
      console.error('❌ Error loading tools:', error)
      // 如果没有存储数据，使用默认数据
      this.data.tools = []
      await this.save()
    }
  }

  private async save() {
    try {
      this.data.lastUpdated = new Date().toISOString()
      localStorage.setItem(TOOLS_STORAGE_KEY, JSON.stringify(this.data))
      console.log('💾 Saved tools to storage:', {
        count: this.data.tools.length,
        lastUpdated: this.data.lastUpdated
      })
    } catch (error) {
      console.error('❌ Error saving tools:', error)
      throw error
    }
  }

  async addTool(tool: Tool): Promise<Tool> {
    try {
      // 确保 ID 唯一
      const maxId = Math.max(0, ...this.data.tools.map(t => t.id))
      const newTool = {
        ...tool,
        id: tool.id || maxId + 1
      }

      this.data.tools.push(newTool)
      await this.save()

      console.log('✅ Added new tool:', {
        id: newTool.id,
        name: newTool.name,
        timestamp: new Date().toISOString()
      })

      return newTool
    } catch (error) {
      console.error('❌ Error adding tool:', error)
      throw error
    }
  }

  async getTools(): Promise<Tool[]> {
    return this.data.tools
  }

  async searchTools(query: string): Promise<Tool[]> {
    const searchTerm = query.toLowerCase()
    return this.data.tools.filter(tool => 
      tool.name.toLowerCase().includes(searchTerm) ||
      tool.description.toLowerCase().includes(searchTerm) ||
      tool.categories.some(cat => cat.toLowerCase().includes(searchTerm))
    )
  }

  async updateTool(id: number, updates: Partial<Tool>): Promise<Tool | null> {
    const index = this.data.tools.findIndex(t => t.id === id)
    if (index === -1) {
      console.log('⚠️ Tool not found:', id)
      return null
    }

    this.data.tools[index] = {
      ...this.data.tools[index],
      ...updates,
      updateDate: new Date().toISOString()
    }

    await this.save()
    return this.data.tools[index]
  }

  async deleteTool(id: number): Promise<boolean> {
    const initialLength = this.data.tools.length
    this.data.tools = this.data.tools.filter(t => t.id !== id)
    
    if (this.data.tools.length === initialLength) {
      return false
    }

    await this.save()
    return true
  }
}

// 导出一个获取实例的辅助函数
export const getToolsStorage = () => ToolsStorage.getInstance() 