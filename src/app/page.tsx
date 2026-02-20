'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A2E] to-[#2D2D4A]">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🚴</span>
            <div>
              <h1 className="text-xl font-bold text-white">BikeClinique</h1>
              <p className="text-xs text-gray-400">Workshop Management</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/profile" className="px-4 py-2 text-gray-300 hover:text-white">
              View Profile
            </Link>
            <Link href="/login" className="px-4 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#e55a2b]">
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">
            Workshop Management<br />
            <span className="text-[#FF6B35]">Made Simple</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            The all-in-one platform for bike shops. Manage jobs, customers, bookings, 
            and inventory — all connected to your shop.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/book" className="px-8 py-4 bg-[#FF6B35] text-white rounded-lg font-medium hover:bg-[#e55a2b] transition-colors">
              Book a Service
            </Link>
            <Link href="/login" className="px-8 py-4 border border-white/20 text-white rounded-lg font-medium hover:bg-white/10 transition-colors">
              Shop Login
            </Link>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-white text-center mb-10">How It Works</h3>
          <div className="grid grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Customers Book Online', desc: 'They visit your custom booking page, select a service, and pick a convenient time.' },
              { step: '2', title: 'You Get Notified', desc: 'Instant alerts via WhatsApp, SMS, or email. The job appears in your dashboard instantly.' },
              { step: '3', title: 'Complete & Collect', desc: 'Track the job status, manage parts, and optionally offer pickup/delivery to customers.' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {item.step}
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-3 gap-6 mb-16">
          {[
            { icon: '📅', title: 'Online Booking', desc: 'Customers book 24/7. You get notified instantly.' },
            { icon: '🔧', title: 'Job Management', desc: 'Track every bike through the workshop with ease.' },
            { icon: '📊', title: 'Reports', desc: 'Know your revenue, popular services, and more.' },
            { icon: '📦', title: 'Inventory', desc: 'Never run out of parts with smart stock alerts.' },
            { icon: '🚚', title: 'Collections', desc: 'Schedule pickups and deliveries seamlessly.' },
            { icon: '💬', title: 'Messages', desc: 'WhatsApp, SMS, email — all in one inbox.' },
          ].map((feature, i) => (
            <div key={i} className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10 hover:border-white/20 transition-colors">
              <span className="text-3xl mb-4 block">{feature.icon}</span>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white text-center mb-10">Trusted by Bike Shops</h3>
          <div className="grid grid-cols-2 gap-6">
            {[
              { quote: "We doubled our booking volume after switching to BikeClinique. The online booking just works.", author: "Matt R.", shop: "Urban Cycles, Bristol" },
              { quote: "Finally, a system that actually understands how bike shops work. My team adopted it in days.", author: "Sarah L.", shop: "Peak Mountain Bikes" },
            ].map((testimonial, i) => (
              <div key={i} className="bg-white/5 backdrop-blur rounded-xl p-8 border border-white/10">
                <p className="text-gray-300 text-lg mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.author[0]}
                  </div>
                  <div>
                    <p className="text-white font-medium">{testimonial.author}</p>
                    <p className="text-gray-500 text-sm">{testimonial.shop}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-16">
          {[
            { number: '2,500+', label: 'Jobs Booked' },
            { number: '150+', label: 'Bike Shops' },
            { number: '98%', label: 'Happy Customers' },
            { number: '24/7', label: 'Online Booking' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-bold text-[#FF6B35] mb-1">{stat.number}</p>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-[#FF6B35] rounded-2xl p-12 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to modernize your workshop?</h3>
          <p className="text-white/80 mb-6">Join bike shops already using BikeClinique</p>
          <Link href="/login" className="inline-block px-8 py-3 bg-white text-[#FF6B35] rounded-lg font-medium hover:bg-gray-100">
            Get Started Free
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 mt-20">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2026 BikeClinique. Workshop Management Platform.</p>
        </div>
      </footer>
    </div>
  )
}
