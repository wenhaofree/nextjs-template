import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getAuth } from '@clerk/nextjs/server'
import type { UserPlan, PlanType } from '@/types/user'

const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY!, {
  apiVersion: process.env.STRIPE_API_VERSION as '2024-10-28.acacia',
})

export async function POST(req: Request) {
  try {
    const rawBody = await req.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      console.error('No stripe signature found')
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_TEST_WEBHOOK_SECRET!
      )
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      console.error(`⚠️  Webhook signature verification failed:`, errorMessage)
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${errorMessage}` },
        { status: 400 }
      )
    }

    console.log(`✅ Test webhook received: ${event.type}`, {
      id: event.id,
      type: event.type,
      timestamp: new Date(event.created * 1000).toISOString(),
      livemode: event.livemode
    })

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      
      const userId = session.metadata?.userId || session.client_reference_id
      const planType = session.metadata?.plan as PlanType

      if (userId && planType) {
        try {
          const beforeUpdateResponse = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
            headers: {
              'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
              'Content-Type': 'application/json'
            }
          })
          const beforeUpdateData = await beforeUpdateResponse.json()
          console.log('💫 Current plan before update:', {
            userId,
            plan: beforeUpdateData.public_metadata?.plan || { type: 'free' }
          })

          const userPlan: UserPlan = {
            type: planType,
            startDate: new Date().toISOString(),
            ...(planType !== 'unlimited' && {
              endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            })
          }

          const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
              'Content-Type': 'application/json'
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

          const afterUpdateResponse = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
            headers: {
              'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
              'Content-Type': 'application/json'
            }
          })
          const afterUpdateData = await afterUpdateResponse.json()
          
          console.log('✨ Plan update successful:', {
            userId,
            oldPlan: beforeUpdateData.public_metadata?.plan || { type: 'free' },
            newPlan: afterUpdateData.public_metadata?.plan,
            timestamp: new Date().toISOString()
          })

        } catch (error) {
          console.error('❌ Error updating user plan:', error)
        }
      }

      console.log('💰 Test payment success:', {
        sessionId: session.id,
        userId,
        planType,
        amount: session.amount_total,
        currency: session.currency,
        paymentStatus: session.payment_status,
      })
    }

    return NextResponse.json({ 
      received: true,
      type: event.type,
      id: event.id,
      isTest: true
    })

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error('❌ Webhook error:', errorMessage)
    return NextResponse.json(
      { error: `Webhook handler failed: ${errorMessage}` },
      { status: 400 }
    )
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
} 