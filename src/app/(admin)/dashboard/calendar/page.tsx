'use client'

import { useState, useEffect } from 'react'

interface Booking {
  id: string
  customer_name: string
  customer_phone: string
  bike_details: string
  booking_date: string
  booking_time: string
  collection_needed: boolean
  notes: string
  status: string
}

interface Collection {
  id: string
  customer_name: string
  address: string
  time_slot: string
  scheduled_date: string
  type: string
  status: string
}

export default function CalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    const [bookingsRes, collectionsRes] = await Promise.all([
      fetch(`${supabaseUrl}/rest/v1/bookings?select=*&order=booking_date,booking_time`, {
        headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
      }),
      fetch(`${supabaseUrl}/rest/v1/collections?select=*&order=scheduled_date,time_slot`, {
        headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
      })
    ])

    setBookings(await bookingsRes.json() || [])
    setCollections(await collectionsRes.json() || [])
    setLoading(false)
  }

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const today = new Date()
  
  // Generate 14 days starting from 3 days ago
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - 3 + i)
    return d
  })

  const formatDate = (d: Date) => d.toISOString().split('T')[0]

  const getEventsForDate = (date: Date) => {
    const dateStr = formatDate(date)
    const dayBookings = (bookings || []).filter(b => b.booking_date === dateStr)
    const dayCollections = (collections || []).filter(c => c.scheduled_date === dateStr)
    return [...dayBookings.map(b => ({ ...b, type: 'booking' })), ...dayCollections.map(c => ({ ...c, type: 'collection' }))]
  }

  const selectedEvents = getEventsForDate(new Date(selectedDate))
  const todayStr = formatDate(today)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Calendar</h1>
          <p className="text-sm text-gray-500">{dates.length} days view</p>
        </div>
      </div>

      {/* Week View */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {dates.map((date, i) => {
          const dateStr = formatDate(date)
          const events = getEventsForDate(date)
          const isToday = dateStr === todayStr
          const isSelected = dateStr === selectedDate
          
          return (
            <button
              key={i}
              onClick={() => setSelectedDate(dateStr)}
              className={`text-center p-3 rounded-xl transition-all ${
                isSelected 
                  ? 'bg-[#FF6B35] text-white shadow-lg' 
                  : isToday 
                    ? 'bg-[#1A1A2E] text-white' 
                    : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className={`text-xs ${isSelected ? 'text-white/80' : isToday ? 'text-white/80' : 'text-gray-500'}`}>
                {days[date.getDay()]}
              </div>
              <div className={`text-xl font-bold ${isSelected ? 'text-white' : isToday ? 'text-white' : 'text-[#1A1A2E]'}`}>
                {date.getDate()}
              </div>
              {events.length > 0 && (
                <div className={`mt-1 text-xs ${isSelected ? 'text-white' : 'text-[#FF6B35]'}`}>
                  {events.length} {events.length === 1 ? 'event' : 'events'}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Events for Selected Day */}
      <div className="bg-white rounded-xl p-6">
        <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4">
          {new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : selectedEvents.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">📅</div>
            <p>No events scheduled</p>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedEvents.map((event: any) => (
              <div 
                key={event.id} 
                className={`p-4 rounded-xl border-l-4 shadow-sm ${
                  event.type === 'booking' 
                    ? 'bg-blue-50 border-blue-500' 
                    : 'bg-purple-50 border-purple-500'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      event.type === 'booking' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {event.type === 'booking' ? 'Booking' : event.type}
                    </span>
                    <span className="text-sm font-medium text-gray-600">
                      {event.booking_time || event.time_slot || 'All day'}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    event.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    event.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {event.status || 'scheduled'}
                  </span>
                </div>
                <p className="font-semibold text-[#1A1A2E] mt-2">{event.customer_name}</p>
                {(event.bike_details || event.address) && (
                  <p className="text-sm text-gray-600">{event.bike_details || event.address}</p>
                )}
                {event.notes && (
                  <p className="text-sm text-gray-500 mt-1">{event.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
