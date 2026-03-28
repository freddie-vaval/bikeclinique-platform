'use client'

import Link from 'next/link'

// AI Content Packages
const contentPackages = [
  {
    name: 'Starter',
    price: 49,
    period: '/month',
    description: 'Perfect for small shops starting with content',
    features: [
      '5 AI-generated pieces/month',
      'Social media posts',
      'Bike listings',
      'Email templates',
      'Basic hashtag suggestions',
    ],
    popular: false,
  },
  {
    name: 'Growth',
    price: 99,
    period: '/month',
    description: 'Most popular - scales with your business',
    features: [
      '10 AI-generated pieces/month',
      'All content types included',
      'Blog post outlines',
      'Video scripts (text)',
      'Priority generation',
      'Hashtag & trend research',
    ],
    popular: true,
  },
  {
    name: 'Premium',
    price: 199,
    period: '/month',
    description: 'Full automation with video & more',
    features: [
      '20 AI-generated pieces/month',
      'Everything in Growth',
      'AI avatar videos (2/month)',
      'Short-form video scripts',
      'Full blog posts',
      'Competitor research',
      'Content calendar',
      'Multi-platform posting',
    ],
    popular: false,
  },
]

const contentTypes = [
  { icon: '📸', name: 'Social Posts', desc: 'Instagram, Facebook, TikTok' },
  { icon: '🎬', name: 'Video Scripts', desc: 'Shorts, Reels, YouTube' },
  { icon: '🎭', name: 'AI Avatar Videos', desc: 'HeyGen avatar presenters' },
  { icon: '✍️', name: 'Blog Posts', desc: 'SEO-optimized articles' },
  { icon: '📧', name: 'Email Marketing', desc: 'Newsletters & sequences' },
  { icon: '💰', name: 'Bike Listings', desc: 'Compelling sales descriptions' },
  { icon: '📱', name: 'Ad Copy', desc: 'Facebook & Google ads' },
  { icon: '📅', name: 'Content Calendar', desc: 'Planned posting schedule' },
]

export default function AIContentPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Header */}
      <header className="border-b border-[#333333]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5.5 13.5a2 2 0 1 0 4 0 2 2 0 1 0-4 0"/>
              <path d="M14.5 17.5a2 2 0 1 0 4 0 2 2 0 1 0-4 0"/>
              <path d="M19 6.5a4.5 4.5 0 0 0-5.182-3.763"/>
              <path d="M9.5 10.5H2.5L5 19a6.5 6.5 0 0 0 12.905-3.5"/>
              <circle cx="18" cy="9.5" r="2"/>
              <path d="M17 11.5a2 2 0 1 0 2 2"/>
            </svg>
            <div>
              <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'Archivo Black, sans-serif' }}>BikeClinique</h1>
              <p className="text-xs text-[#737373]">Premium Used Bikes & Services</p>
            </div>
          </Link>
          <div className="flex gap-3">
            <Link href="/profile" className="px-4 py-2 text-[#A3A3A3] hover:text-white transition-colors">
              Our Profile
            </Link>
            <Link href="/book" className="btn-secondary">
              Book a Service
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6B35]/10 border border-[#FF6B35]/30 rounded-full text-[#FF6B35] text-sm font-medium mb-6">
            <span>🚀</span> AI-Powered Content for Bike Shops
          </div>
          
          <h2 className="text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Archivo Black, sans-serif' }}>
            Create 10x More Content
            <span className="text-[#FF6B35] block mt-2">In 1/10th The Time</span>
          </h2>
          
          <p className="text-xl text-[#A3A3A3] mb-8 max-w-2xl mx-auto">
            Our AI generates Instagram posts, TikTok scripts, blog articles, 
            bike listings, and even avatar videos. Save hours every week.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#pricing" className="btn-primary">
              View Pricing
            </Link>
            <Link href="/dashboard/content/generator" className="btn-secondary">
              Try Demo →
            </Link>
          </div>

          {/* What you can create */}
          <div className="mt-16">
            <h3 className="text-white font-semibold mb-8">What Our AI Creates</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {contentTypes.map((type, i) => (
                <div key={i} className="bg-[#1A1A1A] p-4 rounded-xl border border-[#333333] hover:border-[#FF6B35] transition-colors">
                  <div className="text-3xl mb-2">{type.icon}</div>
                  <h4 className="text-white font-medium text-sm">{type.name}</h4>
                  <p className="text-[#737373] text-xs mt-1">{type.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-[#1A1A1A]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12" style={{ fontFamily: 'Archivo Black, sans-serif' }}>
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Choose Content Type', desc: 'Pick from social posts, blogs, videos, listings, or more' },
              { step: '2', title: 'AI Generates', desc: 'Our AI creates optimized content in seconds using Perplexity for research' },
              { step: '3', title: 'Publish & Post', desc: 'Copy, edit, and publish anywhere. Even generate AI videos!' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-[#737373] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-4" style={{ fontFamily: 'Archivo Black, sans-serif' }}>
            Simple Pricing
          </h2>
          <p className="text-[#A3A3A3] text-center mb-12">
            Start free. Upgrade when you're ready. Cancel anytime.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {contentPackages.map((pkg, i) => (
              <div 
                key={i} 
                className={`relative bg-[#1A1A1A] rounded-2xl p-6 border ${
                  pkg.popular 
                    ? 'border-[#FF6B35] transform scale-105' 
                    : 'border-[#333333]'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#FF6B35] text-white text-xs font-bold rounded-full">
                    MOST POPULAR
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Archivo Black, sans-serif' }}>
                  {pkg.name}
                </h3>
                <p className="text-[#737373] text-sm mb-4">{pkg.description}</p>
                
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-white">£{pkg.price}</span>
                  <span className="text-[#737373]">{pkg.period}</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-white">
                      <span className="text-[#FF6B35]">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  pkg.popular 
                    ? 'bg-[#FF6B35] text-white hover:bg-[#e55a2b]' 
                    : 'border border-[#333333] text-white hover:border-[#FF6B35]'
                }`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Video Section */}
      <section className="py-16 px-4 bg-[#1A1A1A]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-6">🎬</div>
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Archivo Black, sans-serif' }}>
            AI Avatar Videos
          </h2>
          <p className="text-[#A3A3A3] mb-8 max-w-2xl mx-auto">
            Premium package includes AI avatar videos using HeyGen technology. 
            Upload your own avatar and create professional videos in minutes - 
            no filming needed!
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="px-4 py-2 bg-[#333333] rounded-full text-white">✓ Your face, your voice</span>
            <span className="px-4 py-2 bg-[#333333] rounded-full text-white">✓ Professional quality</span>
            <span className="px-4 py-2 bg-[#333333] rounded-full text-white">✓ In minutes, not hours</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Archivo Black, sans-serif' }}>
            Ready to 10x Your Content?
          </h2>
          <p className="text-[#A3A3A3] mb-8">
            Join bike shops already using AI to grow their audience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard/content/generator" className="btn-primary">
              Try Free Demo
            </Link>
            <a href="mailto:info@bikeclinique.com" className="btn-secondary">
              Talk to Sales
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[#333333]">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[#737373]">
            BikeClinique 🏴󠁧󠁢󠁥󠁮󠁧󠁿 | AI-Powered Bike Shop Marketing
          </p>
          <p className="text-[#525252] text-sm mt-2">
            <Link href="/book" className="hover:text-white">Book a Service</Link> | 
            <Link href="/profile" className="hover:text-white ml-2">Our Profile</Link> | 
            <Link href="/sell" className="hover:text-white ml-2">Sell Your Bike</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
