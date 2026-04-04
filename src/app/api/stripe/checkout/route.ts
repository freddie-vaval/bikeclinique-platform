/**
 * POST /api/stripe/checkout
 * Creates a Stripe Checkout Session for an invoice
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
  const { invoiceId } = await request.json();

  if (!invoiceId) {
    return NextResponse.json({ error: 'Missing invoiceId' }, { status: 400 });
  }

  const supabase = createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bikeclinique-platform.vercel.app';

  const { data: invoice, error } = await supabase
    .from('invoices')
    .select('*, customers(*), jobs(job_number)')
    .eq('id', invoiceId)
    .single();

  if (error || !invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }

  if (invoice.status === 'paid') {
    return NextResponse.json({ error: 'Invoice already paid' }, { status: 400 });
  }

  const customer = invoice.customers;
  const description = [
    `Invoice ${invoice.invoice_number}`,
    invoice.jobs?.job_number ? `Job ${invoice.jobs.job_number}` : '',
  ].filter(Boolean).join(' — ');

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: `Bike Service — ${invoice.invoice_number}`,
            description,
          },
          unit_amount: Math.round((invoice.total || 0) * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${siteUrl}/portal/pay/success?session_id={CHECKOUT_SESSION_ID}&invoice_id=${invoice.id}`,
    cancel_url: `${siteUrl}/portal/pay/cancel?invoice_id=${invoice.id}`,
    customer_email: customer?.email || undefined,
    metadata: {
      invoice_id: invoice.id,
      job_id: invoice.job_id || '',
      customer_id: customer?.id || '',
    },
  });

  return NextResponse.json({ url: session.url });
}
