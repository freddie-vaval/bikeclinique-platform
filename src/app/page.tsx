'use client';

import { useState } from 'react';
import Link from 'next/link';

const HERO_IMAGE = '/hero-bike-workshop.webp';

const SERVICES = [
  { icon: '🔧', name: 'Full Service', desc: 'Complete drivetrain, brakes, gears & frame check', price: 'From £80' },
  { icon: '⚡', name: 'Gear Adjustment', desc: 'Precision indexing for smooth shifting', price: 'From £25' },
  { icon: '🛑', name: 'Brake Service', desc: 'Pads, cables & rotor alignment', price: 'From £30' },
  { icon: '⛓️', name: 'Chain Replacement', desc: 'Quality chain with tension check', price: 'From £35' },
  { icon: '💨', name: 'Puncture Repair', desc: 'Quick inner tube replacement', price: 'From £15' },
  { icon: '🔍', name: 'Safety Inspection', desc: '30-point check before your ride', price: '£20' },
];

const STEPS = [
  { num: '01', title: 'Book in 60 seconds', desc: 'Pick your service and a time that suits you. No phone calls, no waiting.' },
  { num: '02', title: 'We collect your bike', desc: 'Our courier picks your bike up from your door. Or drop it off — your choice.' },
  { num: '03', title: 'Expert mechanics fix it', desc: 'Qualified mechanics service your bike. You get updates at every step.' },
  { num: '04', title: 'Delivered back to you', desc: 'Your bike comes back fixed and clean. Pay when you\'re happy.' },
];

const TRUST = [
  { value: '500+', label: 'Bikes Serviced' },
  { value: '4.9★', label: 'Google Rating' },
  { value: '24hr', label: 'Typical Turnaround' },
  { value: '100%', label: 'No-fix-no-fee' },
];

const FAQS = [
  {
    q: 'How does collection and delivery work?',
    a: 'We pick your bike up from your address at the time you book. Our mechanics fix it, then deliver it back — usually the same day or next. Fully insured, tracked, and handled with care.',
  },
  {
    q: 'What if you find something else wrong?',
    a: 'We\'ll always call you before doing any extra work. You approve everything — no surprise charges. If it can\'t be fixed, you don\'t pay.',
  },
  {
    q: 'How long does a service take?',
    a: 'Most services are done within 24 hours. A full service takes 1-2 days. We\'ll give you an exact ETA when you book.',
  },
  {
    q: 'Is my bike insured while with you?',
    a: 'Yes. Every bike in our care is fully insured up to £5,000. We take responsibility from the moment we pick it up.',
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔧</span>
              <span className="font-bold text-lg tracking-tight">Bike<span className="text-orange-500">Clinique</span></span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
              <a href="#services" className="hover:text-white transition-colors">Services</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/sign-up" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors border border-white/10">
                For Shops
              </Link>
              <Link href="/portal" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors">
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_IMAGE}
            alt="Bike workshop"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/60 via-[#0A0A0A]/40 to-[#0A0A0A]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
              Serving South London
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
              Your bike,<br />
              <span className="text-orange-500">sorted.</span>
            </h1>

            <p className="text-xl text-gray-300 mb-4 max-w-xl leading-relaxed">
              Expert mechanics who come to you. Book online in 60 seconds — 
              we collect your bike, fix it, and bring it back. No garage visit.
            </p>

            <p className="text-sm text-gray-500 mb-8">
              Used by 500+ cyclists across London. Rated 4.9★ on Google.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/portal"
                className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-orange-500/20 text-center"
              >
                Book a Service →
              </Link>
              <a
                href="#how-it-works"
                className="px-8 py-4 border border-white/20 hover:border-white/40 text-white font-medium text-lg rounded-xl transition-colors text-center"
              >
                See How It Works
              </a>
            </div>

            {/* Trust bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl">
              {TRUST.map(t => (
                <div key={t.label}>
                  <div className="text-2xl font-bold text-white">{t.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{t.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="w-6 h-10 border border-white/20 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/40 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-orange-500 text-sm font-medium uppercase tracking-widest mb-3">What We Offer</p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Every fix.<br />Done properly.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map(s => (
              <div
                key={s.name}
                className="group bg-[#111111] border border-white/5 hover:border-orange-500/30 rounded-2xl p-6 transition-all hover:bg-[#141414]"
              >
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="font-semibold text-white text-lg mb-1">{s.name}</h3>
                <p className="text-gray-500 text-sm mb-3">{s.desc}</p>
                <p className="text-orange-400 font-medium text-sm">{s.price}</p>
              </div>
            ))}

            {/* Custom builds */}
            <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-2xl p-6">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="font-semibold text-white text-lg mb-1">Custom Builds</h3>
              <p className="text-gray-400 text-sm mb-3">From frame selection to full builds. We engineer bikes for how you actually ride.</p>
              <p className="text-orange-400 font-medium text-sm">From £1,200</p>
            </div>

            {/* AI diagnostic */}
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl p-6">
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="font-semibold text-white text-lg mb-1">AI Bike Diagnosis</h3>
              <p className="text-gray-400 text-sm mb-3">Not sure what's wrong? Send us a photo. We'll tell you what's broken and how much it'll cost — free, instantly.</p>
              <p className="text-purple-400 font-medium text-sm">Free</p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/portal"
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-xl transition-colors"
            >
              Book Your Service →
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-orange-500 text-sm font-medium uppercase tracking-widest mb-3">Dead Simple</p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Book in 60 seconds.<br />We'll handle the rest.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map(step => (
              <div key={step.num} className="relative">
                <div className="text-7xl font-bold text-orange-500/10 absolute -top-2 -left-1 leading-none">
                  {step.num}
                </div>
                <div className="relative pt-14">
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why BikeClinique */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-orange-500 text-sm font-medium uppercase tracking-widest mb-3">Why Us</p>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                The old way<br />was a faff.
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Drag your bike to a shop. Wait around. Hope they answer the phone. 
                Get a call three days later with a quote you didn't ask for.
                <br /><br />
                We built BikeClinique to fix that. You book online. We come to you. 
                Simple.
              </p>

              <div className="space-y-4">
                {[
                  { icon: '🚚', title: 'Collection & delivery included', desc: 'We pick up and return your bike. No car rack needed.' },
                  { icon: '📱', title: 'Real-time updates', desc: 'Know exactly where your bike is, every step of the way.' },
                  { icon: '💰', title: 'No surprise costs', desc: 'You see the full price before you book. Nothing added on.' },
                  { icon: '🤖', title: 'AI diagnosis free', desc: 'Send a photo of any issue. Get an instant quote before you commit.' },
                ].map(item => (
                  <div key={item.title} className="flex gap-4">
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <h4 className="font-semibold text-white">{item.title}</h4>
                      <p className="text-gray-500 text-sm mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification mockup */}
            <div className="relative">
              <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 shadow-2xl shadow-orange-500/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-lg">🔧</div>
                  <div>
                    <p className="font-semibold text-white text-sm">BikeClinique</p>
                    <p className="text-xs text-gray-500">Your bike is on its way back!</p>
                  </div>
                </div>
                <div className="bg-[#1A1A1A] rounded-xl p-4 space-y-2">
                  <p className="text-sm text-gray-300">✅ Full Service complete</p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>• Chain replaced ✓</p>
                    <p>• Brake pads replaced ✓</p>
                    <p>• Gears adjusted ✓</p>
                  </div>
                  <div className="pt-2 border-t border-white/5 mt-3">
                    <p className="text-xs text-gray-400 mb-2">Total: <span className="text-white font-medium">£120.00</span></p>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 bg-orange-500 text-white text-xs font-bold rounded-lg">Pay Now</button>
                      <button className="flex-1 py-2 bg-white/5 text-white text-xs font-medium rounded-lg">Details</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 px-3 py-1.5 bg-[#111111] border border-white/10 rounded-lg text-xs font-medium text-white shadow-lg">
                📍 Live tracking
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-orange-500 text-sm font-medium uppercase tracking-widest mb-3">Reviews</p>
            <h2 className="text-4xl font-bold">What riders say.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'James T.',
                location: 'Clapham',
                text: '"Booked at 9pm, collected at 8am the next day. Absolute no-brainer. Will never go back to dropping my bike at a shop."',
              },
              {
                name: 'Sarah M.',
                location: 'Brixton',
                text: '"The WhatsApp updates were incredible. Could see exactly what they\'d done and when. Proper professional operation."',
              },
              {
                name: 'Alex R.',
                location: 'Wandsworth',
                text: '"Sent a photo of my slipping gears, got a diagnosis and quote in 10 minutes. Fixed same day. Unreal."',
              },
            ].map(review => (
              <div key={review.name} className="bg-[#111111] border border-white/5 rounded-2xl p-6">
                <div className="text-orange-400 text-sm mb-3">★★★★★</div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">{review.text}</p>
                <div>
                  <p className="font-semibold text-white text-sm">{review.name}</p>
                  <p className="text-gray-500 text-xs">{review.location}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 mt-8 text-sm text-gray-500">
            <span className="text-orange-400">★★★★★</span>
            <span className="font-medium text-white">4.9</span>
            <span>on Google · 127 reviews</span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-orange-500 text-sm font-medium uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-4xl font-bold">Got questions?</h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-[#111111] border border-white/5 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-medium text-white">{faq.q}</span>
                  <span className={`text-orange-400 text-lg transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-gray-400 text-sm leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Bike Shops */}
      <section className="py-24 bg-gradient-to-b from-[#0A0A0A] to-[#0D0D0D] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-medium mb-5">
                <span>🏪</span> For Bike Shops
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                Run your shop<br />
                <span className="text-orange-500">without the chaos.</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                BikeClinique for Shops is the all-in-one platform for independent bike repair shops. 
                Job management, AI phone receptionist, automated customer updates, Stripe payments, 
                and delivery scheduling — everything in one place.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  { icon: '🤖', title: 'AI Phone Receptionist', desc: 'Never miss a booking call again' },
                  { icon: '📱', title: 'Auto Customer Updates', desc: 'SMS & WhatsApp at every step' },
                  { icon: '💳', title: 'Instant Stripe Payments', desc: 'Get paid before they collect' },
                  { icon: '📅', title: 'Delivery Scheduling', desc: 'Customers book their own slot' },
                  { icon: '📊', title: 'Job Dashboard', desc: 'Kanban board for every bike in the shop' },
                  { icon: '🔗', title: 'Works with BikeBook', desc: 'Import existing data in one click' },
                ].map(f => (
                  <div key={f.title} className="flex gap-3">
                    <span className="text-xl flex-shrink-0">{f.icon}</span>
                    <div>
                      <p className="font-medium text-white text-sm">{f.title}</p>
                      <p className="text-gray-500 text-xs">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/sign-up"
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-center"
                >
                  Start Free Trial →
                </Link>
                <Link
                  href="/dashboard"
                  className="px-6 py-3 border border-white/10 hover:border-white/20 text-white font-medium rounded-xl transition-colors text-center"
                >
                  See Live Demo
                </Link>
              </div>
            </div>

            {/* Dashboard mockup */}
            <div className="relative">
              <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#1A1A1A]">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <span className="text-xs text-gray-500 ml-2">bikeclinique.app/dashboard</span>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {['Booked In', 'In Work', 'Ready', 'Done'].map((col, i) => (
                      <div key={col} className="bg-[#1A1A1A] rounded-lg p-2">
                        <p className="text-xs text-gray-500 mb-1">{col}</p>
                        <div className="space-y-1">
                          {[1, 2, i === 2 ? 1 : 0].map(j => (
                            <div key={j} className="h-6 bg-[#262626] rounded border border-white/5" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-[#1A1A1A] rounded-lg p-2 text-center">
                      <p className="text-lg font-bold text-white">12</p>
                      <p className="text-xs text-gray-500">Jobs</p>
                    </div>
                    <div className="bg-[#1A1A1A] rounded-lg p-2 text-center">
                      <p className="text-lg font-bold text-orange-400">£847</p>
                      <p className="text-xs text-gray-500">Today</p>
                    </div>
                    <div className="bg-[#1A1A1A] rounded-lg p-2 text-center">
                      <p className="text-lg font-bold text-green-400">3</p>
                      <p className="text-xs text-gray-500">Ready</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-3 -right-3 px-3 py-1.5 bg-orange-500 rounded-lg text-xs font-bold text-white shadow-lg">
                14-day free trial
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-purple-600/10" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Your next ride<br />starts here.
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Book your bike service in 60 seconds. Collection available across South London.
          </p>
          <Link
            href="/portal"
            className="inline-block px-10 py-5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xl rounded-xl transition-all hover:scale-[1.02] shadow-2xl shadow-orange-500/20"
          >
            Book Your Service →
          </Link>
          <p className="text-gray-600 text-sm mt-4">No account needed · Pay after · Free cancellation</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔧</span>
            <span className="font-bold text-sm">Bike<span className="text-orange-500">Clinique</span></span>
          </div>
          <p className="text-gray-600 text-xs">© 2026 BikeClinique LTD. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <Link href="/login" className="hover:text-white transition-colors">Staff Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
