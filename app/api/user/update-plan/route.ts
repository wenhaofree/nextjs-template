import { NextResponse } from 'next/server'
import type { UserPlan } from '@/types/user'

export async function POST(req: Request) {
  try {
    const { userId, plan } = await req.json()

    if (!userId || !plan) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('🔄 Starting plan update:', {
      userId,
      newPlan: plan,
      timestamp: new Date().toISOString()
    })

    // 构建用户计划数据
    const userPlan: UserPlan = {
      type: plan,
      startDate: new Date().toISOString(),
      ...(plan !== 'unlimited' && {
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      })
    }

    try {
      // 直接使用 Clerk API 更新用户元数据
      const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          public_metadata: {
            plan: userPlan
          }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update user metadata')
      }

      const updatedUser = await response.json()

      console.log('✅ Plan update successful:', {
        userId,
        plan: userPlan,
        timestamp: new Date().toISOString(),
        updatedMetadata: updatedUser.public_metadata
      })

      return NextResponse.json({ 
        success: true,
        plan: userPlan
      })
    } catch (error) {
      console.error('❌ Error updating user metadata:', error)
      throw error
    }
  } catch (error) {
    console.error('❌ Error in plan update route:', error)
    return NextResponse.json(
      { error: 'Failed to update user plan' },
      { status: 500 }
    )
  }
} 