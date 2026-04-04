/**
 * POST /api/jobs/[id]/complete
 * 
 * Marks a job as complete, creates an invoice, generates Stripe checkout,
 * and sends the customer a payment link via SMS/WhatsApp.
 * 
 * Body: { send_sms?: boolean, notes?: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_placeholder', {
    apiVersion: '2026-01-28.clover',
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: jobId } = await params;
  const body = await request.json().catch(() => ({}));
  const sendSms = body.send_sms !== false;

  const supabase = createClient();

  try {
    // 1. Get job with customer details
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*, customers(*)')
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const customer = job.customers;
    const customerPhone = customer?.phone || '';
    const customerEmail = customer?.email || '';
    const customerName = customer?.name || 'Customer';

    // 2. Calculate job total (services + parts)
    const { data: jobServices } = await supabase
      .from('job_services')
      .select('*, services(name, price, duration_minutes)')
      .eq('job_id', jobId);

    let subtotal = 0;
    const lineItems = (jobServices || []).map((js: any) => {
      const price = js.services?.price || 0;
      subtotal += price;
      return { service_name: js.services?.name || 'Service', price };
    });

    const { data: jobParts } = await supabase
      .from('job_parts')
      .select('*, parts(name, price)')
      .eq('job_id', jobId);

    (jobParts || []).forEach((jp: any) => {
      const price = jp.price || jp.parts?.price || 0;
      subtotal += price;
      lineItems.push({ service_name: jp.parts?.name || 'Part', price });
    });

    if (subtotal === 0) subtotal = job.price || 0;

    const vatRate = 20;
    const vatAmount = subtotal * (vatRate / 100);
    const total = subtotal + vatAmount;

    // 3. Get invoice settings
    const { data: invSettings } = await supabase
      .from('invoice_settings')
      .select('prefix, starting_number')
      .limit(1)
      .single();

    const prefix = invSettings?.prefix || '#INV-';
    const startNum = invSettings?.starting_number || 1;

    const { data: lastInvoice } = await supabase
      .from('invoices')
      .select('invoice_number')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    let nextNum = startNum;
    if (lastInvoice?.invoice_number) {
      const lastNum = parseInt(lastInvoice.invoice_number.replace(prefix, ''));
      if (!isNaN(lastNum)) nextNum = lastNum + 1;
    }
    const invoiceNumber = `${prefix}${String(nextNum).padStart(4, '0')}`;

    // 4. Create invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        invoice_number: invoiceNumber,
        job_id: jobId,
        customer_id: customer?.id,
        subtotal,
        vat_rate: vatRate,
        vat_amount: vatAmount,
        total,
        status: 'sent',
        issue_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: body.notes || null,
      })
      .select()
      .single();

    if (invoiceError) {
      return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
    }

    // 5. Create Stripe Checkout Session
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bikeclinique-platform.vercel.app';
    const checkoutUrl = `${siteUrl}/portal/pay/${invoice.id}`;

    let stripeSession: any = null;
    if (process.env.STRIPE_SECRET_KEY) {
      try {
        const stripe = getStripe();
        stripeSession = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'gbp',
                product_data: {
                  name: `Bike Service - ${invoiceNumber}`,
                  description: lineItems.map(li => `${li.service_name}: £${li.price.toFixed(2)}`).join(', '),
                },
                unit_amount: Math.round(total * 100),
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${siteUrl}/portal/pay/success?session_id={CHECKOUT_SESSION_ID}&invoice_id=${invoice.id}`,
          cancel_url: `${siteUrl}/portal/pay/cancel?invoice_id=${invoice.id}`,
          customer_email: customerEmail || undefined,
          metadata: {
            invoice_id: invoice.id,
            job_id: jobId,
            customer_id: customer?.id || '',
          },
        });
      } catch (stripeErr) {
        console.error('Stripe error:', stripeErr);
      }
    }

    // 6. Update job status
    await supabase
      .from('jobs')
      .update({ status: 'bike_ready', invoice_id: invoice.id })
      .eq('id', jobId);

    // 7. Send SMS
    let smsSent = false;
    if (sendSms && customerPhone && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      const paymentLink = stripeSession?.url || checkoutUrl;
      const message = `Hi ${customerName}, your bike service is complete! 🔧\n\nInvoice ${invoiceNumber}: £${total.toFixed(2)} (inc. VAT)\n\nPay now: ${paymentLink}\n\nQuestions? Reply or call us.`;

      try {
        const twilioRes = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
          {
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
          }
        );
        if (twilioRes.ok) {
          smsSent = true;
          await supabase.from('sms_log').insert({
            job_id: jobId,
            customer_id: customer?.id,
            message,
            status: 'sent',
            channel: 'sms',
          });
        }
      } catch (smsErr) {
        console.error('SMS error:', smsErr);
      }
    }

    return NextResponse.json({
      success: true,
      invoice: { id: invoice.id, number: invoiceNumber, total, vatAmount },
      paymentLink: stripeSession?.url || checkoutUrl,
      smsSent,
      jobStatus: 'bike_ready',
    });

  } catch (error) {
    console.error('Complete job error:', error);
    return NextResponse.json({ error: 'Failed to complete job' }, { status: 500 });
  }
}
