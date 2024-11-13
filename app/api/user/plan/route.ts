import { getAuth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const { userId } = getAuth(req)
    
    if (!userId) {
      console.log('❌ Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔍 Fetching plan for user:', userId)

    // 从 Clerk 获取用户数据
    const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user data')
    }

    const userData = await response.json()
    const plan = userData.public_metadata?.plan || { type: 'free' }

    console.log('📋 Current user plan:', {
      userId,
      plan,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({ plan })
  } catch (error) {
    console.error('❌ Error fetching user plan:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user plan' },
      { status: 500 }
    )
  }
} 