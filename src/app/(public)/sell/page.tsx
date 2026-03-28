'use client'

import Link from 'next/link'

export default function SellBikePage() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    
    try {
      const response = await fetch('https://formspree.io/f/xaqpjnnd', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      
      if (response.ok) {
        alert('Thanks! We\'ll be in touch within 24 hours!')
        form.reset()
      } else {
        alert('Something went wrong. Please try again or email us directly.')
      }
    } catch (error) {
      alert('Error submitting form. Please email info@bikeclinique.com')
    }
  }

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
              <p className="text-xs text-[#737373]">Premium Used Bikes</p>
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
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Archivo Black, sans-serif' }}>
            Sell Your Premium Bike
          </h2>
          <p className="text-xl text-[#A3A3A3] mb-8">
            Got a high-end gravel bike or eBike? We buy quality used bikes £2,000+
          </p>
          
          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#333333]">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="text-white font-semibold mb-2">Fair Prices</h3>
              <p className="text-[#737373] text-sm">We offer competitive valuations based on condition and market value</p>
            </div>
            <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#333333]">
              <div className="text-3xl mb-3">🚛</div>
              <h3 className="text-white font-semibold mb-2">Free Collection</h3>
              <p className="text-[#737373] text-sm">We collect from anywhere in London - no hassle for you</p>
            </div>
            <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#333333]">
              <div className="text-3xl mb-3">🔧</div>
              <h3 className="text-white font-semibold mb-2">Service Guarantee</h3>
              <p className="text-[#737373] text-sm">Every bike gets professionally serviced before resale</p>
            </div>
          </div>

          {/* What we buy */}
          <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#333333] mb-12">
            <h3 className="text-white font-semibold mb-4">What We Buy</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {['Gravel Bikes', 'eBikes', 'Road Bikes', 'Mountain Bikes', 'Folding Bikes'].map((item) => (
                <span key={item} className="px-4 py-2 bg-[#FF6B35] text-white rounded-full text-sm font-medium">
                  {item}
                </span>
              ))}
            </div>
            <p className="text-[#737373] mt-4 text-sm">
              Brands: Specialized, Canyon, Trek, Giant, Brompton, and other premium brands
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 px-4 bg-[#1A1A1A]">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#0D0D0D] p-8 rounded-xl border border-[#333333]">
            <h3 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Archivo Black, sans-serif' }}>
              Get a Quote
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Your Name *</label>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#FF6B35]"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Email *</label>
                  <input 
                    type="email" 
                    name="email" 
                    required 
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#FF6B35]"
                    placeholder="john@email.com"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-white text-sm font-medium mb-2">Phone Number *</label>
                <input 
                  type="tel" 
                  name="phone" 
                  required 
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#FF6B35]"
                  placeholder="07700 900000"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Bike Brand *</label>
                  <input 
                    type="text" 
                    name="brand" 
                    required 
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#FF6B35]"
                    placeholder="e.g. Specialized, Canyon"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Bike Model *</label>
                  <input 
                    type="text" 
                    name="model" 
                    required 
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#FF6B35]"
                    placeholder="e.g. Diverge, Grail"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Year Purchased</label>
                  <select 
                    name="year" 
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#FF6B35]"
                  >
                    <option value="">Select year</option>
                    {[2026,2025,2024,2023,2022,2021,2020].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Original Price (RRP) *</label>
                  <input 
                    type="text" 
                    name="rrp" 
                    required 
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#FF6B35]"
                    placeholder="e.g. £3,500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Condition *</label>
                  <select 
                    name="condition" 
                    required 
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#FF6B35]"
                  >
                    <option value="">Select condition</option>
                    <option value="10/10">10/10 - Like new</option>
                    <option value="9/10">9/10 - Excellent</option>
                    <option value="8/10">8/10 - Very Good</option>
                    <option value="7/10">7/10 - Good</option>
                    <option value="6/10">6/10 - Fair</option>
                    <option value="5/10 or below">5/10 or below</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Any Crashes/Damage?</label>
                  <select 
                    name="damage" 
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#FF6B35]"
                  >
                    <option value="No">No</option>
                    <option value="Yes - Minor">Yes - Minor</option>
                    <option value="Yes - Major">Yes - Major</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-white text-sm font-medium mb-2">Your Location (Postcode) *</label>
                <input 
                  type="text" 
                  name="location" 
                  required 
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#FF6B35]"
                  placeholder="e.g. SW12 8BG"
                />
              </div>

              <div className="mb-6">
                <label className="block text-white text-sm font-medium mb-2">Your Asking Price</label>
                <input 
                  type="text" 
                  name="asking_price" 
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#FF6B35]"
                  placeholder="e.g. £2,000"
                />
              </div>

              <div className="mb-6">
                <label className="block text-white text-sm font-medium mb-2">Part Exchange?</label>
                <select 
                  name="part_exchange" 
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#FF6B35]"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes - interested in trading up</option>
                  <option value="No">No - just selling</option>
                  <option value="Maybe">Maybe - tell me more</option>
                </select>
              </div>

              <div className="mb-8">
                <label className="block text-white text-sm font-medium mb-2">Any Questions?</label>
                <textarea 
                  name="questions" 
                  rows={3}
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#FF6B35]"
                  placeholder="Any additional info about your bike..."
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-4 bg-[#FF6B35] text-white font-bold rounded-lg hover:bg-[#e55a2b] transition-colors"
                style={{ fontFamily: 'Archivo Black, sans-serif' }}
              >
                Get My Quote
              </button>

              <p className="text-center text-[#737373] text-sm mt-4">
                We&apos;ll get back to you within 24 hours!
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[#333333]">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[#737373]">
            BikeClinique 🏴󠁧󠁢󠁥󠁮󠁧󠁿 | London&apos;s Premium Bike Workshop & Used Bike Specialist
          </p>
          <p className="text-[#525252] text-sm mt-2">
            <Link href="/book" className="hover:text-white">Book a Service</Link> | 
            <Link href="/profile" className="hover:text-white ml-2">Our Profile</Link> | 
            <a href="mailto:info@bikeclinique.com" className="hover:text-white ml-2">Contact</a>
          </p>
        </div>
      </footer>
    </div>
  )
}
