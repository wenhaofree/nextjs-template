import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { nanoid } from 'nanoid'

// 使用测试环境的 Secret Key
const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY || '', {
  apiVersion: '2024-10-28.acacia',
})

// 测试环境的价格 ID
const PRICE_IDS: Record<string, string | null> = {
  'free': null,
  'one-time': 'prod_RCxUnKVhNHxg4B',
  'unlimited': 'price_1Oq2xxxxxxxxxxx',
  'sponsor': 'price_1Oq2xxxxxxxxxxx',
}

export async function POST(req: Request) {
  try {
    const { name, url, plan } = await req.json()

    if (plan === 'free' || !PRICE_IDS[plan]) {
      return NextResponse.json({ 
        sessionUrl: `/submit/success?free=true` 
      })
    }

    const referenceId = nanoid()

    // 创建测试环境的 Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: PRICE_IDS[plan as keyof typeof PRICE_IDS],
          quantity: 1,
        },
      ],
      mode: plan === 'unlimited' ? 'subscription' : 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/submit/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/submit`,
      client_reference_id: referenceId,
      metadata: {
        name,
        url,
        plan,
      },
      payment_intent_data: {
        setup_future_usage: plan === 'unlimited' ? 'off_session' : undefined,
      },
      allow_promotion_codes: true,
      custom_fields: [
        {
          key: 'remarks',
          label: { type: 'custom', custom: '备注信息（可选）' },
          type: 'text',
          optional: true,
        },
      ],
    })

    return NextResponse.json({ sessionUrl: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    )
  }
} 