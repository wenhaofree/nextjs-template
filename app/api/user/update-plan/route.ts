import { NextResponse } from 'next/server'
import { updateUserPlan } from '@/lib/api/clerk'
import { PlanType } from '@/types/user'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const userId = body.userId
    const planType = body.planType || body.plan

    if (!userId) {
      console.error('❌ Missing userId:', body)
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      )
    }

    if (!planType) {
      console.error('❌ Missing plan type:', body)
      return NextResponse.json(
        { error: 'Missing plan type (planType or plan)' },
        { status: 400 }
      )
    }

    const normalizedPlanType: PlanType = planType as PlanType

    const validPlanTypes: PlanType[] = ['free', 'one-time', 'unlimited', 'sponsor']
    if (!validPlanTypes.includes(normalizedPlanType)) {
      console.error('❌ Invalid plan type:', planType)
      return NextResponse.json(
        { error: `Invalid plan type. Must be one of: ${validPlanTypes.join(', ')}` },
        { status: 400 }
      )
    }

    console.log('🔄 Updating user plan:', {
      userId,
      planType: normalizedPlanType,
      timestamp: new Date().toISOString()
    })

    try {
      const updatedUser = await updateUserPlan(userId, {
        type: normalizedPlanType
      })

      console.log('✅ User plan updated successfully:', {
        userId: updatedUser.id,
        planType: normalizedPlanType,
        metadata: updatedUser.public_metadata
      })

      return NextResponse.json({ 
        success: true,
        user: {
          id: updatedUser.id,
          plan: updatedUser.public_metadata?.plan || { type: 'free' }
        }
      })
    } catch (clerkError) {
      console.error('❌ Clerk API error:', clerkError)
      return NextResponse.json(
        { error: 'Failed to update user metadata' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('❌ Error updating user plan:', error)
    return NextResponse.json(
      { error: 'Failed to update user plan' },
      { status: 500 }
    )
  }
} 