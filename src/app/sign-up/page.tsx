'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const STEPS = ['Your Shop', 'Your Details', 'Done'];

export default function SignUpPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 0 — Shop details
  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [postcode, setPostcode] = useState('');

  // Step 1 — Your account
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2 — Done
  const [shopCreated, setShopCreated] = useState('');

  function validateStep0() {
    if (!shopName.trim()) return 'Shop name is required';
    if (!phone.trim()) return 'Phone number is required';
    if (!postcode.trim()) return 'Postcode is required';
    return null;
  }

  function validateStep1() {
    if (!ownerName.trim()) return 'Your name is required';
    if (!email.trim()) return 'Email is required';
    if (!email.includes('@')) return 'Enter a valid email';
    if (!password || password.length < 8) return 'Password must be at least 8 characters';
    if (password !== confirmPassword) return 'Passwords do not match';
    return null;
  }

  async function handleNext() {
    setError('');
    if (step === 0) {
      const err = validateStep0();
      if (err) { setError(err); return; }
      setStep(1);
    } else if (step === 1) {
      const err = validateStep1();
      if (err) { setError(err); return; }
      await handleSignUp();
    }
  }

  async function handleSignUp() {
    setLoading(true);
    try {
      // 1. Create auth user
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: ownerName },
        },
      });

      if (authErr || !authData.user) {
        setError(authErr?.message || 'Failed to create account');
        setLoading(false);
        return;
      }

      const userId = authData.user.id;

      // 2. Create shop profile
      const { data: shopData, error: shopErr } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email,
          full_name: ownerName,
          shop_name: shopName,
          phone,
          address,
          postcode,
          role: 'owner',
          plan: 'starter',
          is_active: true,
        })
        .select()
        .single();

      if (shopErr) {
        console.error('Shop creation error:', shopErr);
        // Clean up auth user
        await supabase.auth.admin.deleteUser(userId);
        setError('Failed to create shop. Please try again.');
        setLoading(false);
        return;
      }

      // 3. Create default settings
      await supabase.from('business_settings').insert({
        profile_id: userId,
        business_name: shopName,
        address,
        phone,
        email,
        postcode,
      });

      await supabase.from('invoice_settings').insert({
        profile_id: userId,
        prefix: '#INV-',
        starting_number: 1,
        vat_rate: 20,
      });

      // 4. Seed demo data for the new shop
      await seedDemoData(userId);

      setShopCreated(shopName);
      setStep(2);

    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  }

  async function seedDemoData(profileId: string) {
    // Create a few demo customers
    const { data: customers } = await supabase
      .from('customers')
      .insert([
        { profile_id: profileId, name: 'James Thompson', email: 'james@example.com', phone: '+447700900001', address: '12 Clapham Road, London SW9 0JA' },
        { profile_id: profileId, name: 'Sarah Chen', email: 'sarah@example.com', phone: '+447700900002', address: '45 Brixton Hill, London SW2 1AB' },
        { profile_id: profileId, name: 'Mike Rossi', email: 'mike@example.com', phone: '+447700900003', address: '8 Wandsworth High St, London SW18 2TA' },
      ])
      .select();

    if (!customers?.length) return;

    // Create a demo job for each customer
    for (const customer of customers) {
      const { data: bikes } = await supabase
        .from('bikes')
        .insert({
          customer_id: customer.id,
          profile_id: profileId,
          make: ['Specialized', 'Giant', 'Trek', 'Cannondale'][Math.floor(Math.random() * 4)],
          model: 'Road Bike',
          bike_type: 'road',
        })
        .select()
        .single();

      if (bikes) {
        await supabase.from('jobs').insert({
          profile_id: profileId,
          customer_id: customer.id,
          bike_id: bikes.id,
          status: 'bike_ready',
          booked_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
          price: [85, 120, 147, 65][Math.floor(Math.random() * 4)],
          notes: 'Demo job — service completed',
        });
      }
    }

    // Demo services
    await supabase.from('services').insert([
      { profile_id: profileId, name: 'Full Service', description: 'Complete drivetrain, brakes, gears & frame check', price: 120, duration_minutes: 90, category: 'service' },
      { profile_id: profileId, name: 'Gear Adjustment', description: 'Precision indexing for smooth shifting', price: 35, duration_minutes: 30, category: 'adjustment' },
      { profile_id: profileId, name: 'Brake Service', description: 'Pads, cables & rotor alignment', price: 40, duration_minutes: 30, category: 'brakes' },
      { profile_id: profileId, name: 'Puncture Repair', description: 'Inner tube replacement', price: 20, duration_minutes: 15, category: 'repair' },
      { profile_id: profileId, name: 'Chain Replacement', description: 'Quality chain with tension check', price: 45, duration_minutes: 20, category: 'repair' },
      { profile_id: profileId, name: 'Safety Inspection', description: '30-point check', price: 25, duration_minutes: 30, category: 'inspection' },
    ]);
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      {/* Header */}
      <header className="border-b border-white/5 px-4 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🔧</span>
            <span className="font-bold text-lg tracking-tight text-white">Bike<span className="text-orange-500">Clinique</span></span>
          </Link>
          <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
            Already have an account? Sign in
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Progress */}
          {step < 2 && (
            <div className="flex items-center justify-center gap-2 mb-10">
              {STEPS.map((label, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    i <= step
                      ? 'bg-orange-500 text-white'
                      : 'bg-[#1A1A1A] text-gray-500 border border-white/10'
                  }`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${
                    i <= step ? 'text-white' : 'text-gray-500'
                  }`}>
                    {label}
                  </span>
                  {i < STEPS.length - 1 && (
                    <div className={`w-8 h-px ${i < step ? 'bg-orange-500' : 'bg-white/10'}`} />
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="bg-[#111111] border border-white/5 rounded-2xl p-8">
            {step === 0 && (
              <>
                <div className="text-center mb-8">
                  <div className="text-4xl mb-3">🏪</div>
                  <h1 className="text-2xl font-bold text-white mb-2">Set up your shop</h1>
                  <p className="text-gray-500 text-sm">Tell us about your bike shop</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Shop Name *</label>
                    <input
                      type="text"
                      value={shopName}
                      onChange={e => setShopName(e.target.value)}
                      placeholder="e.g. South London Cycles"
                      className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone Number *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+44 20 7946 0000"
                      className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Postcode *</label>
                    <input
                      type="text"
                      value={postcode}
                      onChange={e => setPostcode(e.target.value)}
                      placeholder="SW9 0JA"
                      className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Address</label>
                    <textarea
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="123 High Street&#10;London&#10;SW9 0JA"
                      rows={3}
                      className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                    />
                  </div>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div className="text-center mb-8">
                  <div className="text-4xl mb-3">👋</div>
                  <h1 className="text-2xl font-bold text-white mb-2">You're the owner</h1>
                  <p className="text-gray-500 text-sm">Create your account to manage {shopName}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Your Name *</label>
                    <input
                      type="text"
                      value={ownerName}
                      onChange={e => setOwnerName(e.target.value)}
                      placeholder="Freddie Vaval"
                      className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="freddie@bikeclinique.com"
                      className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Password *</label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm Password *</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="mt-5 p-4 bg-[#1A1A1A] rounded-xl border border-white/5">
                  <p className="text-xs text-gray-500">
                    🔒 By signing up you agree to our Terms of Service and Privacy Policy.
                    Your first 14 days are free. Cancel anytime.
                  </p>
                </div>
              </>
            )}

            {step === 2 && (
              <div className="text-center py-4">
                <div className="text-6xl mb-5">🎉</div>
                <h1 className="text-2xl font-bold text-white mb-3">
                  {shopCreated} is ready!
                </h1>
                <p className="text-gray-400 mb-8">
                  Your shop is set up and we've loaded some demo data so you can see how it works.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 bg-[#1A1A1A] rounded-xl p-4 text-left">
                    <span className="text-2xl">✅</span>
                    <div>
                      <p className="text-white font-medium text-sm">Shop profile created</p>
                      <p className="text-gray-500 text-xs">{shopCreated} · South London</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-[#1A1A1A] rounded-xl p-4 text-left">
                    <span className="text-2xl">📋</span>
                    <div>
                      <p className="text-white font-medium text-sm">Demo data loaded</p>
                      <p className="text-gray-500 text-xs">3 customers, jobs, and services to explore</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-[#1A1A1A] rounded-xl p-4 text-left">
                    <span className="text-2xl">🔧</span>
                    <div>
                      <p className="text-white font-medium text-sm">Ready to go</p>
                      <p className="text-gray-500 text-xs">Your dashboard is waiting</p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  className="block w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-xl transition-colors text-center"
                >
                  Go to Dashboard →
                </Link>
                <p className="text-center text-xs text-gray-600 mt-3">
                  Need help? Reply to your welcome email anytime.
                </p>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            {step < 2 && (
              <button
                onClick={handleNext}
                disabled={loading}
                className="w-full mt-6 py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-lg rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Setting up your shop...
                  </>
                ) : step === 0 ? (
                  'Continue →'
                ) : (
                  <>Create My Shop →</>
                )}
              </button>
            )}
          </div>

          {/* Social proof */}
          {step < 2 && (
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-600">
                Join <span className="text-gray-400 font-medium">47 bike shops</span> already running on BikeClinique
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
