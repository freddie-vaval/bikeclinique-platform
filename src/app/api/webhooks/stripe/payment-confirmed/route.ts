/**
 * POST /api/webhooks/stripe/payment-confirmed
 * 
 * Called after Stripe payment succeeds
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { payment_intent_id, job_id, invoice_id, customer_id, amount } = body;

  if (!payment_intent_id) {
    return NextResponse.json({ error: 'Missing payment_intent_id' }, { status: 400 });
  }

  const supabase = createClient();

  try {
    if (job_id) {
      await supabase
        .from('jobs')
        .update({ 
          payment_status: 'paid',
          paid_at: new Date().toISOString(),
          status: 'awaiting_collection' 
        })
        .eq('id', job_id);
    }

    if (invoice_id) {
      await supabase
        .from('invoices')
        .update({
          status: 'paid',
          paid_date: new Date().toISOString().split('T')[0],
        })
        .eq('id', invoice_id);
    }

    let customerPhone = '';
    let customerName = '';

    if (customer_id) {
      const { data: customer } = await supabase
        .from('customers')
        .select('phone, name')
        .eq('id', customer_id)
        .single();
      customerPhone = customer?.phone || '';
      customerName = customer?.name || '';
    }

    if (customerPhone && process.env.TWILIO_PHONE_NUMBER) {
      const deliveryBookingUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://bikeclinique-platform.vercel.app'}/portal/book-delivery?job_id=${job_id}&payment_id=${payment_intent_id}`;
      const message = `Hi ${customerName || 'there'}, your bike service is complete! 💰 Payment of £${((amount || 0) / 100).toFixed(2)} received.\n\nNext: Book your delivery/collection 👇\n${deliveryBookingUrl}`;

      await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: customerPhone,
          From: process.env.TWILIO_PHONE_NUMBER!,
          Body: message,
        }),
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Payment confirmed webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
