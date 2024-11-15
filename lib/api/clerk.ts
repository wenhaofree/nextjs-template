import { ClerkUser } from '@/types/clerk'
import { UserPlan } from '@/types/user'

export const updateUserPlan = async (userId: string, plan: UserPlan): Promise<ClerkUser> => {
  const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      public_metadata: { plan }
    })
  })

  if (!response.ok) {
    throw new Error('Failed to update user plan')
  }

  return response.json()
}

export const getUserPlan = async (userId: string): Promise<UserPlan | null> => {
  const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
    headers: {
      'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    }
  })

  if (!response.ok) {
    return null
  }

  const user = await response.json()
  return user.public_metadata?.plan || { type: 'free' }
} 