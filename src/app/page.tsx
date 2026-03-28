'use client'

import Link from 'next/link'

// SVG Icons (Lucide style)
const Icons = {
  Calendar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
  ),
  Wrench: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
  ),
  Chart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
  ),
  Package: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m16.5 9.4-9-5.19"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96 12 12.01l8.73-5.05"/><path d="M12 22.08V12"/></svg>
  ),
  Truck: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
  ),
  MessageCircle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
  ),
  ArrowRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
  ),
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Header */}
      <header className="border-b border-[#333333]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Bike Icon SVG */}
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
              <p className="text-xs text-[#737373]">Workshop Management</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/ai-content" className="px-4 py-2 text-[#A3A3A3] hover:text-white transition-colors">
              AI Content
            </Link>
            <Link href="/sell" className="px-4 py-2 text-[#A3A3A3] hover:text-white transition-colors">
              Sell Your Bike
            </Link>
            <Link href="/profile" className="px-4 py-2 text-[#A3A3A3] hover:text-white transition-colors">
              View Profile
            </Link>
            <Link href="/login" className="btn-primary">
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'Archivo Black, sans-serif', lineHeight: 1.1 }}>
            Workshop Management<br />
            <span className="text-gradient">Made Bold</span>
          </h2>
          <p className="text-xl text-[#A3A3A3] max-w-2xl mx-auto mb-8" style={{ lineHeight: 1.6 }}>
            The no-nonsense platform for bike shops. Manage jobs, customers, bookings, 
            and inventory — without the fluff.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/book" className="btn-primary inline-flex items-center gap-2">
              Book a Service
              <Icons.ArrowRight />
            </Link>
            <Link href="/sell" className="btn-secondary inline-flex items-center gap-2">
              Sell Your Bike
            </Link>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-10" style={{ fontFamily: 'Archivo Black, sans-serif' }}>How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Customers Book Online', desc: 'They visit your custom booking page, select a service, and pick a convenient time.' },
              { step: '02', title: 'You Get Notified', desc: 'Instant alerts via WhatsApp, SMS, or email. The job appears in your dashboard instantly.' },
              { step: '03', title: 'Complete & Collect', desc: 'Track the job status, manage parts, and optionally offer pickup/delivery to customers.' },
            ].map((item, i) => (
              <div key={i} className="card border-accent">
                <div className="text-4xl font-bold text-[#FF6B35] mb-4" style={{ fontFamily: 'Archivo Black, sans-serif' }}>
                  {item.step}
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
                <p className="text-[#A3A3A3] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {[
            { Icon: Icons.Calendar, title: 'Online Booking', desc: 'Customers book 24/7. You get notified instantly.' },
            { Icon: Icons.Wrench, title: 'Job Management', desc: 'Track every bike through the workshop with ease.' },
            { Icon: Icons.Chart, title: 'Reports', desc: 'Know your revenue, popular services, and more.' },
            { Icon: Icons.Package, title: 'Inventory', desc: 'Never run out of parts with smart stock alerts.' },
            { Icon: Icons.Truck, title: 'Collections', desc: 'Schedule pickups and deliveries seamlessly.' },
            { Icon: Icons.MessageCircle, title: 'Messages', desc: 'WhatsApp, SMS, email — all in one inbox.' },
          ].map((feature, i) => (
            <div key={i} className="card group">
              <div className="text-[#FF6B35] mb-4 group-hover:text-white transition-colors">
                <feature.Icon />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-[#A3A3A3] text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-10" style={{ fontFamily: 'Archivo Black, sans-serif' }}>Trusted by Bike Shops</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { quote: "We doubled our booking volume after switching to BikeClinique. The online booking just works.", author: "Matt R.", shop: "Urban Cycles, Bristol" },
              { quote: "Finally, a system that actually understands how bike shops work. My team adopted it in days.", author: "Sarah L.", shop: "Peak Mountain Bikes" },
            ].map((testimonial, i) => (
              <div key={i} className="card">
                <p className="text-[#A3A3A3] text-lg mb-4" style={{ lineHeight: 1.6 }}>"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.author[0]}
                  </div>
                  <div>
                    <p className="text-white font-medium">{testimonial.author}</p>
                    <p className="text-[#737373] text-sm">{testimonial.shop}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { number: '2,500+', label: 'Jobs Booked' },
            { number: '150+', label: 'Bike Shops' },
            { number: '98%', label: 'Happy Customers' },
            { number: '24/7', label: 'Online Booking' },
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 border border-[#333333] rounded-lg">
              <p className="text-3xl md:text-4xl font-bold text-[#FF6B35] mb-1 font-mono" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{stat.number}</p>
              <p className="text-[#737373] text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Used Bike Section */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-4" style={{ fontFamily: 'Archivo Black, sans-serif' }}>We Buy Premium Used Bikes</h3>
          <p className="text-[#A3A3A3] text-center max-w-2xl mx-auto mb-8">
            Got a high-end gravel bike or eBike gathering dust? We buy quality used bikes valued at £2,000+ new.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/sell" className="btn-primary inline-flex items-center gap-2">
              Sell Your Bike
              <Icons.ArrowRight />
            </Link>
            <Link href="/profile" className="btn-secondary inline-flex items-center gap-2">
              Learn More
            </Link>
          </div>
        </div>

        {/* AI Content Section */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-4" style={{ fontFamily: 'Archivo Black, sans-serif' }}>🚀 AI Content Generator</h3>
          <p className="text-[#A3A3A3] text-center max-w-2xl mx-auto mb-8">
            Generate posts, blogs, videos, and bike listings in seconds. Our AI creates content for Instagram, TikTok, Facebook, and more.
          </p>
          <div className="flex justify-center gap-4 flex-wrap mb-8">
            <Link href="/ai-content" className="btn-primary inline-flex items-center gap-2">
              View Pricing
              <Icons.ArrowRight />
            </Link>
            <Link href="/dashboard/content/generator" className="btn-secondary inline-flex items-center gap-2">
              Try Demo
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#FF6B35] rounded-xl p-12 text-center relative overflow-hidden">
          {/* Diagonal pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              #000 10px,
              #000 11px
            )`
          }} />
          <div className="relative">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Archivo Black, sans-serif' }}>Ready to modernize your workshop?</h3>
            <p className="text-white/80 mb-6">Join bike shops already using BikeClinique</p>
            <Link href="/login" className="inline-block px-8 py-3 bg-white text-[#FF6B35] rounded font-medium hover:bg-gray-100 transition-colors" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Get Started Free
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#333333] py-8 mt-20">
        <div className="max-w-6xl mx-auto px-4 text-center text-[#737373] text-sm">
          <p>© 2026 BikeClinique. Workshop Management Platform.</p>
        </div>
      </footer>
    </div>
  )
}
