/**
 * POST /api/jobs/[id]/summarise
 * 
 * Takes a job's checklist + notes, sends to Claude AI,
 * returns a clean customer-facing service summary.
 * 
 * Body: { checklist?: object, notes?: string, jobId?: string }
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { checklist, notes, jobId } = body;

  // Get job data if jobId provided
  let jobData: any = null;
  if (jobId) {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = createClient();
    const { data } = await supabase
      .from('jobs')
      .select('*, customers(name), job_services(services(name, price)), job_parts(parts(name, price))')
      .eq('id', jobId)
      .single();
    jobData = data;
  }

  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'AI not configured' }, { status: 500 });
  }

  // Build the prompt
  const customerName = jobData?.customers?.name || 'customer';
  
  // Extract completed checklist items
  const completedItems = checklist 
    ? Object.entries(checklist)
        .filter(([, v]) => v === true || (v as any)?.completed === true)
        .map(([k]) => k.replace(/_/g, ' '))
    : [];

  const services = jobData?.job_services?.map((js: any) => js.services?.name).filter(Boolean) || [];
  const parts = jobData?.job_parts?.map((jp: any) => jp.parts?.name).filter(Boolean) || [];

  const summaryPrompt = `You are a friendly bike mechanic writing a customer summary.

Write a 2-3 sentence summary of the work completed for ${customerName}.

Work completed:
${completedItems.length > 0 ? `- Checklist: ${completedItems.join(', ')}` : ''}
${services.length > 0 ? `- Services: ${services.join(', ')}` : ''}
${parts.length > 0 ? `- Parts replaced: ${parts.join(', ')}` : ''}
${notes ? `- Mechanic notes: ${notes}` : ''}

Format:
- Warm and professional tone
- No jargon (use "brakes" not "brake pads replaced")
- Mention what was done and why it matters to the rider
- End with a helpful tip related to the work done

Example:
"Replaced your worn brake pads and adjusted the cable tension. Your brakes are now sharp and responsive — you'll notice the difference on your next ride. Good to know: brake pads take about 100 miles to bed in properly."

Only write the summary, nothing else.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content: summaryPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Claude error:', err);
      return NextResponse.json({ error: 'AI summarisation failed' }, { status: 500 });
    }

    const data = await response.json();
    const summary = data.content?.[0]?.text?.trim();

    // Save summary to job if jobId
    if (jobId && summary) {
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = createClient();
      await supabase
        .from('jobs')
        .update({ ai_summary: summary })
        .eq('id', jobId);
    }

    return NextResponse.json({ 
      success: true, 
      summary,
      wordCount: summary?.split(' ').length || 0,
    });

  } catch (error) {
    console.error('Summarise error:', error);
    return NextResponse.json({ error: 'Summarisation failed' }, { status: 500 });
  }
}
