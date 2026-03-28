import { NextRequest, NextResponse } from 'next/server'

// AI Content Generation API
// Configure PERPLEXITY_API_KEY in .env.local to enable AI generation

export async function POST(request: NextRequest) {
  try {
    const { prompt, type } = await request.json()
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const perplexityKey = process.env.PERPLEXITY_API_KEY
    
    if (!perplexityKey) {
      return NextResponse.json({ 
        error: 'AI not configured',
        message: 'Add PERPLEXITY_API_KEY to .env.local to enable AI generation'
      }, { status: 503 })
    }

    // Build the prompt based on content type
    const typePrompts: Record<string, string> = {
      blog: `Write a compelling blog post about "${prompt}" for a bike shop. Include practical tips, conversational tone, and a call to action at the end. Around 500 words.`,
      social: `Write an engaging social media post (Instagram/Facebook) about "${prompt}" for a bike shop. Use emojis, include a call to action, and relevant hashtags. Keep it under 280 characters.`,
      email: `Write a friendly promotional email about "${prompt}" for a bike shop. Include a subject line, greeting, body with 2-3 key points, and a clear call to action.`,
      caption: `Write a short, catchy TikTok/Reel caption about "${prompt}" for a bike shop. Include hook, context, and call to action with relevant hashtags.`
    }

    const systemPrompt = typePrompts[type] || typePrompts.social

    // Call Perplexity API
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${perplexityKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a professional marketing copywriter for a bike shop. Write engaging, conversion-focused content.'
          },
          {
            role: 'user',
            content: systemPrompt
          }
        ],
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      throw new Error('Perplexity API error')
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''

    return NextResponse.json({ content })

  } catch (error) {
    console.error('Content generation error:', error)
    return NextResponse.json({ 
      error: 'Generation failed',
      message: 'Using local fallback instead'
    }, { status: 500 })
  }
}
