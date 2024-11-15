import { PlanType } from '@/types/user'

export interface Submission {
  id: string
  name: string
  url: string
  userId: string
  userPlan: PlanType
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
  description?: string
  imageUrl?: string
  categories?: string[]
}

export interface CreateSubmissionResponse {
  id: string
  name: string
  url: string
  status: Submission['status']
  createdAt: string
}

const BASE_URL = '/api/submissions'

export const SubmissionsAPI = {
  /**
   * 创建新的提交
   */
  create: async (data: {
    name: string
    url: string
    userId: string
    userPlan: string
  }): Promise<CreateSubmissionResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error in SubmissionsAPI.create:', error)
      throw error
    }
  },

  /**
   * 获取用户的所有提交
   */
  getByUserId: async (userId: string): Promise<Submission[]> => {
    try {
      const response = await fetch(`/api/submissions/user/${userId}`)
      
      if (!response.ok) {
        throw new Error(`获取用户提交失败: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('获取用户提交时出错:', error)
      return []
    }
  },

  /**
   * 获取所有付费提交
   */
  getPaidSubmissions: async (): Promise<Submission[]> => {
    try {
      const response = await fetch('/api/submissions/paid')
      
      if (!response.ok) {
        throw new Error(`获取付费提交失败: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('获取付费提交时出错:', error)
      return []
    }
  },

  /**
   * 更新提交状态
   */
  updateStatus: async (
    id: string, 
    status: Submission['status']
  ): Promise<Submission | null> => {
    try {
      const response = await fetch(`/api/submissions/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status,
          updatedAt: new Date().toISOString()
        }),
      })

      if (!response.ok) {
        throw new Error(`更新状态失败: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('更新提交状态时出错:', error)
      return null
    }
  }
} 