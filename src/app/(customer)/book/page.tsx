'use client'

import { useState, useEffect } from 'react'

interface Service {
  id: string
  name: string
  price: number
  duration_minutes: number
  description: string
}

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
]

export default function BookingPage() {
  // Default services - show immediately (using UUIDs matching seed data)
  const [services, setServices] = useState([
    { id: '00000000-0000-0000-0000-000000000101', name: 'Minimum Service', price: 79, duration_minutes: 60, description: 'Basic service check' },
    { id: '00000000-0000-0000-0000-000000000102', name: 'Full Service', price: 120, duration_minutes: 120, description: 'Complete service' },
    { id: '00000000-0000-0000-0000-000000000103', name: 'Advance Service', price: 150, duration_minutes: 150, description: 'Premium service' },
    { id: '00000000-0000-0000-0000-000000000104', name: 'Bike Overhaul', price: 350, duration_minutes: 280, description: 'Full gold standard' },
    { id: '00000000-0000-0000-0000-000000000105', name: 'Wheel True', price: 40, duration_minutes: 30, description: 'Wheel alignment' },
    { id: '00000000-0000-0000-0000-000000000106', name: 'Puncture Repair', price: 20, duration_minutes: 15, description: 'Fix flat tyre' },
  ])
  const [loading, setLoading] = useState(false) // Start with false since we have defaults
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [deliveryType, setDeliveryType] = useState<'dropoff' | 'collection'>('collection')
  const [pickupAddress, setPickupAddress] = useState('')
  const [deliveryPostcode, setDeliveryPostcode] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bike: '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Try to load services from Supabase (optional enhancement)
    const fetchServices = async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      if (!supabaseUrl || !supabaseKey) return
      
      try {
        const res = await fetch(`${supabaseUrl}/rest/v1/services?select=*&is_active=eq.true&order=name`, {
          headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
        })
        const data = await res.json()
        if (data && data.length > 0) {
          setServices(data)
        }
      } catch (err) {
        // Keep using default services
      }
    }
    fetchServices()
  }, [])

  const fetchServices = async () => {
    // Default fallback services (using UUIDs matching seed data)
    const fallbackServices = [
      { id: '00000000-0000-0000-0000-000000000101', name: 'Minimum Service', price: 79, duration_minutes: 60, description: 'Basic service check' },
      { id: '00000000-0000-0000-0000-000000000102', name: 'Full Service', price: 120, duration_minutes: 120, description: 'Complete service' },
      { id: '00000000-0000-0000-0000-000000000103', name: 'Advance Service', price: 150, duration_minutes: 150, description: 'Premium service' },
      { id: '00000000-0000-0000-0000-000000000104', name: 'Bike Overhaul', price: 350, duration_minutes: 280, description: 'Full gold standard' },
      { id: '00000000-0000-0000-0000-000000000105', name: 'Wheel True', price: 40, duration_minutes: 30, description: 'Wheel alignment' },
      { id: '00000000-0000-0000-0000-000000000106', name: 'Puncture Repair', price: 20, duration_minutes: 15, description: 'Fix flat tyre' },
    ]
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('Missing env vars, using fallback')
      setServices(fallbackServices)
      setLoading(false)
      return
    }
    
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/services?select=*&is_active=eq.true&order=name`, {
        headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
      })
      const data = await res.json()
      if (data && data.length > 0) {
        setServices(data)
      } else {
        setServices(fallbackServices)
      }
    } catch (err) {
      console.log('Fetch error, using fallback', err)
      setServices(fallbackServices)
    }
    setLoading(false)
  }

  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i + 1)
    return d
  })

  const handleSubmit = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all required fields')
      return
    }
    setSubmitting(true)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    try {
      await fetch(`${supabaseUrl}/rest/v1/bookings`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey!,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          bike_details: formData.bike,
          service_id: selectedService.id,
          booking_date: selectedDate,
          booking_time: selectedTime,
          collection_needed: deliveryType === 'dropoff',
          pickup_address: deliveryType === 'dropoff' ? pickupAddress : null,
          delivery_postcode: deliveryType === 'dropoff' ? deliveryPostcode : null,
          notes: formData.notes,
          status: 'pending'
        })
      })
      setSuccess(true)
    } catch (err) {
      console.error('Booking error:', err)
      alert('Booking failed. Please try again.')
    }
    setSubmitting(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNHoiIGZpbGw9IiNmZjMxMzEiIGZpbGwtb3BhY2l0eT0iLjAyIi8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF3131] rounded-full blur-[150px] opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#39FF14] rounded-full blur-[100px] opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="max-w-md w-full bg-[#141414] border-2 border-[#FF3131] p-8 relative z-10">
          {/* Corner accents with animation */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#FF3131] animate-pulse"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#FF3131] animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#FF3131] animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#FF3131] animate-pulse"></div>
          
          <div className="text-center">
            {/* Animated checkmark */}
            <div className="w-20 h-20 mx-auto mb-6 border-2 border-[#FF3131] flex items-center justify-center relative">
              <div className="absolute inset-0 bg-[#FF3131] animate-ping opacity-20"></div>
              <svg className="w-10 h-10 text-[#FF3131]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold text-white mb-2 tracking-tight animate-[slideIn_0.5s_ease-out]">BOOKED</h1>
            <p className="text-[#666] mb-6 font-mono text-sm">{formData.name} // {selectedService?.name}</p>
            
            <div className="border-y-2 border-[#2A2A2A] py-4 mb-6">
              <p className="text-3xl font-bold text-[#FF3131]">
                {new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase()}
              </p>
              <p className="text-xl text-white mt-1">{selectedTime}</p>
            </div>
            
            <p className="text-xs text-[#666] mb-6 font-mono">CONFIRMATION SENT TO {formData.email}</p>
            <a href="/book" className="text-[#FF3131] hover:text-white border-b border-[#FF3131] pb-1 text-sm font-bold uppercase tracking-wider inline-block transition-all hover:scale-105">BOOK ANOTHER</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(42,42,42,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(42,42,42,0.3)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        {/* Glowing orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF3131] rounded-full blur-[200px] opacity-15"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#39FF14] rounded-full blur-[150px] opacity-10"></div>
        
        {/* Animated lines */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FF3131] to-transparent opacity-30"></div>
      </div>

      {/* Header - Industrial */}
      <header className="border-b-4 border-[#FF3131] bg-[#141414] relative z-10">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Animated Logo */}
              <div className="relative">
                <div className="w-14 h-14 bg-[#FF3131] flex items-center justify-center">
                  <svg className="w-8 h-8 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <circle cx="5.5" cy="17.5" r="3" />
                    <circle cx="18.5" cy="17.5" r="3" />
                    <path d="M8.5 17.5L15.5 6.5M15.5 17.5L8.5 6.5" />
                  </svg>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-[#FF3131] blur-xl opacity-50 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-wider">BIKE CLINIQUE</h1>
                <p className="text-xs text-[#FF3131] font-bold tracking-[0.3em] mt-1">PREMIUM BICYCLE SERVICE</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#666]">NEED HELP?</p>
              <p className="font-bold text-lg">020 7946 0000</p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-[#141414] border-b border-[#2A2A2A] relative z-10">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-0">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  step >= s ? 'bg-[#FF3131] text-black' : 'bg-[#1C1C1C] text-[#666]'
                }`}>
                  {s}
                </div>
                {s < 4 && (
                  <div className={`w-16 h-1 transition-all duration-300 ${step > s ? 'bg-[#FF3131]' : 'bg-[#2A2A2A]'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-8 relative z-10">
        {/* Step 1: Service */}
        {step === 1 && (
          <div className="animate-[fadeIn_0.3s_ease-out]">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-[#FF3131] text-black flex items-center justify-center font-bold text-sm">1</span>
              SELECT SERVICE
            </h2>
            
            {loading ? (
              <div className="space-y-3">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="h-24 bg-[#141414] rounded-lg animate-pulse border border-[#2A2A2A]" />
                ))}
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-[#2A2A2A]">
                <p className="text-[#666] mb-4">No services available</p>
                <button onClick={fetchServices} className="text-[#FF3131] underline">Refresh</button>
              </div>
            ) : (
              <div className="space-y-3">
                {services.map((service, idx) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`w-full p-4 border-2 text-left transition-all duration-200 hover:translate-x-1 ${
                      selectedService?.id === service.id 
                        ? 'border-[#FF3131] bg-[#141414]' 
                        : 'border-[#2A2A2A] bg-[#0A0A0A] hover:border-[#666]'
                    }`}
                    style={{animationDelay: `${idx * 50}ms`}}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-lg">{service.name}</p>
                        <p className="text-xs text-[#666] font-mono">{service.duration_minutes} MIN</p>
                      </div>
                      <span className="text-3xl font-bold text-[#FF3131]">£{service.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            <button
              onClick={() => selectedService && setStep(2)}
              disabled={!selectedService}
              className="w-full mt-6 py-4 bg-[#FF3131] text-black font-bold text-lg hover:bg-white transition-all hover:scale-[1.02] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              CONTINUE →
            </button>
          </div>
        )}

        {/* Step 2: Date & Delivery */}
        {step === 2 && (
          <div className="animate-[fadeIn_0.3s_ease-out]">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-[#FF3131] text-black flex items-center justify-center font-bold text-sm">2</span>
              DATE + DELIVERY
            </h2>

            {/* Date */}
            <div className="mb-6">
              <p className="text-xs font-bold text-[#666] mb-3 tracking-wider">SELECT DATE</p>
              <div className="grid grid-cols-4 gap-2">
                {dates.slice(0, 8).map((date, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(date.toISOString().split('T')[0])}
                    className={`py-3 border-2 text-center transition-all hover:scale-105 ${
                      selectedDate === date.toISOString().split('T')[0]
                        ? 'border-[#FF3131] bg-[#FF3131] text-black font-bold'
                        : 'border-[#2A2A2A] bg-[#0A0A0A] hover:border-[#666] font-medium'
                    }`}
                  >
                    <div className="text-xs opacity-70">{date.toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase()}</div>
                    <div className="text-2xl font-bold">{date.getDate()}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time */}
            <div className="mb-6">
              <p className="text-xs font-bold text-[#666] mb-3 tracking-wider">SELECT TIME</p>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.slice(0, 8).map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-2 border-2 text-sm transition-all hover:scale-105 ${
                      selectedTime === time
                        ? 'border-[#FF3131] bg-[#FF3131] text-black font-bold'
                        : 'border-[#2A2A2A] bg-[#0A0A0A] hover:border-[#666]'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery */}
            <div className="mb-6">
              <p className="text-xs font-bold text-[#666] mb-3 tracking-wider">HOW WILL YOU GET YOUR BIKE TO US?</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDeliveryType('collection')}
                  className={`p-4 border-2 text-left transition-all hover:translate-x-1 ${
                    deliveryType === 'collection'
                      ? 'border-[#FF3131] bg-[#141414]'
                      : 'border-[#2A2A2A] bg-[#0A0A0A] hover:border-[#666]'
                  }`}
                >
                  <div className="font-bold text-lg mb-1">DROP OFF</div>
                  <div className="text-xs text-[#666]">Bring it to our workshop</div>
                  <div className="text-xs text-[#FF3131] font-bold mt-2">FREE</div>
                </button>
                <button
                  onClick={() => setDeliveryType('dropoff')}
                  className={`p-4 border-2 text-left transition-all hover:translate-x-1 ${
                    deliveryType === 'dropoff'
                      ? 'border-[#FF3131] bg-[#141414]'
                      : 'border-[#2A2A2A] bg-[#0A0A0A] hover:border-[#666]'
                  }`}
                >
                  <div className="font-bold text-lg mb-1">PICKUP + DELIVERY</div>
                  <div className="text-xs text-[#666]">We collect and return</div>
                  <div className="text-xs text-[#FF3131] font-bold mt-2">FROM £15</div>
                </button>
              </div>
            </div>

            {/* Address */}
            {deliveryType === 'dropoff' && (
              <div className="mb-6 p-4 border-2 border-[#FF3131] bg-[#0A0A0A] animate-[slideIn_0.3s_ease-out]">
                <p className="text-sm font-bold text-[#FF3131] mb-3 tracking-wider">COLLECTION ADDRESS</p>
                <input
                  type="text"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="FULL ADDRESS"
                  className="w-full px-4 py-3 bg-[#141414] border border-[#2A2A2A] text-white focus:border-[#FF3131] outline-none mb-3 text-sm"
                />
                <input
                  type="text"
                  value={deliveryPostcode}
                  onChange={(e) => setDeliveryPostcode(e.target.value)}
                  placeholder="POSTCODE"
                  className="w-full px-4 py-3 bg-[#141414] border border-[#2A2A2A] text-white focus:border-[#FF3131] outline-none text-sm"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-4 border-2 border-[#2A2A2A] hover:border-white font-bold transition-all hover:translate-x-1">← BACK</button>
              <button
                onClick={() => setStep(3)}
                disabled={!selectedDate || !selectedTime}
                className="flex-1 py-4 bg-[#FF3131] text-black font-bold hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
              >
                CONTINUE →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Details */}
        {step === 3 && (
          <div className="animate-[fadeIn_0.3s_ease-out]">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-[#FF3131] text-black flex items-center justify-center font-bold text-sm">3</span>
              YOUR DETAILS
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#666] mb-2 uppercase tracking-wider">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-[#141414] border-2 border-[#2A2A2A] text-white focus:border-[#FF3131] outline-none font-bold transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#666] mb-2 uppercase tracking-wider">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-[#141414] border-2 border-[#2A2A2A] text-white focus:border-[#FF3131] outline-none font-bold transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#666] mb-2 uppercase tracking-wider">Phone *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-[#141414] border-2 border-[#2A2A2A] text-white focus:border-[#FF3131] outline-none font-bold transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#666] mb-2 uppercase tracking-wider">Bike Details</label>
                <input
                  type="text"
                  value={formData.bike}
                  onChange={(e) => setFormData({...formData, bike: e.target.value})}
                  placeholder="E.G. SPECIALIZED DIVERGE E5"
                  className="w-full px-4 py-3 bg-[#141414] border-2 border-[#2A2A2A] text-white focus:border-[#FF3131] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#666] mb-2 uppercase tracking-wider">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={2}
                  placeholder="Any special requests..."
                  className="w-full px-4 py-3 bg-[#141414] border-2 border-[#2A2A2A] text-white focus:border-[#FF3131] outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(2)} className="flex-1 py-4 border-2 border-[#2A2A2A] hover:border-white font-bold transition-all hover:translate-x-1">← BACK</button>
              <button
                onClick={() => setStep(4)}
                disabled={!formData.name || !formData.email || !formData.phone}
                className="flex-1 py-4 bg-[#FF3131] text-black font-bold hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
              >
                REVIEW →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <div className="animate-[fadeIn_0.3s_ease-out]">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-[#FF3131] text-black flex items-center justify-center font-bold text-sm">4</span>
              CONFIRM
            </h2>
            
            <div className="border-2 border-[#FF3131] bg-[#141414] p-6 mb-6">
              <div className="flex justify-between py-3 border-b border-[#2A2A2A]">
                <span className="text-[#666] font-bold uppercase text-sm tracking-wider">Service</span>
                <span className="font-bold">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-[#2A2A2A]">
                <span className="text-[#666] font-bold uppercase text-sm tracking-wider">Date</span>
                <span className="font-bold">{selectedDate && new Date(selectedDate).toLocaleDateString('en-GB').toUpperCase()}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-[#2A2A2A]">
                <span className="text-[#666] font-bold uppercase text-sm tracking-wider">Time</span>
                <span className="font-bold">{selectedTime}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-[#2A2A2A]">
                <span className="text-[#666] font-bold uppercase text-sm tracking-wider">Delivery</span>
                <span className="font-bold text-[#FF3131]">{deliveryType === 'dropoff' ? 'PICKUP + DELIVERY' : 'DROP OFF'}</span>
              </div>
              {deliveryType === 'dropoff' && pickupAddress && (
                <div className="flex justify-between py-3 border-b border-[#2A2A2A]">
                  <span className="text-[#666] font-bold uppercase text-sm tracking-wider">Address</span>
                  <span className="font-bold text-sm text-right">{pickupAddress}</span>
                </div>
              )}
              <div className="flex justify-between py-3 border-b border-[#2A2A2A]">
                <span className="text-[#666] font-bold uppercase text-sm tracking-wider">Name</span>
                <span className="font-bold">{formData.name}</span>
              </div>
              <div className="flex justify-between pt-4 mt-4">
                <span className="font-bold text-lg">TOTAL</span>
                <span className="text-5xl font-bold text-[#FF3131]">£{selectedService?.price || 0}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="flex-1 py-4 border-2 border-[#2A2A2A] hover:border-white font-bold transition-all hover:translate-x-1">← BACK</button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 py-4 bg-[#FF3131] text-black font-bold text-lg hover:bg-white disabled:opacity-30 transition-all hover:scale-[1.02]"
              >
                {submitting ? 'BOOKING...' : 'CONFIRM'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
