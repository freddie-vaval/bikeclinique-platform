'use client';

import { useState } from 'react';
import Link from 'next/link';

const HERO_IMAGE = '/hero-bike-workshop.webp';

const FEATURES = [
  {
    icon: '🤖',
    title: 'AI Phone Receptionist',
    desc: 'Every missed call is a lost job. Our AI answers, books jobs, and qualifies leads — 24/7. Your clone voice on the phone.',
  },
  {
    icon: '📱',
    title: 'Automated Customer Updates',
    desc: 'SMS and WhatsApp updates at every stage. Bike arrived → Mechanic started → Ready for collection. Zero "where\'s my bike?" calls.',
  },
  {
    icon: '💳',
    title: 'Instant Stripe Payments',
    desc: 'Send a payment link the moment the job\'s done. Customer pays before they collect. No chasing invoices.',
  },
  {
    icon: '📅',
    title: 'Delivery Slot Booking',
    desc: 'Your customers pick their own delivery or collection slot from slots YOU set. No back-and-forth scheduling calls.',
  },
  {
    icon: '📊',
    title: 'Job Kanban Dashboard',
    desc: 'See every bike in your shop at a glance. Drag, drop, update status. Works on your phone while you\'re under the bench.',
  },
  {
    icon: '🤖',
    title: 'AI Bike Diagnosis',
    desc: 'Customers WhatsApp a photo. AI tells them what\'s wrong and quotes a price. Books itself. Pure lead capture.',
  },
  {
    icon: '📋',
    title: 'AI Job Summaries',
    desc: 'Mechanic finishes a job. AI writes the customer-facing summary. Copy-paste into the invoice. Professional every time.',
  },
  {
    icon: '🔗',
    title: 'BikeBook Compatible',
    desc: 'Already using BikeBook? Import all your customers, jobs, and history in one click. Zero friction to switch.',
  },
];

const PROBLEMS = [
  { before: 'Missing calls', after: 'AI answers every call and books jobs automatically' },
  { before: 'Chasing payments', after: 'Customer pays via Stripe before they collect' },
  { before: 'Customers asking "where\'s my bike?"', after: 'Automated WhatsApp updates at every stage' },
  { before: 'Scheduling collection slots', after: 'Customer books their own slot from your calendar' },
  { before: 'Admin eating your time', after: 'AI writes invoices and job summaries' },
];

const TESTIMONIALS = [
  {
    name: 'Mechanic, 12 years',
    shop: 'Independent shop, South London',
    text: '"I was using a spreadsheet and WhatsApp. Now everything is in one place. I actually leave work on time."',
  },
  {
    name: 'Shop owner, 2 locations',
    shop: 'Chain across South East',
    text: '"The AI phone assistant alone has paid for itself three times over. We don\'t miss calls anymore."',
  },
  {
    name: 'Solo mechanic',
    shop: 'Mobile service, zone 2-4',
    text: '"I was doing all my admin at 10pm. Now it just sorts itself while I\'m with the bike."',
  },
];

const PRICING_PLANS = [
  {
    name: 'Starter',
    price: '£99',
    desc: 'For solo mechanics and small repair shops.',
    features: ['1 user', 'Unlimited jobs', 'AI phone assistant', 'SMS & WhatsApp updates', 'Stripe payments', 'Delivery scheduling', 'AI diagnosis assistant', 'AI job summaries'],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Pro',
    price: '£199',
    desc: 'For growing shops with a team.',
    features: ['Up to 3 users', 'Everything in Starter', 'Team management', 'Advanced reporting', 'Customer analytics', 'Priority support', 'Custom branding'],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Business',
    price: '£499',
    desc: 'For multi-location or high-volume shops.',
    features: ['Unlimited users', 'Everything in Pro', 'Multi-location', 'White-label app', 'API access', 'Dedicated account manager', 'Custom integrations'],
    cta: 'Contact Sales',
    popular: false,
  },
];

const FAQS = [
  {
    q: 'Do I have to switch from BikeBook?',
    a: 'No. BikeClinique works alongside your existing tools. We also offer a one-click import if you want to migrate. Most shops switch fully within a day.',
  },
  {
    q: 'Does the AI phone sound like me?',
    a: 'Yes. We use voice cloning — you record 30 seconds and the AI sounds like you. Customers can\'t tell the difference.',
  },
  {
    q: 'What if a customer has a complaint?',
    a: 'The AI transfers to you for edge cases. You\'re always in control. All communications are logged in the job record.',
  },
  {
    q: 'How long does it take to set up?',
    a: 'Most shops are live within 30 minutes. Import your customers, set your services, configure your delivery slots. Done.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes — 14 days, no credit card required. Your shop data is seeded automatically so you can see how it works with real jobs.',
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
              <span className="font-bold text-lg tracking-tight text-white">Bike<span className="text-orange-500">Clinique</span></span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/portal" className="text-sm text-gray-400 hover:text-white transition-colors">
                Customer Booking
              </Link>
              <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/sign-up" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors">
                Start Free Trial
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
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/60 via-[#0A0A0A]/50 to-[#0A0A0A]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
              For Bike Shop Owners
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
              Run your shop<br />
              <span className="text-orange-500">without the chaos.</span>
            </h1>

            <p className="text-xl text-gray-300 mb-4 max-w-xl leading-relaxed">
              The all-in-one platform for bike repair shops. AI phone receptionist, automated updates, 
              Stripe payments, and delivery scheduling — built for shops like yours.
            </p>

            <p className="text-sm text-gray-500 mb-10">
              Used by independent shops across the UK. No more missed calls. No more admin at 10pm.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/sign-up"
                className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-orange-500/20 text-center"
              >
                Start Free Trial →
              </Link>
              <a
                href="#features"
                className="px-8 py-4 border border-white/20 hover:border-white/40 text-white font-medium text-lg rounded-xl transition-colors text-center"
              >
                See Features
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl">
              {[
                { v: '14-day', l: 'Free Trial' },
                { v: '30 min', l: 'Setup Time' },
                { v: 'Zero', l: 'Migration Friction' },
                { v: '24/7', l: 'AI Receptionist' },
              ].map(t => (
                <div key={t.l}>
                  <div className="text-2xl font-bold text-white">{t.v}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{t.l}</div>
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

      {/* Problems → Solutions */}
      <section className="py-24 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-orange-500 text-sm font-medium uppercase tracking-widest mb-3">The Problem</p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              You're losing jobs<br />you don't even know about.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {PROBLEMS.map(p => (
              <div key={p.before} className="bg-[#111111] border border-white/5 rounded-2xl p-6">
                <div className="text-red-400/70 text-sm font-medium mb-2 line-through">{p.before}</div>
                <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                  <span>→</span>
                  {p.after}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-orange-500 text-sm font-medium uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Everything you need.<br />Nothing you don't.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-[#111111] border border-white/5 hover:border-orange-500/20 rounded-2xl p-6 transition-all hover:bg-[#141414]">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-white text-base mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-orange-500 text-sm font-medium uppercase tracking-widest mb-3">Setup</p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Live in 30 minutes.<br />Not 30 days.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { num: '01', title: 'Create your shop', desc: 'Sign up in 60 seconds. Your dashboard is ready immediately.' },
              { num: '02', title: 'Import your data', desc: 'One-click import from BikeBook. All your customers, jobs, and history.' },
              { num: '03', title: 'Go live', desc: 'Configure your services, set your delivery slots, switch on the AI receptionist. Done.' },
            ].map(step => (
              <div key={step.num} className="text-center">
                <div className="text-7xl font-bold text-orange-500/15 mb-2 leading-none">{step.num}</div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0A0A0A] font-bold text-lg rounded-xl hover:bg-gray-100 transition-colors"
            >
              Start Your Free Trial →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-orange-500 text-sm font-medium uppercase tracking-widest mb-3">From Shop Owners</p>
            <h2 className="text-4xl font-bold">Real shops. Real results.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-[#111111] border border-white/5 rounded-2xl p-6">
                <p className="text-gray-300 text-sm leading-relaxed mb-4">{t.text}</p>
                <div>
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.shop}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-orange-500 text-sm font-medium uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            One price. Everything included.
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-12">
            No per-job fees. No seat limits. No surprises. Cancel anytime.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
            {PRICING_PLANS.map(plan => (
              <div key={plan.name} className={`relative bg-[#111111] rounded-2xl p-8 flex flex-col ${plan.popular ? 'border-2 border-orange-500 shadow-xl shadow-orange-500/10' : 'border border-white/5'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-orange-500 rounded-full text-xs font-bold text-white">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-500 text-sm">/month</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-2">{plan.desc}</p>
                </div>
                <div className="flex-1">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                        <span className="text-orange-400">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/sign-up"
                  className={`block w-full py-3 text-center font-bold text-sm rounded-xl transition-colors ${
                    plan.popular
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                  }`}
                >
                  {plan.cta} →
                </Link>
              </div>
            ))}
          </div>

          <p className="text-gray-600 text-sm mt-8">
            14-day free trial on all plans. No credit card required.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-orange-500 text-sm font-medium uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-4xl font-bold">Common questions</h2>
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

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-purple-600/10" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Your shop.<br />On autopilot.
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Start your 14-day free trial. No credit card. No migration headache. 
            Your shop data is seeded automatically.
          </p>
          <Link
            href="/sign-up"
            className="inline-block px-10 py-5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xl rounded-xl transition-all hover:scale-[1.02] shadow-2xl shadow-orange-500/20"
          >
            Start Free Trial →
          </Link>
          <p className="text-gray-600 text-sm mt-4">14 days free · No credit card · Cancel anytime</p>
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
