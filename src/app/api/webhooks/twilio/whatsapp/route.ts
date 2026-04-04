/**
 * POST /api/webhooks/twilio/whatsapp
 * 
 * Receives incoming WhatsApp messages with photos from customers.
 * AI analyses the image and recommends a bike service.
 * 
 * Twilio WhatsApp incoming webhook — configure in Twilio dashboard:
 * https://www.twilio.com/console/sms/whatsapp/ sandbox or your WhatsApp Business number
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
  const formData = await request.formData();
  
  const from = formData.get('From') as string;       // WhatsApp number
  const body = formData.get('Body') as string;       // Text message
  const numMedia = parseInt(formData.get('NumMedia') as string || '0');
  const mediaUrl0 = formData.get('MediaUrl0') as string; // Photo URL if sent

  const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

  // Initial greeting — no media yet
  if (!mediaUrl0 && !body?.toLowerCase().includes('book') && !body?.toLowerCase().includes('service')) {
    return TwiMLResponse(`
Hello! 👋 Welcome to Bike Clinique.

I can help you two ways:

📸 **Send a photo** of your bike issue and I'll recommend the right service.

📅 Or type "BOOK" to book a service appointment.

What would you like?
    `.trim());
  }

  // Handle booking request
  if (body?.toLowerCase().includes('book') || body?.toLowerCase().includes('appointment')) {
    const bookingLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://bikeclinique-platform.vercel.app'}/portal`;
    return TwiMLResponse(`
Great! Let's get your bike booked in. 🔧

📅 Book your appointment here:
${bookingLink}

Or call us and we'll sort it for you.
    `.trim());
  }

  // Handle photo with AI analysis
  if (mediaUrl0) {
    try {
      const analysis = await analyzeBikeImage(mediaUrl0);
      
      // Look up customer in our DB
      const supabase = createClient();
      const { data: customer } = await supabase
        .from('customers')
        .select('id, name')
        .eq('phone', from.replace('whatsapp:', ''))
        .single();

      // Log the enquiry
      if (customer) {
        await supabase.from('ai_service_enquiries').insert({
          customer_id: customer.id,
          media_url: mediaUrl0,
          ai_analysis: analysis.summary,
          recommended_services: analysis.services,
          status: 'pending_review',
        });
      }

      // Build response with service recommendations
      let response = `🔍 **AI Analysis Complete**\n\n${analysis.summary}\n\n`;

      if (analysis.services.length > 0) {
        response += `**Recommended Services:**\n`;
        analysis.services.forEach((s: string, i: number) => {
          response += `${i + 1}. ${s}\n`;
        });
      }

      response += `\n💬 To book any of these, reply with "BOOK" or visit:\n${process.env.NEXT_PUBLIC_SITE_URL || 'https://bikeclinique-platform.vercel.app'}/portal`;

      return TwiMLResponse(response);

    } catch (error) {
      console.error('WhatsApp AI analysis error:', error);
      return TwiMLResponse(`
Sorry, I couldn't analyze that photo. 😅

Try sending a clearer photo in good lighting, or type "BOOK" to speak with us directly about your bike issue.
      `.trim());
    }
  }

  return TwiMLResponse(`
Thanks for reaching out! 👋

Send me a photo of your bike issue and I'll recommend the right service, or type "BOOK" to schedule an appointment.
  `.trim());
}

function TwiMLResponse(message: string): NextResponse {
  return new NextResponse(
    `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${message.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</Message>
</Response>`,
    {
      headers: { 'Content-Type': 'text/xml' },
    }
  );
}

async function analyzeBikeImage(mediaUrl: string): Promise<{ summary: string; services: string[] }> {
  const apiKey = process.env.CLAUDE_API_KEY;

  if (!apiKey) {
    // Fallback without AI
    return {
      summary: "I can see your bike — we'd recommend a full service inspection to assess the work needed. Our mechanics will give you a full quote before any work starts.",
      services: ['Full Service', 'Safety Inspection'],
    };
  }

  try {
    // Fetch the image
    const imgRes = await fetch(mediaUrl);
    const imgBuffer = await imgRes.arrayBuffer();
    const imgBase64 = Buffer.from(imgBuffer).toString('base64');
    const imgContentType = imgRes.headers.get('content-type') || 'image/jpeg';

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 400,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: imgContentType as any,
                  data: imgBase64,
                },
              },
              {
                type: 'text',
                text: `You are an expert bike mechanic. Analyze this bike image and:

1. Identify any visible issues (worn components, damage, rust, mechanical problems)
2. Estimate urgency (immediate / soon / monitor)
3. Recommend 1-3 specific services from this list:
   - Puncture Repair (£15-25)
   - Gear Adjustment (£25-35)
   - Brake Adjustment (£25-35)
   - Brake Pad Replacement (£30-50)
   - Chain Replacement (£35-55)
   - Full Service (£80-150)
   - Safety Inspection (£20)
   - Wheels/TRU Check (£15)
   - Cable Replacement (£25-40)
   - Tyre Replacement (£30-70)

Respond in this exact format (no extra text):
SUMMARY: [2-3 sentence assessment]
SERVICES: [comma-separated service names, max 3]`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Claude vision error:', err);
      throw new Error('AI analysis failed');
    }

    const data = await response.json();
    const text = data.content?.[0]?.text?.trim() || '';

    // Parse response
    let summary = '';
    let services: string[] = [];

    const summaryMatch = text.match(/SUMMARY:\s*([\s\S]*?)(?=SERVICES:|$)/i);
    const servicesMatch = text.match(/SERVICES:\s*([\s\S]*?)$/i);

    if (summaryMatch) summary = summaryMatch[1].trim();
    if (servicesMatch) {
      services = servicesMatch[1]
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);
    }

    if (!summary) {
      summary = "I can see your bike — we'd recommend a full service inspection to assess the work needed.";
      services = ['Full Service'];
    }

    return { summary, services };

  } catch (error) {
    console.error('Vision analysis error:', error);
    return {
      summary: "I can see your bike — we'd recommend a full service inspection to make sure everything is working correctly.",
      services: ['Full Service', 'Safety Inspection'],
    };
  }
}
