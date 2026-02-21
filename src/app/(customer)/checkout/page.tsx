'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

interface Job {
  id: string
  job_number: string
  status: string
  notes: string
  created_at: string
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
}

interface DeliverySettings {
  enable_delivery: boolean
  delivery_start_time: string
  delivery_end_time: string
  delivery_days: string[]
  delivery_fee: number
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const jobId = searchParams.get('job')
  
  const [job, setJob] = useState<Job | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Delivery options
  const [wantDelivery, setWantDelivery] = useState(false)
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [deliveryTime, setDeliveryTime] = useState('')
  const [deliveryFee, setDeliveryFee] = useState(0)
  
  const [processing, setProcessing] = useState(false)
  const [paid, setPaid] = useState(false)

  useEffect(() => {
    if (jobId) fetchData()
  }, [jobId])

  const fetchData = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Fetch job
    const jobRes = await fetch(`${supabaseUrl}/rest/v1/jobs?id=eq.${jobId}`, {
      headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
    })
    const jobs = await jobRes.json()
    if (jobs.length > 0) {
      setJob(jobs[0])
      
      // Fetch customer
      const custRes = await fetch(`${supabaseUrl}/rest/v1/customers?id=eq.${jobs[0].customer_id}`, {
        headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
      })
      const custs = await custRes.json()
      if (custs.length > 0) {
        setCustomer(custs[0])
        setDeliveryAddress(custs[0].address || '')
      }
    }

    // Fetch shop settings for delivery
    const shopRes = await fetch(`${supabaseUrl}/rest/v1/shops?select=*&limit=1`, {
      headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
    })
    const shops = await shopRes.json()
    if (shops.length > 0) {
      // Use default settings if not configured
      setDeliverySettings({
        enable_delivery: true,
        delivery_start_time: '16:00',
        delivery_end_time: '19:00',
        delivery_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        delivery_fee: 15
      })
    }
    
    setLoading(false)
  }

  // Generate delivery time slots based on settings
  const getDeliverySlots = () => {
    if (!deliverySettings) return []
    const slots = []
    const start = parseInt(deliverySettings.delivery_start_time.split(':')[0])
    const end = parseInt(deliverySettings.delivery_end_time.split(':')[0])
    for (let h = start; h < end; h++) {
      slots.push(`${h.toString().padStart(2, '0')}:00`)
      slots.push(`${h.toString().padStart(2, '0')}:30`)
    }
    return slots
  }

  // Generate available delivery dates
  const getAvailableDates = () => {
    if (!deliverySettings) return []
    const dates = []
    const today = new Date()
    
    for (let i = 1; i <= 7; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() + i)
      const dayName = d.toLocaleDateString('en-GB', { weekday: 'long' })
      if (deliverySettings.delivery_days.includes(dayName)) {
        dates.push(d)
      }
    }
    return dates
  }

  const handleDeliveryToggle = (enabled: boolean) => {
    setWantDelivery(enabled)
    if (enabled && deliverySettings) {
      setDeliveryFee(deliverySettings.delivery_fee)
    } else {
      setDeliveryFee(0)
    }
  }

  const handlePay = async () => {
    setProcessing(true)
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Update job status to paid
    if (job) {
      await fetch(`${supabaseUrl}/rest/v1/jobs?id=eq.${job.id}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey!,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ status: 'paid' })
      })
    }

    // Create delivery collection if requested
    if (wantDelivery && deliveryAddress && deliveryDate && deliveryTime) {
      await fetch(`${supabaseUrl}/rest/v1/collections`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey!,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          type: 'delivery',
          customer_name: customer?.name || '',
          customer_phone: customer?.phone || '',
          address: deliveryAddress,
          scheduled_date: deliveryDate,
          time_slot: deliveryTime,
          status: 'pending'
        })
      })
    }

    setPaid(true)
    setProcessing(false)
  }

  const serviceTotal = 150 // This would come from job_services in real implementation

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A1A2E] to-[#2D2D4A] py-12 px-4">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-2xl p-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (paid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A1A2E] to-[#2D2D4A] py-12 px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="bg-white rounded-2xl p-12 shadow-xl">
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-3xl font-bold text-[#1A1A2E] mb-4">Payment Complete!</h1>
            <p className="text-gray-600 mb-4">
              Thank you {customer?.name}! Your payment has been processed.
            </p>
            {wantDelivery && (
              <div className="bg-orange-50 p-4 rounded-lg mb-4">
                <p className="text-orange-700 font-medium">🚴 Delivery Scheduled</p>
                <p className="text-sm text-orange-600">
                  Your bike will be delivered on {new Date(deliveryDate).toLocaleDateString('en-GB')} between {deliveryTime}
                </p>
                <p className="text-sm text-orange-600">{deliveryAddress}</p>
              </div>
            )}
            <a href="/" className="text-[#FF6B35] hover:underline">Return to Home →</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A2E] to-[#2D2D4A] py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Checkout</h1>
          <p className="text-gray-400">Job #{job?.job_number || jobId}</p>
        </div>

        <div className="space-y-4">
          {/* Service Summary */}
          <div className="bg-white rounded-xl p-5 shadow-xl">
            <h2 className="font-semibold mb-4">Service Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Full Service</span>
                <span className="font-medium">£150.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Brake Pads (parts)</span>
                <span className="font-medium">£45.00</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-semibold">Subtotal</span>
                <span className="font-semibold">£195.00</span>
              </div>
            </div>
          </div>

          {/* Delivery Option */}
          {deliverySettings?.enable_delivery && (
            <div className="bg-white rounded-xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">🚴 Delivery</h2>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={wantDelivery}
                    onChange={e => handleDeliveryToggle(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B35]"></div>
                </label>
              </div>
              
              {wantDelivery && (
                <div className="space-y-4">
                  <p className="text-xs text-gray-500">
                    Available: {deliverySettings.delivery_start_time} - {deliverySettings.delivery_end_time} on {deliverySettings.delivery_days.join(', ')}
                  </p>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={e => setDeliveryAddress(e.target.value)}
                      placeholder="Enter your delivery address"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Date *</label>
                    <div className="grid grid-cols-4 gap-2">
                      {getAvailableDates().map((date, i) => {
                        const dateStr = date.toISOString().split('T')[0]
                        return (
                          <button
                            key={i}
                            onClick={() => setDeliveryDate(dateStr)}
                            className={`p-2 rounded-lg text-center ${
                              deliveryDate === dateStr
                                ? 'bg-[#FF6B35] text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                          >
                            <div className="text-xs">{date.toLocaleDateString('en-GB', { weekday: 'short' })}</div>
                            <div className="font-bold">{date.getDate()}</div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {deliveryDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Select Time *</label>
                      <div className="grid grid-cols-3 gap-2">
                        {getDeliverySlots().map(time => (
                          <button
                            key={time}
                            onClick={() => setDeliveryTime(time)}
                            className={`p-2 rounded-lg text-sm ${
                              deliveryTime === time
                                ? 'bg-[#FF6B35] text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Total */}
          <div className="bg-white rounded-xl p-5 shadow-xl">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-3xl font-bold text-[#FF6B35]">£{(195 + deliveryFee).toFixed(2)}</span>
            </div>
            {wantDelivery && deliveryFee > 0 && (
              <p className="text-xs text-gray-500 mt-1">Includes £{deliveryFee} delivery fee</p>
            )}
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePay}
            disabled={processing || (wantDelivery && (!deliveryAddress || !deliveryDate || !deliveryTime))}
            className="w-full py-4 bg-[#FF6B35] text-white rounded-xl font-semibold text-lg hover:bg-[#e55a2b] disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {processing ? 'Processing...' : `Pay £${(195 + deliveryFee).toFixed(2)}`}
          </button>

          <p className="text-center text-gray-500 text-xs">
            Secure payment powered by Stripe
          </p>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#1A1A2E] to-[#2D2D4A] py-12 px-4">
        <div className="max-w-lg mx-auto text-white">Loading...</div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
