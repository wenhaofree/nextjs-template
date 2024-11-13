import { useUser } from '@clerk/nextjs'
import type { UserPlan } from '@/types/user'

export function usePlan() {
  const { user, isLoaded } = useUser()
  
  if (!isLoaded) {
    return {
      plan: null,
      isLoading: true
    }
  }

  const plan = user?.publicMetadata?.plan as UserPlan || {
    type: 'free',
    startDate: new Date().toISOString()
  }

  return {
    plan,
    isLoading: false
  }
} 