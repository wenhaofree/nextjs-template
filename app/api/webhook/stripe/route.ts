import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { UserAPI } from '@/lib/api/user'
import { createTool } from '@/app/actions'
import { PlanType } from '@/types/user'

const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY!, {
  apiVersion: process.env.STRIPE_API_VERSION as '2024-10-28.acacia',
})

// 直接使用环境变量，不做额外处理
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const headerList = await headers()
    const stripeSignature = headerList.get('stripe-signature')
    
    if (!stripeSignature) {
      console.error('❌ No stripe signature found')
      return NextResponse.json(
        { error: 'No stripe signature found' },
        { status: 400 }
      )
    }

    if (!webhookSecret) {
      console.error('❌ No webhook secret found:', {
        webhookSecret,
        env: process.env.NODE_ENV
      })
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    let event: Stripe.Event
    try {
      // 使用原始的 webhookSecret
      event = stripe.webhooks.constructEvent(
        body,
        stripeSignature,
        webhookSecret
      )

      console.log('✅ Webhook signature verified:', {
        eventId: event.id,
        type: event.type
      })
    } catch (err) {
      const error = err as Error
      console.error('❌ Webhook signature verification failed:', {
        error: error.message,
        signature: stripeSignature.slice(0, 10) + '...',
        webhookSecretLength: webhookSecret.length
      })
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      )
    }

    // 处理事件
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const { metadata } = session
      
      if (!metadata) {
        throw new Error('No metadata in session')
      }

      const { planType, submissionName, submissionUrl } = metadata
      const userId = session.client_reference_id

      if (!userId || !planType) {
        throw new Error('Missing userId or planType in session metadata')
      }

      console.log('✅ Processing checkout session:', {
        userId,
        planType,
        submissionName,
        submissionUrl
      })

      // 更新用户计划
      const planUpdateResult = await UserAPI.updatePlan(userId, planType as PlanType)
      if (!planUpdateResult.success) {
        console.error('❌ Failed to update user plan:', planUpdateResult.error)
        // 继续处理，不要中断流程
      }

      // 创建工具记录
      if (submissionName && submissionUrl) {
        const result = await createTool({
          name: submissionName,
          link: submissionUrl,
          userId: userId,
          priceType: planType,
          status: 'active'
        })

        console.log('✅ Tool status updated:', {
          id: result.id,
          title: result.title,
          status: result.status
        })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    const err = error as Error
    console.error('❌ Webhook error:', {
      message: err.message,
      stack: err.stack
    })
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    )
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
} 