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
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
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
    fetchServices()
  }, [])

  const fetchServices = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/services?select=*&is_active=eq.true&order=name`, {
        headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
      })
      const data = await res.json()
      setServices(data || [])
    } catch (err) {
      console.error('Error fetching services:', err)
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
          booking_date: selectedDate,
          booking_time: selectedTime,
          collection_needed: false,
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

  const total = selectedService?.price || 0

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A1A2E] to-[#2D2D4A] py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl p-12 shadow-xl">
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-3xl font-bold text-[#1A1A2E] mb-4">Booking Confirmed!</h1>
            <p className="text-gray-600 mb-4">
              Thanks {formData.name}! We&apos;ve received your booking for {selectedService?.name} on {new Date(selectedDate).toLocaleDateString('en-GB')} at {selectedTime}.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              We&apos;ll send a confirmation to {formData.email}
            </p>
            <p className="text-orange-600 bg-orange-50 p-3 rounded-lg mb-6">
              💡 After your service is complete, you can schedule delivery at checkout
            </p>
            <a href="/book" className="text-[#FF6B35] hover:underline">Book another service →</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A2E] to-[#2D2D4A] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Book Your Bike Service</h1>
          <p className="text-gray-400">Bike Clinique LTD</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= s ? 'bg-[#FF6B35] text-white' : 'bg-gray-700 text-gray-400'
              }`}>
                {s}
              </div>
              {s < 4 && <div className={`w-12 h-0.5 ${step > s ? 'bg-[#FF6B35]' : 'bg-gray-700'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xl">
          {/* Step 1: Select Service */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Select a Service</h2>
              {loading ? (
                <div className="space-y-3">
                  {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}
                </div>
              ) : services.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No services available. Please call us.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                        selectedService?.id === service.id 
                          ? 'border-[#FF6B35] bg-orange-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-gray-500">{service.duration_minutes} minutes</p>
                        </div>
                        <span className="text-xl font-bold text-[#FF6B35]">£{service.price}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <button
                onClick={() => selectedService && setStep(2)}
                disabled={!selectedService}
                className="w-full mt-6 py-3 rounded-lg font-medium bg-[#FF6B35] text-white hover:bg-[#e55a2b] disabled:bg-gray-200 disabled:text-gray-500"
              >
                Continue →
              </button>
            </div>
          )}

          {/* Step 2: Select Date & Time */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Select Date & Time</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <div className="grid grid-cols-4 gap-2">
                  {dates.slice(0, 8).map((date, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(date.toISOString().split('T')[0])}
                      className={`p-3 rounded-lg text-center ${
                        selectedDate === date.toISOString().split('T')[0]
                          ? 'bg-[#FF6B35] text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <div className="text-xs">{date.toLocaleDateString('en-GB', { weekday: 'short' })}</div>
                      <div className="font-bold">{date.getDate()}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.slice(0, 8).map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-2 rounded-lg text-sm ${
                        selectedTime === time
                          ? 'bg-[#FF6B35] text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-blue-700">
                  💡 <strong>Delivery available at checkout</strong> — After your service is complete, you can schedule delivery when paying for your job.
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3 border rounded-lg">Back</button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!selectedDate || !selectedTime}
                  className="flex-1 py-3 bg-[#FF6B35] text-white rounded-lg disabled:bg-gray-200"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Your Details */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bike Details</label>
                  <input
                    type="text"
                    value={formData.bike}
                    onChange={(e) => setFormData({...formData, bike: e.target.value})}
                    placeholder="e.g., Specialized Diverge E5"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={2}
                    placeholder="Any special requests..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(2)} className="flex-1 py-3 border rounded-lg">Back</button>
                <button
                  onClick={() => setStep(4)}
                  disabled={!formData.name || !formData.email || !formData.phone}
                  className="flex-1 py-3 bg-[#FF6B35] text-white rounded-lg disabled:bg-gray-200"
                >
                  Review →
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Confirm Booking</h2>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Service</span>
                  <span className="font-medium">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">{selectedDate && new Date(selectedDate).toLocaleDateString('en-GB')}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Time</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Name</span>
                  <span className="font-medium">{formData.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium">{formData.email}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Phone</span>
                  <span className="font-medium">{formData.phone}</span>
                </div>
                <div className="flex justify-between pt-4 mt-4 border-t">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold text-[#FF6B35]">£{total}</span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-blue-700">
                  🚴 Delivery can be scheduled after your service is complete — you&apos;ll be able to book a delivery slot when you checkout and pay for your job.
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(3)} className="flex-1 py-3 border rounded-lg">Back</button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 py-3 bg-[#FF6B35] text-white rounded-lg hover:bg-[#e55a2b] disabled:bg-gray-200"
                >
                  {submitting ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Need help? Call us at +44 20 7946 0000
        </p>
      </div>
    </div>
  )
}
