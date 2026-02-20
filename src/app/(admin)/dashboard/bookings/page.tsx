'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Booking {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  bike_details: string
  booking_date: string
  booking_time: string
  collection_needed: boolean
  notes: string
  status: string
  created_at: string
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all')
  const supabase = createClient()

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) {
      setBookings(data)
    }
    setLoading(false)
  }

  const updateStatus = async (id: string, status: string) => {
    await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)

    fetchBookings()
  }

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter)

  const pendingCount = bookings.filter(b => b.status === 'pending').length

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Bookings</h1>
          <p className="text-sm text-gray-500">Manage online bookings</p>
        </div>
        <button 
          onClick={fetchBookings}
          className="bg-[#FF6B35] text-white px-4 py-2 rounded-lg hover:bg-[#e55a2b]"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-[#1A1A2E]">{bookings.length}</p>
          <p className="text-sm text-gray-500">Total Bookings</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
          <p className="text-sm text-gray-500">Pending</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-blue-600">{bookings.filter(b => b.status === 'confirmed').length}</p>
          <p className="text-sm text-gray-500">Confirmed</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-green-600">{bookings.filter(b => b.status === 'completed').length}</p>
          <p className="text-sm text-gray-500">Completed</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(['all', 'pending', 'confirmed', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm capitalize ${
              filter === f ? 'bg-[#1A1A2E] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {f} {f !== 'all' && `(${bookings.filter(b => b.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-[#FF6B35] border-t-transparent rounded-full mx-auto" />
          <p className="text-gray-500 mt-2">Loading bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <p className="text-gray-500">No bookings found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-[#1A1A2E]">{booking.customer_name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${statusColors[booking.status]}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Date</p>
                      <p className="font-medium">{booking.booking_date}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Time</p>
                      <p className="font-medium">{booking.booking_time}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Phone</p>
                      <p className="font-medium">{booking.customer_phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Collection</p>
                      <p className="font-medium">{booking.collection_needed ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                  {booking.bike_details && (
                    <p className="text-sm text-gray-500 mt-2">Bike: {booking.bike_details}</p>
                  )}
                  {booking.notes && (
                    <p className="text-sm text-gray-500 mt-2">Notes: {booking.notes}</p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(booking.id, 'confirmed')}
                      className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                    >
                      Confirm
                    </button>
                  )}
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => updateStatus(booking.id, 'completed')}
                      className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                    >
                      Complete
                    </button>
                  )}
                  {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                    <button
                      onClick={() => updateStatus(booking.id, 'cancelled')}
                      className="px-3 py-1.5 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Booked: {new Date(booking.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
