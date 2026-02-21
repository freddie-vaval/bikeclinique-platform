'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

interface Bike {
  id: string
  make: string
  model: string
  frame_number: string
  service_history: any
}

interface Service {
  id: string
  name: string
  price: number
  duration_minutes: number
}

interface Booking {
  id: string
  booking_date: string
  booking_time: string
  status: string
  bike_details: string
}

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00',
]

export default function CustomerPortal() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#1A1A2E] to-[#2D2D4A] py-12 px-4">
        <div className="max-w-2xl mx-auto text-white">Loading...</div>
      </div>
    }>
      <CustomerPortalContent />
    </Suspense>
  )
}

function CustomerPortalContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  
  const [customer, setCustomer] = useState<any>(null)
  const [bikes, setBikes] = useState<Bike[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  
  // Booking state
  const [step, setStep] = useState(1)
  const [selectedBikes, setSelectedBikes] = useState<{bike: Bike, service: Service | null}[]>([])
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [formData, setFormData] = useState({ name: '', phone: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (email) fetchData()
  }, [email])

  const fetchData = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Find customer by email
    const custRes = await fetch(`${supabaseUrl}/rest/v1/customers?email=eq.${encodeURIComponent(email || '')}`, {
      headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
    })
    const custs = await custRes.json()
    if (custs.length > 0) {
      setCustomer(custs[0])
      setFormData({ name: custs[0].name || '', phone: custs[0].phone || '', notes: '' })
      
      // Fetch bikes
      const bikeRes = await fetch(`${supabaseUrl}/rest/v1/bikes?customer_id=eq.${custs[0].id}`, {
        headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
      })
      setBikes(await bikeRes.json() || [])
      
      // Fetch bookings
      const bookRes = await fetch(`${supabaseUrl}/rest/v1/bookings?customer_email=eq.${encodeURIComponent(email || '')}&order=booking_date.desc`, {
        headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
      })
      setBookings(await bookRes.json() || [])
    }

    // Fetch services
    const servRes = await fetch(`${supabaseUrl}/rest/v1/services?select=*&is_active=eq.true&order=name`, {
      headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
    })
    setServices(await servRes.json() || [])

    setLoading(false)
  }

  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i + 1)
    return d
  })

  const toggleBike = (bike: Bike) => {
    const exists = selectedBikes.find(sb => sb.bike.id === bike.id)
    if (exists) {
      setSelectedBikes(selectedBikes.filter(sb => sb.bike.id !== bike.id))
    } else {
      setSelectedBikes([...selectedBikes, { bike, service: null }])
    }
  }

  const setBikeService = (bikeId: string, service: Service) => {
    setSelectedBikes(selectedBikes.map(sb => 
      sb.bike.id === bikeId ? { ...sb, service } : sb
    ))
  }

  const handleSubmit = async () => {
    if (!selectedBikes.length || !selectedDate || !selectedTime) return
    
    setSubmitting(true)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    try {
      // Create a booking for each selected bike
      for (const sb of selectedBikes) {
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
            customer_email: email,
            customer_phone: formData.phone,
            bike_details: `${sb.bike.make} ${sb.bike.model}`,
            booking_date: selectedDate,
            booking_time: selectedTime,
            notes: formData.notes + (sb.service ? ` - ${sb.service.name}` : ''),
            status: 'pending'
          })
        })
      }
      setSuccess(true)
      fetchData()
    } catch (err) {
      console.error('Booking error:', err)
    }
    setSubmitting(false)
  }

  const total = selectedBikes.reduce((sum, sb) => sum + (sb.service?.price || 0), 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A1A2E] to-[#2D2D4A] py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A1A2E] to-[#2D2D4A] py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl p-12">
            <div className="text-5xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-[#1A1A2E] mb-2">Customer Not Found</h1>
            <p className="text-gray-500">We couldn't find a customer with that email.</p>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A1A2E] to-[#2D2D4A] py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl p-12">
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-3xl font-bold text-[#1A1A2E] mb-4">Bookings Confirmed!</h1>
            <p className="text-gray-600 mb-4">
              Your {selectedBikes.length} bike{selectedBikes.length > 1 ? 's' : ''} are booked for {new Date(selectedDate).toLocaleDateString('en-GB')} at {selectedTime}.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Confirmation sent to {email}
            </p>
            <button onClick={() => { setSuccess(false); setStep(1); setSelectedBikes([]); }} className="text-[#FF6B35] hover:underline">
              Book More Services →
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A2E] to-[#2D2D4A] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🚴 My Garage</h1>
          <p className="text-gray-400">Welcome back, {customer.name}</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= s ? 'bg-[#FF6B35] text-white' : 'bg-gray-700 text-gray-400'
              }`}>
                {s}
              </div>
              {s < 4 && <div className={`w-10 h-0.5 ${step > s ? 'bg-[#FF6B35]' : 'bg-gray-700'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Step 1: Select Bikes */}
          {step === 1 && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Select Your Bikes</h2>
              <p className="text-sm text-gray-500 mb-4">Choose one or more bikes to service</p>
              
              {bikes.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🚲</div>
                  <p className="text-gray-500 mb-4">No bikes registered yet</p>
                  <button className="text-[#FF6B35] hover:underline">Add a bike →</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {bikes.map((bike) => {
                    const isSelected = selectedBikes.some(sb => sb.bike.id === bike.id)
                    return (
                      <button
                        key={bike.id}
                        onClick={() => toggleBike(bike)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                          isSelected
                            ? 'border-[#FF6B35] bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">🚴</span>
                            <div>
                              <p className="font-medium">{bike.make} {bike.model}</p>
                              <p className="text-sm text-gray-500">{bike.frame_number || 'No frame number'}</p>
                            </div>
                          </div>
                          {isSelected && <span className="text-[#FF6B35]">✓</span>}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}

              <button
                onClick={() => selectedBikes.length && setStep(2)}
                disabled={!selectedBikes.length}
                className="w-full mt-6 py-3 rounded-lg font-medium bg-[#FF6B35] text-white hover:bg-[#e55a2b] disabled:bg-gray-200 disabled:text-gray-500"
              >
                Continue with {selectedBikes.length} bike{selectedBikes.length !== 1 ? 's' : ''} →
              </button>
            </div>
          )}

          {/* Step 2: Select Services */}
          {step === 2 && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Select Service for Each Bike</h2>
              
              <div className="space-y-4">
                {selectedBikes.map((sb, idx) => (
                  <div key={sb.bike.id} className="border rounded-lg p-4">
                    <p className="font-medium mb-3">🚴 {sb.bike.make} {sb.bike.model}</p>
                    <div className="space-y-2">
                      {services.map(service => (
                        <button
                          key={service.id}
                          onClick={() => setBikeService(sb.bike.id, service)}
                          className={`w-full p-3 rounded-lg border text-left flex justify-between items-center ${
                            sb.service?.id === service.id
                              ? 'border-[#FF6B35] bg-orange-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span className="font-medium">{service.name}</span>
                          <span className="text-[#FF6B35] font-bold">£{service.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-[#FF6B35] text-xl">£{total}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="flex-1 py-3 border rounded-lg">Back</button>
                <button
                  onClick={() => setStep(3)}
                  disabled={selectedBikes.some(sb => !sb.service)}
                  className="flex-1 py-3 bg-[#FF6B35] text-white rounded-lg disabled:bg-gray-200"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Select Date & Time */}
          {step === 3 && (
            <div className="p-6">
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
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map(time => (
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Any special requests..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                  rows={2}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(2)} className="flex-1 py-3 border rounded-lg">Back</button>
                <button
                  onClick={() => setStep(4)}
                  disabled={!selectedDate || !selectedTime}
                  className="flex-1 py-3 bg-[#FF6B35] text-white rounded-lg disabled:bg-gray-200"
                >
                  Review →
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Confirm Bookings</h2>
              
              <div className="space-y-3 mb-4">
                {selectedBikes.map(sb => (
                  <div key={sb.bike.id} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{sb.bike.make} {sb.bike.model}</p>
                      <p className="text-sm text-gray-500">{sb.service?.name}</p>
                    </div>
                    <span className="font-bold text-[#FF6B35]">£{sb.service?.price}</span>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">{selectedDate && new Date(selectedDate).toLocaleDateString('en-GB')}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Time</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between pt-2 mt-2 border-t">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold text-[#FF6B35]">£{total}</span>
                </div>
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

        {/* Recent Bookings */}
        {bookings.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Bookings</h2>
            <div className="space-y-3">
              {bookings.slice(0, 5).map(booking => (
                <div key={booking.id} className="bg-white/10 backdrop-blur rounded-lg p-4 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{booking.bike_details}</p>
                      <p className="text-sm text-gray-300">
                        {new Date(booking.booking_date).toLocaleDateString('en-GB')} at {booking.booking_time}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      booking.status === 'completed' ? 'bg-green-500' :
                      booking.status === 'confirmed' ? 'bg-blue-500' :
                      'bg-yellow-500'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
