'use client'

import { useState } from 'react'
import { 
  Sparkles, 
  Instagram, 
  Facebook, 
  Youtube, 
  Mail, 
  Copy, 
  Check,
  Loader2,
  Hash,
  Image,
  Video,
  FileText,
  Megaphone,
  ShoppingCart
} from 'lucide-react'

type ContentType = 'instagram' | 'facebook' | 'youtube' | 'email' | 'ad' | 'listing' | 'tiktok'
type Tone = 'professional' | 'friendly' | 'exciting' | 'educational'

interface GeneratedContent {
  id: string
  type: ContentType
  content: string
  platform: string
}

const platformIcons: Record<ContentType, React.ReactNode> = {
  instagram: <Instagram className="w-5 h-5" />,
  facebook: <Facebook className="w-5 h-5" />,
  youtube: <Youtube className="w-5 h-5" />,
  email: <Mail className="w-5 h-5" />,
  ad: <Megaphone className="w-5 h-5" />,
  listing: <ShoppingCart className="w-5 h-5" />,
  tiktok: <Video className="w-5 h-5" />
}

const platformLabels: Record<ContentType, string> = {
  instagram: 'Instagram Post',
  facebook: 'Facebook Post',
  youtube: 'YouTube Script',
  email: 'Email Newsletter',
  ad: 'Ad Copy',
  listing: 'Bike Listing',
  tiktok: 'TikTok Script'
}

export default function AIContentGenerator() {
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState<GeneratedContent[]>([])
  const [copied, setCopied] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    contentType: 'instagram' as ContentType,
    topic: '',
    bikeDetails: '',
    tone: 'friendly' as Tone,
    includeHashtags: true,
    includeEmoji: true,
    length: 'medium' as 'short' | 'medium' | 'long'
  })

  const handleGenerate = async () => {
    if (!formData.topic.trim()) return
    
    setLoading(true)
    
    // Simulate AI generation (replace with actual AI API call)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const templates: Record<ContentType, string> = {
      instagram: `${formData.includeEmoji ? '🚴 ' : ''}${formData.topic}${formData.includeEmoji ? ' 🚴' : ''}\n\n${formData.bikeDetails || 'Premium bike, professionally serviced, ready to ride.'}\n\n${formData.includeHashtags ? '\n#bike #cycling #premiumbike #gravel #ebike #londoncycling #bikeclub' : ''}`,
      facebook: `🛒 ${formData.topic} 🛒\n\n${formData.bikeDetails || 'Looking for a quality ride? This beauty is ready to go!'} \n\nProfessionally serviced by our expert mechanics. Every bike comes with our service guarantee.\n\n📍 London based\n🚛 Free delivery available\n✅ Full safety check\n\nDM for details!`,
      youtube: `Title: ${formData.topic} - Worth the Investment? 📽️\n\n[Intro - energetic music]\nHey riders! Today we're looking at ${formData.bikeDetails || 'this amazing bike'}.\n\n[Main content]\nFirst impressions, key features, and who should buy this.\n\n[Closing]\nLeave a comment below - what bike should we review next?\n\n🔔 Subscribe for more!`,
      email: `Subject: ${formData.topic}\n\nHi there! 👋\n\n${formData.bikeDetails || 'We just got in some amazing bikes that need a good home.'}\n\nHere's what's available:\n• Professionally serviced\n• Full safety check\n• Ready to ride\n\nBook a viewing today!\n\nBest,\nThe BikeClinique Team`,
      ad: `${formData.topic} 🚴\n\n${formData.bikeDetails || 'Premium bikes, professional service.'}\n\n✓ Expert Mechanics\n✓ Service Guarantee\n✓ Free Collection\n\nShop now →`,
      listing: `${formData.topic}\n\n${formData.bikeDetails || 'Premium bike for sale.'}\n\nCondition: Excellent\nService History: Full\nReady to Ride: Yes\n\n£${Math.floor(Math.random() * 2000) + 2000} ovno\n\nSerious enquiries only.`,
      tiktok: `[Trending sound]\nPOV: You finally get a ${formData.topic}\n\n${formData.bikeDetails || 'This thing is insane.'}\n\n#bike #cycling #fyp #viral`
    }
    
    const newContent: GeneratedContent = {
      id: Date.now().toString(),
      type: formData.contentType,
      content: templates[formData.contentType],
      platform: platformLabels[formData.contentType]
    }
    
    setGenerated([newContent, ...generated])
    setLoading(false)
  }

  const copyToClipboard = (content: string, id: string) => {
    navigator.clipboard.writeText(content)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E] flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#FF6B35]" />
            AI Content Generator
          </h1>
          <p className="text-sm text-gray-500">Generate marketing content for your bike shop</p>
        </div>
        <span className="px-3 py-1 bg-gradient-to-r from-[#FF6B35] to-[#FF3131] text-white text-xs font-bold rounded-full">
          PREMIUM
        </span>
      </div>

      {/* Quick Templates */}
      <div className="bg-gradient-to-r from-[#1A1A2E] to-[#2D2D4A] rounded-xl p-6 mb-6">
        <h2 className="text-white font-semibold mb-4">⚡ Quick Generate</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { type: 'instagram' as ContentType, label: '📸 Instagram', icon: <Instagram className="w-4 h-4" /> },
            { type: 'facebook' as ContentType, label: '📘 Facebook', icon: <Facebook className="w-4 h-4" /> },
            { type: 'tiktok' as ContentType, label: '🎬 TikTok', icon: <Video className="w-4 h-4" /> },
            { type: 'listing' as ContentType, label: '💰 Bike Listing', icon: <ShoppingCart className="w-4 h-4" /> },
          ].map((item) => (
            <button
              key={item.type}
              onClick={() => setFormData({ ...formData, contentType: item.type })}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                formData.contentType === item.type
                  ? 'bg-[#FF6B35] text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Generator Form */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-[#1A1A2E] mb-4">Create Content</h2>
          
          <div className="space-y-4">
            {/* Content Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {(Object.keys(platformLabels) as ContentType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, contentType: type })}
                    className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      formData.contentType === type
                        ? 'bg-[#FF6B35] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {platformIcons[type]}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What do you want to promote? *
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="e.g., New gravel bikes just in, Spring service special, Premium e-bikes"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
              />
            </div>

            {/* Bike Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bike/Service Details (optional)
              </label>
              <textarea
                value={formData.bikeDetails}
                onChange={(e) => setFormData({ ...formData, bikeDetails: e.target.value })}
                rows={3}
                placeholder="Specific details about the bike, service, or offer..."
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
              />
            </div>

            {/* Options */}
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeHashtags}
                  onChange={(e) => setFormData({ ...formData, includeHashtags: e.target.checked })}
                  className="w-4 h-4 text-[#FF6B35] rounded focus:ring-[#FF6B35]"
                />
                <span className="text-sm text-gray-600">Include hashtags</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeEmoji}
                  onChange={(e) => setFormData({ ...formData, includeEmoji: e.target.checked })}
                  className="w-4 h-4 text-[#FF6B35] rounded focus:ring-[#FF6B35]"
                />
                <span className="text-sm text-gray-600">Include emoji</span>
              </label>
            </div>

            {/* Tone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
              <div className="flex gap-2">
                {(['professional', 'friendly', 'exciting', 'educational'] as Tone[]).map((tone) => (
                  <button
                    key={tone}
                    type="button"
                    onClick={() => setFormData({ ...formData, tone })}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                      formData.tone === tone
                        ? 'bg-[#FF6B35] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !formData.topic.trim()}
              className="w-full py-4 bg-[#FF6B35] text-white font-bold rounded-lg hover:bg-[#e55a2b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Content
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generated Content */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-[#1A1A2E] mb-4">Generated Content</h2>
          
          {generated.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Your generated content will appear here</p>
              <p className="text-sm mt-1">Fill in the form and click generate!</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {generated.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      {platformIcons[item.type]}
                      <span className="font-medium text-[#1A1A2E] text-sm">{item.platform}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(item.content, item.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      {copied === item.id ? (
                        <>
                          <Check className="w-4 h-4 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap text-sm text-gray-600 font-sans">
                    {item.content}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
        <h3 className="font-semibold text-blue-800 mb-2">💡 Pro Tips</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Be specific with your topic for better results</li>
          <li>• Include bike details for more personalized content</li>
          <li>• Use the friendly tone for social media, professional for emails</li>
          <li>• Edit the generated content before posting!</li>
        </ul>
      </div>
    </div>
  )
}
