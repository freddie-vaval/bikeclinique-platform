import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null

// POST /api/payments/create-intent
// Creates a payment intent for collecting booking deposits/payments
export async function POST(request: NextRequest) {
  if (!stripe) {
    // Return mock data when Stripe is not configured
    return NextResponse.json({
      clientSecret: 'mock_client_secret',
      paymentIntentId: 'mock_' + Date.now(),
      note: 'Stripe not configured - running in mock mode',
    })
  }

  try {
    const body = await request.json()
    const { amount, currency = 'gbp', customerName, customerEmail, serviceName, bookingId } = body

    if (!amount || !customerName || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create or retrieve customer
    const existingCustomers = await stripe.customers.list({
      email: customerEmail,
      limit: 1,
    })

    let customerId: string
    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id
    } else {
      const newCustomer = await stripe.customers.create({
        name: customerName,
        email: customerEmail,
      })
      customerId = newCustomer.id
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      customer: customerId,
      metadata: {
        serviceName: serviceName || 'Bike Service',
        bookingId: bookingId || '',
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error('Payment intent creation failed:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}

// GET /api/payments/status
// Check payment status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const paymentIntentId = searchParams.get('id')

  if (!paymentIntentId) {
    return NextResponse.json(
      { error: 'Missing payment intent ID' },
      { status: 400 }
    )
  }

  if (!stripe) {
    return NextResponse.json({
      status: 'succeeded',
      amount: 0,
      note: 'Stripe not configured - mock mode',
    })
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    return NextResponse.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to retrieve payment status' },
      { status: 500 }
    )
  }
}
