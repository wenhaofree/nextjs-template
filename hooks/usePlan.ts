import { useUser } from '@clerk/nextjs'
import type { UserPlan } from '@/types/user'
import { useEffect, useState } from 'react'

export function usePlan() {
  const { user, isLoaded } = useUser()
  const [plan, setPlan] = useState<UserPlan | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isLoaded) {
      const currentPlan = user?.publicMetadata?.plan as UserPlan || {
        type: 'free',
        startDate: new Date().toISOString()
      }
      
      setPlan(currentPlan)
      setIsLoading(false)
    }
  }, [user, isLoaded])

  // 添加刷新计划的方法
  const refreshPlan = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      await user.reload()
      const updatedPlan = user.publicMetadata?.plan as UserPlan || {
        type: 'free',
        startDate: new Date().toISOString()
      }
      setPlan(updatedPlan)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    plan,
    isLoading,
    refreshPlan
  }
} 