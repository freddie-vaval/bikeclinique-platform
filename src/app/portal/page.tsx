'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration_minutes: number;
  category: string;
}

const STEPS = ['Select Service', 'Your Details', 'Book Time'];

function PortalContent() {
  const router = useRouter();
  const supabase = createClient();
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

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    const { data } = await supabase
      .from('services')
      .select('*')
      .order('category')
      .order('price');
    if (data) setServices(data);
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
      // 1. Create customer
      const { data: customer, error: custErr } = await supabase
        .from('customers')
        .insert({
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          address: customerAddress,
        })
        .select()
        .single();

      if (custErr || !customer) {
        setError('Failed to save your details. Please try again.');
        setSubmitting(false);
        return;
      }

      // 2. Create job
      const { data: job, error: jobErr } = await supabase
        .from('jobs')
        .insert({
          customer_id: customer.id,
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

      // 3. Link service to job
      if (selectedService) {
        await supabase.from('job_services').insert({
          job_id: job.id,
          service_id: selectedService.id,
        });
      }

      setJobCreated(job.job_number || job.id);
      setStep(3);

      // Send confirmation SMS
      if (customerPhone && process.env.NEXT_PUBLIC_TWILIO_PHONE_NUMBER) {
        const msg = `Hi ${customerName}! 🔧 Your bike service is booked.\n\n${selectedService?.name} · ${selectedDate} at ${selectedSlot}\n\nWe'll send a confirmation before your appointment. See you soon!`;
        // SMS would be sent via API call in production
      }

    } catch {
      setError('Something went wrong. Please try again.');
    }
    setSubmitting(false);
  }

  // Generate available dates (next 14 days, weekdays only)
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    if (d.getDay() === 0) d.setDate(d.getDate() + 1); // Skip Sunday
    return d.toISOString().split('T')[0];
  }).filter((d, i, arr) => {
    const day = new Date(d).getDay();
    if (day === 0 || day === 6) return false; // No weekends
    return arr.indexOf(d) === i;
  });

  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  const groupedServices = services.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {} as Record<string, Service[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      {step < 3 && (
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
              <span className={`text-xs font-medium hidden sm:block ${i <= step ? 'text-white' : 'text-gray-500'}`}>
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`w-8 h-px ${i < step ? 'bg-orange-500' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Step 0 — Select Service */}
      {step === 0 && (
        <>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">What does your bike need?</h1>
            <p className="text-gray-500 text-sm">Select the service you need</p>
          </div>

          <div className="space-y-6">
            {Object.entries(groupedServices).map(([category, catServices]) => (
              <div key={category}>
                <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-medium">
                  {category}
                </h3>
                <div className="space-y-2">
                  {catServices.map(service => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className={`w-full text-left rounded-xl p-4 border transition-all ${
                        selectedService?.id === service.id
                          ? 'bg-orange-500/10 border-orange-500'
                          : 'bg-[#111111] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-semibold ${selectedService?.id === service.id ? 'text-orange-400' : 'text-white'}`}>
                              {service.name}
                            </h4>
                          </div>
                          {service.description && (
                            <p className="text-gray-500 text-sm mt-1">{service.description}</p>
                          )}
                          <p className="text-xs text-gray-600 mt-1">⏱️ {service.duration_minutes} min</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${selectedService?.id === service.id ? 'text-orange-400' : 'text-white'}`}>
                            £{service.price}
                          </p>
                        </div>
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
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">About you</h1>
            <p className="text-gray-500 text-sm">We'll use this to confirm your booking</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name *</label>
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="James Thompson"
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email *</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  placeholder="james@example.com"
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone *</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder="+44 7700 900001"
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Address (for collection)</label>
              <input
                type="text"
                value={customerAddress}
                onChange={e => setCustomerAddress(e.target.value)}
                placeholder="45 Brixton Hill, London SW2 1AB"
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Bike (optional)</label>
              <input
                type="text"
                value={bikeDescription}
                onChange={e => setBikeDescription(e.target.value)}
                placeholder="e.g. Specialized Tarmac, 2021"
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>
        </>
      )}

      {/* Step 2 — Pick Time */}
      {step === 2 && (
        <>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Pick a date & time</h1>
            <p className="text-gray-500 text-sm">
              {selectedService?.name} · ~{selectedService?.duration_minutes} min
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-medium">Date</h3>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {availableDates.map(date => {
                const d = new Date(date + 'T00:00:00');
                const dayName = d.toLocaleDateString('en-GB', { weekday: 'short' });
                const dayNum = d.getDate();
                const isSelected = selectedDate === date;
                return (
                  <button
                    key={date}
                    onClick={() => { setSelectedDate(date); setSelectedSlot(''); }}
                    className={`py-3 rounded-xl text-center transition-all ${
                      isSelected
                        ? 'bg-orange-500 text-white'
                        : 'bg-[#111111] border border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className={`text-xs ${isSelected ? 'text-white/70' : 'text-gray-500'}`}>{dayName}</div>
                    <div className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-white'}`}>{dayNum}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedDate && (
            <div>
              <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-medium">Time</h3>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-3 rounded-xl text-center font-medium text-sm transition-all ${
                      selectedSlot === slot
                        ? 'bg-orange-500 text-white'
                        : 'bg-[#111111] border border-white/5 hover:border-white/20 text-gray-300'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedDate && selectedSlot && (
            <div className="mt-6 p-4 bg-[#111111] border border-white/5 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{selectedService?.name}</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} at {selectedSlot}
                  </p>
                </div>
                <p className="text-xl font-bold text-orange-400">£{selectedService?.price}</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Step 3 — Done */}
      {step === 3 && (
        <div className="text-center py-8">
          <div className="text-6xl mb-5">✅</div>
          <h1 className="text-2xl font-bold text-white mb-3">Booking Confirmed!</h1>
          <p className="text-gray-400 mb-2">
            Your bike service is booked for:
          </p>
          <div className="bg-[#111111] border border-white/5 rounded-xl p-5 text-left mb-6">
            <p className="text-white font-semibold text-lg">{selectedService?.name}</p>
            <p className="text-gray-400 text-sm mt-1">
              {selectedDate && new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} at {selectedSlot}
            </p>
            <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-gray-500 text-sm">Reference</span>
              <span className="text-orange-400 font-mono font-medium text-sm">{jobCreated}</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm">
            We'll send a confirmation to <span className="text-white">{customerEmail}</span> shortly.
          </p>
          <button
            onClick={() => router.push('/')}
            className="mt-6 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-colors text-sm"
          >
            ← Back to home
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Navigation */}
      {step < 3 && (
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-4 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 rounded-xl transition-colors"
            >
              ← Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={submitting}
            className="flex-1 py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Booking...
              </>
            ) : step === 2 ? (
              'Confirm Booking →'
            ) : (
              'Continue →'
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
      {/* Minimal header */}
      <header className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔧</span>
            <span className="font-bold text-sm text-gray-900">Bike<span className="text-orange-500">Clinique</span></span>
          </div>
          <span className="text-xs text-gray-400">Book a service</span>
        </div>
      </header>

      {/* Booking widget */}
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
