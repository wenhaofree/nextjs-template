import type { UserPlan } from '@/types/user'

interface UpdatePlanResponse {
  success: boolean
  plan?: UserPlan
  error?: string
}

export class UserAPI {
  /**
   * 更新用户计划
   * @param userId - Clerk 用户 ID
   * @param planType - 计划类型
   * @returns Promise<UpdatePlanResponse>
   */
  static async updatePlan(userId: string, planType: string): Promise<UpdatePlanResponse> {
    try {
      console.log('🔄 开始更新用户计划:', {
        userId,
        newPlan: planType,
        timestamp: new Date().toISOString()
      })

      const response = await fetch('/api/user/update-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          plan: planType
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '更新用户计划失败')
      }

      console.log('✅ 用户计划更新成功:', {
        userId,
        oldPlan: 'free',
        newPlan: data.plan,
        timestamp: new Date().toISOString()
      })

      return {
        success: true,
        plan: data.plan
      }
    } catch (error) {
      console.error('❌ 用户计划更新失败:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  /**
   * 获取用户当前计划
   * @returns Promise<UserPlan>
   */
  static async getCurrentPlan(): Promise<UserPlan | null> {
    try {
      const response = await fetch('/api/user/plan')
      if (!response.ok) {
        throw new Error('获取用户计划失败')
      }
      const { plan } = await response.json()
      return plan
    } catch (error) {
      console.error('❌ 获取用户计划失败:', error)
      return null
    }
  }
} 