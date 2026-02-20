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
    
    // Simulate AI generation (replace with Perplexity/OpenAI API)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newContent: GeneratedContent = {
      id: Date.now().toString(),
      title: prompt,
      body: `✨ Here's AI-generated ${contentTypeConfig[contentType].label.toLowerCase()} about "${prompt}":\n\n${getSampleContent(prompt, contentType)}`,
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
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">🧠 AI Powered</span>
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
            {['Spring service promo', 'How to clean your bike', 'New winter gear', 'Bike safety tips'].map((idea) => (
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
              <button className="px-4 py-2 text-sm bg-[#FF6B35] text-white rounded-lg hover:bg-[#e55a2b]">
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

function getSampleContent(prompt: string, type: ContentType): string {
  const samples: Record<ContentType, string> = {
    blog: `As cycling enthusiasts, we often get asked: "How do I know if my bike needs servicing?" Here\'s the truth — waiting until something breaks is never fun.\n\n🔧 Squeaky brakes? That\'s not normal.\n⚙️ Gear skipping? Time for adjustment.\n🛞 Wobbly wheels? Could need truing.\n\nRegular maintenance saves money long-term and keeps you safe. Book a checkup today!`,
    social: `🚴 ${prompt}?\n\nWe\'ve got you covered! Our expert mechanics are ready to help.\n\n👇 DM us to book or ask questions!`,
    email: `Hi there!\n\nThought you\'d be interested in our ${prompt} services!\n\nWe offer:\n✅ Expert mechanics\n✅ Quick turnaround\n✅ Fair pricing\n\nBook online or reply to this email!\n\nBest,\nThe Bike Clinique Team`,
    caption: `🚴 ${prompt} 🔧\n\nTag a friend who needs to see this! 👇\n\n#BikeLife #BikeRepair #CyclingUK`,
  }
  return samples[type]
}
