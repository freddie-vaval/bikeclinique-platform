'use client'

import { useState, useEffect } from 'react'

interface Service {
  id: string
  name: string
  price: number
  duration: number
}

const services: Service[] = [
  { id: '1', name: 'Full Service', price: 150, duration: 90 },
  { id: '2', name: 'Gear Tune', price: 45, duration: 30 },
  { id: '3', name: 'Brake Service', price: 55, duration: 30 },
  { id: '4', name: 'Tyre Change', price: 15, duration: 15 },
  { id: '5', name: 'Chain Replace', price: 25, duration: 20 },
  { id: '6', name: 'Puncture Repair', price: 12, duration: 15 },
]

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
]

export default function BookingPage() {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [collection, setCollection] = useState(false)
  const [paymentRequired, setPaymentRequired] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [clientSecret, setClientSecret] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bike: '',
    notes: '',
  })

  const total = selectedService?.price || 0

  // Generate next 14 days
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i + 1)
    return d
  })

  // Create payment intent when reaching payment step
  const initializePayment = async () => {
    try {
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          customerName: formData.name,
          customerEmail: formData.email,
          serviceName: selectedService?.name,
        }),
      })

      const data = await response.json()
      if (data.clientSecret) {
        setClientSecret(data.clientSecret)
      }
    } catch (error) {
      console.error('Payment initialization failed:', error)
    }
  }

  const handleSubmit = async () => {
    if (paymentRequired && !paymentSuccess) {
      // Payment required but not yet processed
      setPaymentProcessing(true)
      // In production, Stripe Elements would handle the actual payment
      // Here we simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 1500))
      setPaymentSuccess(true)
      setPaymentProcessing(false)
    }

    // Submit booking
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: selectedService?.id,
          serviceName: selectedService?.name,
          date: selectedDate,
          time: selectedTime,
          collection,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          bike: formData.bike,
          notes: formData.notes,
          paid: paymentRequired && paymentSuccess,
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        alert('Booking confirmed! Check your email for confirmation.')
      } else {
        alert('Booking failed. Please try again.')
      }
    } catch (error) {
      console.error('Booking submission failed:', error)
      alert('Booking failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A2E] to-[#2D2D4A] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
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

        {/* Card */}
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          {step === 1 && (
            <>
              <h2 className="text-xl font-semibold mb-4">Select a Service</h2>
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
                        <p className="text-sm text-gray-500">{service.duration} minutes</p>
                      </div>
                      <span className="text-lg font-bold text-[#FF6B35]">£{service.price}</span>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!selectedService}
                className={`w-full mt-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedService
                    ? 'bg-[#FF6B35] text-white hover:bg-[#e55a2b]'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-semibold mb-4">Choose Date & Time</h2>
              
              {/* Date Selection */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Select Date</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {dates.map((date, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(date.toISOString().split('T')[0])}
                      className={`flex-shrink-0 p-3 rounded-lg text-center min-w-[60px] transition-colors ${
                        selectedDate === date.toISOString().split('T')[0]
                          ? 'bg-[#FF6B35] text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <p className="text-xs">{date.toLocaleDateString('en-GB', { weekday: 'short' })}</p>
                      <p className="text-lg font-bold">{date.getDate()}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Select Time</p>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 rounded-lg text-sm transition-colors ${
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

              {/* Collection Toggle */}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={collection}
                    onChange={(e) => setCollection(e.target.checked)}
                    className="w-5 h-5 rounded text-[#FF6B35]"
                  />
                  <div>
                    <p className="font-medium">I need collection/delivery</p>
                    <p className="text-sm text-gray-500">We'll pick up and return your bike</p>
                  </div>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-lg font-medium border hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!selectedDate || !selectedTime}
                  className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                    selectedDate && selectedTime
                      ? 'bg-[#FF6B35] text-white hover:bg-[#e55a2b]'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Continue →
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-xl font-semibold mb-4">Your Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                    placeholder="+44 7123 456789"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bike Details</label>
                  <input
                    type="text"
                    value={formData.bike}
                    onChange={(e) => setFormData({ ...formData, bike: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                    placeholder="e.g., Specialized Diverge E5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                    rows={3}
                    placeholder="Any specific issues or requests..."
                  />
                </div>
              </div>

              {/* Payment Toggle */}
              <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentRequired}
                    onChange={(e) => {
                      setPaymentRequired(e.target.checked)
                      if (e.target.checked) initializePayment()
                    }}
                    className="w-5 h-5 rounded text-purple-600"
                  />
                  <div>
                    <p className="font-medium">Pay now to secure booking</p>
                    <p className="text-sm text-gray-500">Reduce no-shows with upfront payment</p>
                  </div>
                </label>
              </div>

              {/* Summary */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Booking Summary</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-500">Service:</span> {selectedService?.name}</p>
                  <p><span className="text-gray-500">Date:</span> {selectedDate}</p>
                  <p><span className="text-gray-500">Time:</span> {selectedTime}</p>
                  <p><span className="text-gray-500">Collection:</span> {collection ? 'Yes' : 'No'}</p>
                </div>
                <div className="mt-2 pt-2 border-t flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-[#FF6B35]">£{total}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 rounded-lg font-medium border hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    if (paymentRequired) {
                      setStep(4)
                      initializePayment()
                    } else {
                      handleSubmit()
                    }
                  }}
                  className="flex-1 py-3 rounded-lg font-medium bg-[#FF6B35] text-white hover:bg-[#e55a2b]"
                >
                  {paymentRequired ? 'Continue to Payment →' : 'Confirm Booking'}
                </button>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="text-xl font-semibold mb-4">Payment</h2>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  💳
                </div>
                <p className="text-gray-600">Secure payment for £{total}</p>
              </div>

              {/* Payment form placeholder - in production use Stripe Elements */}
              <div className="p-4 border rounded-lg mb-4">
                <p className="text-sm text-gray-500 mb-2">Card details</p>
                <div className="h-10 bg-gray-50 rounded flex items-center px-3">
                  <span className="text-gray-400">•••• •••• •••• 4242</span>
                </div>
              </div>

              {paymentProcessing && (
                <div className="text-center py-4">
                  <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-2" />
                  <p className="text-gray-600">Processing payment...</p>
                </div>
              )}

              {paymentSuccess && (
                <div className="text-center py-4">
                  <span className="text-4xl">✅</span>
                  <p className="text-green-600 font-medium">Payment successful!</p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 rounded-lg font-medium border hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={paymentProcessing}
                  className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                    paymentProcessing
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {paymentProcessing ? 'Processing...' : paymentSuccess ? 'Complete Booking' : `Pay £${total}`}
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                🔒 Secured by Stripe
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Need help? Call us at +44 20 7946 0000
        </p>
      </div>
    </div>
  )
}
