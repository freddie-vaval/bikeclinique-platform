'use client'

import { useState } from 'react'

type ContentType = 'blog' | 'social' | 'email' | 'caption'

interface GeneratedContent {
  id: string
  title: string
  body: string
  type: ContentType
  createdAt: string
}

const contentTypeConfig = {
  blog: { label: 'Blog Post', icon: '📝', placeholder: 'e.g., 5 Signs Your Bike Needs a Service' },
  social: { label: 'Social Post', icon: '📱', placeholder: 'e.g., New bike accessories just in!' },
  email: { label: 'Email', icon: '📧', placeholder: 'e.g., Spring service promotion' },
  caption: { label: 'Caption', icon: '🎬', placeholder: 'e.g., Bike repair timelapse video' },
}

export default function ContentBuilderPage() {
  const [contentType, setContentType] = useState<ContentType>('social')
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null)
  const [results, setResults] = useState<GeneratedContent[]>([
    {
      id: '1',
      title: '5 Essential Winter Bike Maintenance Tips',
      body: 'As the temperatures drop, it\'s crucial to prepare your bike for winter riding. Here are our top tips...\n\n1. Clean your chain and apply wet lube\n2. Check your brake pads for wear\n3. Inspect tire pressure more frequently\n4. Store your bike indoors when possible\n5. Get a professional winter service\n\nRegular maintenance extends your bike\'s lifespan and ensures safe riding throughout the colder months.',
      type: 'blog',
      createdAt: '2 hours ago',
    },
    {
      id: '2',
      title: 'Spring into Action! 🚴',
      body: '☀️ Spring is here! Is your bike ready?\n\nBook your service today and get 20% off any repairs booked before the end of March!\n\n🔧 Full Service from £99\n⚡ Quick Tune-up from £35\n\nDon\'t wait until your chain snaps on a weekend ride. Message us to book!',
      type: 'social',
      createdAt: '1 day ago',
    },
  ])

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    
    // Try to call AI API (Perplexity), fallback to local generation
    let generatedContent = ''
    
    try {
      // Check if AI is configured on first run
      if (aiConfigured === null) {
        const checkResponse = await fetch('/api/content/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: 'test', type: 'social' })
        })
        setAiConfigured(checkResponse.ok)
      }
      
      // Attempt to call AI API if configured
      if (aiConfigured) {
        const response = await fetch('/api/content/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, type: contentType })
        })
        
        if (response.ok) {
          const data = await response.json()
          generatedContent = data.content
        } else {
          throw new Error('API not configured')
        }
      } else {
        throw new Error('AI not configured')
      }
    } catch {
      // Fallback to local intelligent generation
      await new Promise(resolve => setTimeout(resolve, 1500))
      generatedContent = getSampleContent(prompt, contentType)
    }
    
    const newContent: GeneratedContent = {
      id: Date.now().toString(),
      title: prompt,
      body: generatedContent,
      type: contentType,
      createdAt: 'Just now',
    }
    
    setResults([newContent, ...results])
    setPrompt('')
    setIsGenerating(false)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">AI Content Builder</h1>
          <p className="text-sm text-gray-500">Generate marketing content with AI</p>
        </div>
        <div className="flex items-center gap-2">
          {aiConfigured === false && (
            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">Local Mode</span>
          )}
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">🧠 AI Powered</span>
        </div>
      </div>

      {/* Generator Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4">Create New Content</h2>
        
        {/* Content Type Selection */}
        <div className="flex gap-2 mb-4">
          {(Object.entries(contentTypeConfig) as [ContentType, typeof contentTypeConfig[ContentType]][]).map(([type, config]) => (
            <button
              key={type}
              onClick={() => setContentType(type)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                contentType === type
                  ? 'bg-[#1A1A2E] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{config.icon}</span>
              <span>{config.label}</span>
            </button>
          ))}
        </div>

        {/* Prompt Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder={contentTypeConfig[contentType].placeholder}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isGenerating || !prompt.trim()
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-[#FF6B35] text-white hover:bg-[#e55a2b]'
            }`}
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span> Generating...
              </span>
            ) : (
              '✨ Generate'
            )}
          </button>
        </div>

        {/* Quick Prompts */}
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-2">Quick ideas:</p>
          <div className="flex flex-wrap gap-2">
            {['Spring service promo', 'How to clean your bike', 'New winter gear', 'Bike safety tips', 'Electric bike maintenance', 'Mountain bike service'].map((idea) => (
              <button
                key={idea}
                onClick={() => setPrompt(idea)}
                className="px-3 py-1 text-xs bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                {idea}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generated Content */}
      <h2 className="text-lg font-semibold mb-4">Generated Content</h2>
      <div className="space-y-4">
        {results.map((content) => (
          <div key={content.id} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{contentTypeConfig[content.type].icon}</span>
                <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{contentTypeConfig[content.type].label}</span>
              </div>
              <span className="text-xs text-gray-400">{content.createdAt}</span>
            </div>
            <h3 className="font-semibold text-[#1A1A2E] mb-2">{content.title}</h3>
            <pre className="text-sm text-gray-600 whitespace-pre-wrap font-sans">{content.body}</pre>
            <div className="flex gap-2 mt-4 pt-4 border-t">
              <button 
                onClick={() => navigator.clipboard.writeText(content.body)}
                className="px-4 py-2 text-sm bg-[#FF6B35] text-white rounded-lg hover:bg-[#e55a2b]"
              >
                Copy
              </button>
              <button className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">
                Edit
              </button>
              <button className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">
                Schedule
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Intelligent local content generation with topic-specific templates
function getSampleContent(prompt: string, type: ContentType): string {
  const topic = prompt.toLowerCase()
  
  switch (type) {
    case 'blog':
      return generateBlogContent(topic, prompt)
    case 'social':
      return generateSocialContent(topic, prompt)
    case 'email':
      return generateEmailContent(topic, prompt)
    case 'caption':
      return generateCaptionContent(topic, prompt)
    default:
      return generateSocialContent(topic, prompt)
  }
}

function generateBlogContent(topic: string, originalPrompt: string): string {
  if (topic.includes('spring')) {
    return `🌷 Is Your Bike Ready for Spring?\n\nAfter months of winter storage, your bike is probably due for some attention. Here's what to check:\n\n1. **Tires** - Check for cracks, wear, and inflate to proper pressure\n2. **Chain** - Clean and lubricate if rusty or dry\n3. **Brakes** - Test responsiveness, check pad wear\n4. **Gears** - Index adjustment may be needed after winter\n5. **Lights** - Ensure batteries work if using lights\n\nDon't forget: Book your spring service early! We get busy when the weather warms up.\n\nReady to ride? 👉 Book online today!\n\n#BikeService #SpringCycling #BikeMaintenance`
  }
  
  if (topic.includes('winter') || topic.includes('storage')) {
    return `❄️ Winter Bike Storage Tips\n\nProper storage extends your bike's life:\n\n• **Clean first** - Remove dirt and grime\n• **Dry thoroughly** - Prevent rust\n• **Lubricate chain** - Use wet lube for moisture\n• **Inflate tires** - Prevents sidewall cracks\n• **Remove batteries** - From lights and computers\n• **Store indoors** - Climate controlled is best\n\nPro tip: Consider a professional winter service before storing - we'll prep it right!\n\nQuestions? Reach out! 🚴`
  }
  
  if (topic.includes('clean')) {
    return `🧽 How to Clean Your Bike Properly\n\nA clean bike is a happy bike! Here's how to do it right:\n\n**What you'll need:**\n- Bucket of warm soapy water\n- Soft brushes\n- Degreaser\n- Clean rags\n- Chain lube\n\n**Steps:**\n1. Rinse bike with water\n2. Apply soapy water, scrub frame\n3. Use degreaser on chain & gears\n4. Rinse thoroughly\n5. Dry completely\n6. Lubricate chain\n\n**Pro tip:** Clean your bike monthly for best performance!\n\n#BikeMaintenance #BikeCleaning #CyclingTips`
  }
  
  if (topic.includes('safety') || topic.includes('tips')) {
    return `🛡️ Essential Bike Safety Tips\n\nStay safe on every ride with these fundamentals:\n\n**Before You Ride:**\n✅ Check tire pressure\n✅ Test brakes work\n✅ Ensure lights are working\n✅ Look for loose bolts\n\n**On the Road:**\n🚦 Follow traffic laws\n👀 Be aware of surroundings\n🔔 Use your bell\n🛑 Signal your turns\n\n**Regular Maintenance = Safety:**\nDon't skip service appointments - they're about your safety!\n\n#BikeSafety #CyclingTips #RideSafe`
  }
  
  return `🚴 ${originalPrompt}\n\nRegular bike maintenance is key to:\n✅ Safer rides\n✅ Longer component life\n✅ Better performance\n✅ Avoiding costly repairs\n\nOur expert mechanics are here to help keep you rolling!\n\nBook your service today 👉`
}

function generateSocialContent(topic: string, originalPrompt: string): string {
  if (topic.includes('service') || topic.includes('promo') || topic.includes('spring') || topic.includes('discount')) {
    return `🚴 Spring Service Special!\n\nGet your bike ready for the new season!\n\n✅ Full safety check\n✅ Gear & brake adjustment\n✅ Chain clean & lube\n\nBook now and save 20%!\n\n🔗 Link in bio\n\n#BikeService #SpringRide #CyclingUK`
  }
  
  if (topic.includes('tips') || topic.includes('how to') || topic.includes('safety')) {
    return `💡 ${originalPrompt}\n\nHere's what you need to know 👇\n\nTag a friend who rides! 🚴\n\n#BikeTips #Cycling`
  }
  
  if (topic.includes('electric') || topic.includes('e-bike')) {
    return `⚡ E-Bike Service Specialists\n\nWe service all e-bike brands:\n\n✅ Battery health checks\n✅ Motor diagnostics\n✅ Display systems\n✅ Regular maintenance\n\nDon't trust your e-bike to just anyone!\n\n👇 DM to book\n\n#EBike #ElectricBike #BikeService`
  }
  
  return `🚴 ${originalPrompt}\n\n👇 DM us to book or ask questions!\n\n#BikeLife #BikeShop`
}

function generateEmailContent(topic: string, originalPrompt: string): string {
  const subject = topic.includes('spring') ? 'Spring Service Special - 20% Off!' 
    : topic.includes('promo') || topic.includes('discount') ? 'Special Offer Just for You!'
    : `${originalPrompt} - Book Now!`
    
  return `Subject: ${subject}\n\nHi there!\n\nGreat news - we've got ${originalPrompt} ready for you!\n\nWhy choose BikeClinique:\n✅ Expert mechanics with years of experience\n✅ Quick turnaround times\n✅ Fair, transparent pricing\n✅ Free safety checks with every service\n\n🌷 Spring is the perfect time to get your bike serviced!\n\nBook online now: bikeclinique-platform.vercel.app/book\n\nQuestions? Just reply to this email!\n\nHappy cycling!\nThe BikeClinique Team 🚴`
}

function generateCaptionContent(topic: string, originalPrompt: string): string {
  if (topic.includes('service') || topic.includes('repair')) {
    return `🔧 ${originalPrompt} 🔧\n\nYour bike deserves pro care!\n\n👉 Book via link in bio\n\nTag a friend who needs this! 👇\n\n#BikeTok #BikeRepair #CycleRepair #CyclingUK #BikeLife`
  }
  
  return `🚴 ${originalPrompt} 🚴\n\nYour bike deserves pro care!\n\n👉 Book via link in bio\n\nTag a friend who needs to see this! 👇\n\n#BikeTok #BikeRepair #CycleRepair #CyclingUK #BikeLife`
}
