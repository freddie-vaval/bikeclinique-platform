/**
 * POST /api/webhooks/stripe
 * Handles Stripe webhook events
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_placeholder', {
    apiVersion: '2026-01-28.clover',
  });
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const invoiceId = session.metadata?.invoice_id;
      const jobId = session.metadata?.job_id;
      const customerId = session.metadata?.customer_id;

      if (invoiceId) {
        await supabase
          .from('invoices')
          .update({
            status: 'paid',
            paid_date: new Date().toISOString().split('T')[0],
          })
          .eq('id', invoiceId);
      }

      if (jobId) {
        await supabase
          .from('jobs')
          .update({
            payment_status: 'paid',
            paid_at: new Date().toISOString(),
            status: 'awaiting_collection',
          })
          .eq('id', jobId);

        if (customerId) {
          const { data: cust } = await supabase
            .from('customers')
            .select('phone, name')
            .eq('id', customerId)
            .single();

          if (cust?.phone && process.env.TWILIO_PHONE_NUMBER) {
            const deliveryLink = `${process.env.NEXT_PUBLIC_SITE_URL}/portal/book-delivery?job_id=${jobId}`;
            const msg = `Hi ${cust.name || 'there'}, payment of £${((session.amount_total || 0) / 100).toFixed(2)} received ✅\n\nYour bike is ready! Book delivery/collection:\n${deliveryLink}`;

            await fetch(
              `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
              {
                method: 'POST',
                headers: {
                  'Authorization': `Basic ${Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64')}`,
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                  To: cust.phone,
                  From: process.env.TWILIO_PHONE_NUMBER!,
                  Body: msg,
                }),
              }
            );
          }
        }
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
