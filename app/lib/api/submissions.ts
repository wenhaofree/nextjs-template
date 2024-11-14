import { Tool } from '@/types/tools'
import { PlanType } from '@/types/user'
import { createTool } from '@/app/actions'
import { categorizeTool } from '@/app/lib/utils/categorize'

export const getToolsDB = async () => {
  const tools = await Tool.findAll()
  return tools
}

export const getToolContent = async (toolId: number) => {
  const tool = await Tool.findByPk(toolId)
  if (tool) {
    return tool.content
  } else {
    throw new Error('Tool not found')
  }
}

export const createTool = async (tool: Tool) => {
  const createdTool = await Tool.create(tool)
  return createdTool
}

export const categorizeTool = async (toolId: number, category: string) => {
  const tool = await Tool.findByPk(toolId)
  if (tool) {
    tool.category = category
    await tool.save()
    return tool
  } else {
    throw new Error('Tool not found')
  }
} 