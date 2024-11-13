export type PlanType = 'free' | 'one-time' | 'unlimited' | 'sponsor'

export interface UserPlan {
  type: PlanType
  startDate: string
  endDate?: string
} 