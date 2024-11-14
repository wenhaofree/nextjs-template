import { Tool } from '@/data/tools'
import { PlanType } from '@/types/user'
import { createTool } from '@/app/actions'
import { categorizeTool } from '@/lib/utils/categorize'

export interface Submission {
  id: string;
  name: string;
  url: string;
  userId: string;
  userPlan: PlanType;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  description?: string;
  imageUrl?: string;
  categories?: string[];
}

// 将提交转换为工具
const submissionToTool = (submission: Submission): Omit<Tool, 'id'> => {
  // 自动分类
  const categories = categorizeTool(submission.url, submission.name)
  
  return {
    name: submission.name,
    description: submission.description || `${submission.name} - 提交审核中`,
    imageUrl: submission.imageUrl || '/tools/default.png',
    link: submission.url,
    rating: 0,
    categories, // 使用自动分类的结果
    updateDate: new Date().toISOString(),
    submitterId: submission.userId,
    isPaid: submission.userPlan !== 'free',
    status: 'inactive'
  }
}

export const SubmissionsAPI = {
  /**
   * 添加新的提交并保存到工具列表
   */
  create: async (data: Omit<Submission, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Submission> => {
    try {
      console.log('📝 Creating new submission:', data)

      // 创建提交记录
      const submission: Submission = {
        id: crypto.randomUUID(),
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // 转换为工具并保存到数据库
      if (data.userPlan !== 'free') {
        const tool = submissionToTool(submission)
        const savedTool = await createTool(tool)
        
        console.log('✅ Tool saved with categories:', {
          id: savedTool.id,
          name: savedTool.name,
          categories: savedTool.categories,
          updateDate: savedTool.updateDate
        })
      }

      return submission
    } catch (error) {
      console.error('❌ Error creating submission:', error)
      throw error
    }
  },

  /**
   * 获取用户的所有提交
   */
  getByUserId: async (userId: string): Promise<Tool[]> => {
    try {
      const toolsDB = await getToolsDB()
      const userTools = await toolsDB.getToolsByUser(userId)
      console.log(`📋 Found ${userTools.length} tools for user:`, userId)
      return userTools
    } catch (error) {
      console.error('❌ Error fetching user tools:', error)
      return []
    }
  },

  /**
   * 获取所有付费用户的工具
   */
  getPaidTools: async (): Promise<Tool[]> => {
    try {
      const toolsDB = await getToolsDB()
      const paidTools = await toolsDB.getPaidTools()
      console.log(`💰 Found ${paidTools.length} paid tools`)
      return paidTools
    } catch (error) {
      console.error('❌ Error fetching paid tools:', error)
      return []
    }
  },

  /**
   * 更新工具状态
   */
  updateStatus: async (id: string, status: Submission['status']): Promise<Tool | null> => {
    try {
      const toolsDB = await getToolsDB()
      const updatedTool = await toolsDB.updateTool(parseInt(id), {
        status: status === 'approved' ? 'active' : 'inactive',
        updateDate: new Date().toISOString()
      })

      if (!updatedTool) {
        console.log('⚠️ Tool not found:', id)
        return null
      }

      console.log('✅ Tool status updated:', {
        id,
        status: updatedTool.status,
        timestamp: updatedTool.updateDate
      })

      return updatedTool
    } catch (error) {
      console.error('❌ Error updating tool status:', error)
      return null
    }
  }
} 