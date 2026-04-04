'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration_minutes: number;
  category: string;
}

interface ShopSettings {
  business_name: string;
  logo_url: string | null;
  accent_color: string;
  phone: string;
  address: string;
}

const STEPS = ['Select Service', 'Your Details', 'Book Time'];

function PortalContent() {
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [shopId, setShopId] = useState<string | null>(null);
  const [shopSettings, setShopSettings] = useState<ShopSettings | null>(null);
  const [step, setStep] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [bikeDescription, setBikeDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [jobCreated, setJobCreated] = useState('');

  // Accent color from shop settings (default orange)
  const accent = shopSettings?.accent_color || '#FF6B35';

  useEffect(() => {
    const shopParam = searchParams.get('shop');
    setShopId(shopParam);
    fetchData(shopParam);
  }, []);

  async function fetchData(shopId: string | null) {
    if (shopId) {
      // Load specific shop's settings
      const { data: settings } = await supabase
        .from('business_settings')
        .select('business_name, logo_url, accent_color, phone, address')
        .eq('profile_id', shopId)
        .single();
      if (settings) setShopSettings(settings);

      // Load that shop's services
      const { data: servicesData } = await supabase
        .from('services')
        .select('*')
        .eq('profile_id', shopId)
        .order('category')
        .order('price');
      if (servicesData) setServices(servicesData);
    } else {
      // No shop specified — load default/demo services
      const { data: servicesData } = await supabase
        .from('services')
        .select('*')
        .order('category')
        .order('price')
        .limit(20);
      if (servicesData) setServices(servicesData);
    }
    setLoading(false);
  }

  function validateStep0() {
    if (!selectedService) return 'Please select a service';
    return null;
  }

  function validateStep1() {
    if (!customerName.trim()) return 'Name is required';
    if (!customerEmail.trim() || !customerEmail.includes('@')) return 'Valid email is required';
    if (!customerPhone.trim()) return 'Phone number is required';
    return null;
  }

  function validateStep2() {
    if (!selectedDate) return 'Please select a date';
    if (!selectedSlot) return 'Please select a time slot';
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
      setStep(2);
    } else if (step === 2) {
      const err = validateStep2();
      if (err) { setError(err); return; }
      await handleSubmit();
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError('');

    try {
      // Create customer
      const { data: customer, error: custErr } = await supabase
        .from('customers')
        .insert({
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          address: customerAddress,
          profile_id: shopId || null,
        })
        .select()
        .single();

      if (custErr || !customer) {
        setError('Failed to save your details. Please try again.');
        setSubmitting(false);
        return;
      }

      // Create job
      const { data: job, error: jobErr } = await supabase
        .from('jobs')
        .insert({
          customer_id: customer.id,
          profile_id: shopId || null,
          status: 'booked_in',
          booked_at: new Date().toISOString(),
          scheduled_date: selectedDate,
          service_type: selectedService?.name,
          bike_model: bikeDescription || null,
          notes: `Time slot: ${selectedSlot}`,
        })
        .select()
        .single();

      if (jobErr || !job) {
        setError('Failed to create booking. Please try again.');
        setSubmitting(false);
        return;
      }

      // Link service to job
      if (selectedService) {
        await supabase.from('job_services').insert({
          job_id: job.id,
          service_id: selectedService.id,
        });
      }

      setJobCreated(job.job_number || job.id.slice(0, 8).toUpperCase());
      setStep(3);

    } catch {
      setError('Something went wrong. Please try again.');
    }
    setSubmitting(false);
  }

  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    if (d.getDay() === 0) d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }).filter((d, i, arr) => {
    const day = new Date(d).getDay();
    if (day === 0 || day === 6) return false;
    return arr.indexOf(d) === i;
  });

  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  const groupedServices = services.reduce((acc, s) => {
    const cat = s.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {} as Record<string, Service[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: accent }} />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Shop branding header */}
      <div className="text-center mb-8">
        {shopSettings?.logo_url ? (
          <img
            src={shopSettings.logo_url}
            alt={shopSettings.business_name}
            className="h-10 object-contain mx-auto mb-3"
          />
        ) : (
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-2xl">🔧</span>
            <span className="font-bold text-lg text-gray-900">{shopSettings?.business_name || 'Bike Service'}</span>
          </div>
        )}
        <p className="text-sm text-gray-500">
          {shopSettings?.address || 'Book your bike service'}
        </p>
      </div>

      {/* Progress */}
      {step < 3 && (
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                style={{
                  backgroundColor: i <= step ? accent : '#f3f4f6',
                  color: i <= step ? 'white' : '#9ca3af',
                }}
              >
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${i <= step ? 'text-gray-900' : 'text-gray-400'}`}>
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <div className="w-6 h-px" style={{ backgroundColor: i < step ? accent : '#e5e7eb' }} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Step 0 — Select Service */}
      {step === 0 && (
        <>
          <h2 className="text-xl font-bold text-gray-900 mb-1">What does your bike need?</h2>
          <p className="text-sm text-gray-500 mb-6">Select the service you need</p>

          <div className="space-y-6">
            {Object.entries(groupedServices).map(([category, catServices]) => (
              <div key={category}>
                <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">
                  {category}
                </h3>
                <div className="space-y-2">
                  {catServices.map(service => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className={`w-full text-left rounded-xl p-4 border transition-all ${
                        selectedService?.id === service.id
                          ? 'border-2 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={selectedService?.id === service.id ? { borderColor: accent, backgroundColor: `${accent}08` } : {}}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className="font-semibold text-sm"
                              style={selectedService?.id === service.id ? { color: accent } : { color: '#111827' }}
                            >
                              {service.name}
                            </span>
                          </div>
                          {service.description && (
                            <p className="text-gray-500 text-xs mt-0.5">{service.description}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">⏱️ ~{service.duration_minutes} min</p>
                        </div>
                        <span
                          className="font-bold"
                          style={selectedService?.id === service.id ? { color: accent } : { color: '#111827' }}
                        >
                          £{service.price}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Step 1 — Customer Details */}
      {step === 1 && (
        <>
          <h2 className="text-xl font-bold text-gray-900 mb-1">About you</h2>
          <p className="text-sm text-gray-500 mb-6">We'll use this to confirm your booking</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="James Thompson"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': accent } as any}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
              <input
                type="email"
                value={customerEmail}
                onChange={e => setCustomerEmail(e.target.value)}
                placeholder="james@example.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': accent } as any}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone *</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                placeholder="+44 7700 900001"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': accent } as any}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Address (for collection)</label>
              <input
                type="text"
                value={customerAddress}
                onChange={e => setCustomerAddress(e.target.value)}
                placeholder="45 Brixton Hill, London SW2 1AB"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': accent } as any}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Bike (optional)</label>
              <input
                type="text"
                value={bikeDescription}
                onChange={e => setBikeDescription(e.target.value)}
                placeholder="e.g. Specialized Tarmac, 2021"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': accent } as any}
              />
            </div>
          </div>
        </>
      )}

      {/* Step 2 — Pick Time */}
      {step === 2 && (
        <>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Pick a date & time</h2>
          <p className="text-sm text-gray-500 mb-6">
            {selectedService?.name} · ~{selectedService?.duration_minutes} min
          </p>

          <div className="mb-5">
            <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">Date</h3>
            <div className="grid grid-cols-7 gap-1">
              {availableDates.slice(0, 7).map(date => {
                const d = new Date(date + 'T00:00:00');
                const dayName = d.toLocaleDateString('en-GB', { weekday: 'short' }).slice(0, 1);
                const dayNum = d.getDate();
                const isSelected = selectedDate === date;
                return (
                  <button
                    key={date}
                    onClick={() => { setSelectedDate(date); setSelectedSlot(''); }}
                    className="py-2.5 rounded-xl text-center transition-all"
                    style={isSelected ? { backgroundColor: accent, color: 'white' } : { backgroundColor: '#f9fafb', color: '#374151' }}
                  >
                    <div className="text-[10px] opacity-70">{dayName}</div>
                    <div className="text-sm font-bold">{dayNum}</div>
                  </button>
                );
              })}
            </div>
            {availableDates.length > 7 && (
              <div className="grid grid-cols-7 gap-1 mt-1">
                {availableDates.slice(7, 14).map(date => {
                  const d = new Date(date + 'T00:00:00');
                  const dayName = d.toLocaleDateString('en-GB', { weekday: 'short' }).slice(0, 1);
                  const dayNum = d.getDate();
                  const isSelected = selectedDate === date;
                  return (
                    <button
                      key={date}
                      onClick={() => { setSelectedDate(date); setSelectedSlot(''); }}
                      className="py-2.5 rounded-xl text-center transition-all"
                      style={isSelected ? { backgroundColor: accent, color: 'white' } : { backgroundColor: '#f9fafb', color: '#374151' }}
                    >
                      <div className="text-[10px] opacity-70">{dayName}</div>
                      <div className="text-sm font-bold">{dayNum}</div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {selectedDate && (
            <div>
              <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">Time</h3>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className="py-2.5 rounded-xl text-center text-sm font-medium transition-all"
                    style={selectedSlot === slot ? { backgroundColor: accent, color: 'white' } : { backgroundColor: '#f9fafb', color: '#374151' }}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedDate && selectedSlot && (
            <div className="mt-5 p-4 border border-gray-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{selectedService?.name}</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} at {selectedSlot}
                  </p>
                </div>
                <p className="text-xl font-bold" style={{ color: accent }}>£{selectedService?.price}</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Step 3 — Done */}
      {step === 3 && (
        <div className="text-center py-8">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-500 text-sm mb-5">
            Your bike service is booked.
          </p>
          <div className="border border-gray-200 rounded-xl p-5 text-left mb-6">
            <p className="font-semibold text-gray-900">{selectedService?.name}</p>
            <p className="text-gray-500 text-sm mt-1">
              {selectedDate && new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} at {selectedSlot}
            </p>
            <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-gray-400 text-sm">Reference</span>
              <span className="font-mono font-medium text-sm" style={{ color: accent }}>{jobCreated}</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm">
            We'll send a confirmation to <span className="text-gray-900">{customerEmail}</span>
          </p>
          {shopSettings?.phone && (
            <p className="text-gray-400 text-xs mt-2">
              Questions? Call us at {shopSettings.phone}
            </p>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 p-3 rounded-xl text-red-600 text-sm" style={{ backgroundColor: '#fef2f2' }}>
          {error}
        </div>
      )}

      {/* Navigation */}
      {step < 3 && (
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-5 py-3.5 border border-gray-200 text-gray-600 hover:border-gray-300 rounded-xl transition-colors"
            >
              ← Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={submitting}
            className="flex-1 py-3.5 font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-white"
            style={{ backgroundColor: accent }}
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Booking...
              </>
            ) : step === 2 ? (
              'Confirm Booking'
            ) : (
              'Continue'
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default function PortalPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Suspense fallback={
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
          </div>
        }>
          <PortalContent />
        </Suspense>
      </div>
    </div>
  );
}
