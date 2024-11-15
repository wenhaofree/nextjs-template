import { PlanType } from '@/types/user'

export const UserAPI = {
  async updatePlan(userId: string, planType: PlanType) {
    try {
      console.log('🔄 开始更新用户计划:', {
        userId,
        newPlan: planType,
        timestamp: new Date().toISOString()
      })

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const response = await fetch(`${baseUrl}/api/user/update-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          planType
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`)
      }
      
      console.log('✅ 用户计划更新成功:', {
        userId,
        newPlan: planType,
        response: result
      })

      return { success: true }
    } catch (error) {
      console.error('❌ 用户计划更新失败:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  },

  async getPlan(userId: string) {
    try {
      console.log('🔍 获取用户计划:', { userId })
      
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const response = await fetch(`${baseUrl}/api/user/plan?userId=${userId}`)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }
      
      console.log('✅ 获取用户计划成功:', {
        userId,
        plan: data.plan
      })

      return data.plan
    } catch (error) {
      console.error('❌ 获取用户计划失败:', error)
      return null
    }
  }
} 