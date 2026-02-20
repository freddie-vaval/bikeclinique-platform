'use client'

import { useState } from 'react'

interface CalendarEvent {
  id: string
  title: string
  time: string
  type: 'collection' | 'delivery' | 'work' | 'pickup'
  customer: string
  address?: string
  bike?: string
}

const mockEvents: CalendarEvent[] = [
  { id: '1', title: 'Collection', time: '07:00-08:00', type: 'collection', customer: 'Mark Gleeson', address: '115A Penwith Road' },
  { id: '2', title: 'Work', time: '08:00-09:30', type: 'work', customer: 'Mark Gleeson', bike: 'Ribble Aero 883' },
  { id: '3', title: 'Work', time: '12:40-13:20', type: 'work', customer: 'Steve Brookes', bike: 'Specialized Diverge' },
  { id: '4', title: 'Pick-up', time: 'All-day', type: 'pickup', customer: 'Steve Brookes', bike: 'Specialized Diverge' },
  { id: '5', title: 'Delivery', time: '16:00-17:00', type: 'delivery', customer: 'Sarah Smith', address: '42 High Street' },
]

const typeColors = {
  collection: 'bg-blue-100 border-blue-300 text-blue-700',
  delivery: 'bg-purple-100 border-purple-300 text-purple-700',
  work: 'bg-green-100 border-green-300 text-green-700',
  pickup: 'bg-orange-100 border-orange-300 text-orange-700',
}

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const dates = Array.from({ length: 7 }, (_, i) => {
  const d = new Date()
  d.setDate(d.getDate() - 3 + i)
  return d
})

export default function CalendarPage() {
  const [view, setView] = useState<'agenda' | 'day'>('agenda')

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Calendar</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setView('agenda')}
            className={`px-4 py-2 rounded-lg text-sm ${view === 'agenda' ? 'bg-[#1A1A2E] text-white' : 'bg-white text-gray-600'}`}
          >
            Agenda
          </button>
          <button
            onClick={() => setView('day')}
            className={`px-4 py-2 rounded-lg text-sm ${view === 'day' ? 'bg-[#1A1A2E] text-white' : 'bg-white text-gray-600'}`}
          >
            Day
          </button>
        </div>
      </div>

      {/* Week View */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {dates.map((date, i) => (
          <div key={i} className={`text-center p-2 rounded-lg ${i === 3 ? 'bg-[#FF6B35] text-white' : 'bg-white'}`}>
            <div className={`text-xs ${i === 3 ? 'text-white/80' : 'text-gray-500'}`}>{days[date.getDay()]}</div>
            <div className={`text-lg font-bold ${i === 3 ? 'text-white' : 'text-[#1A1A2E]'}`}>{date.getDate()}</div>
          </div>
        ))}
      </div>

      {/* Events */}
      <div className="space-y-3">
        {mockEvents.map((event) => (
          <div key={event.id} className={`p-4 rounded-xl border-l-4 bg-white shadow-sm ${typeColors[event.type].split(' ')[0]} ${typeColors[event.type].split(' ')[1]}`}>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[event.type]}`}>
                    {event.title}
                  </span>
                  <span className="text-sm text-gray-500">{event.time}</span>
                </div>
                <p className="font-semibold mt-1">{event.customer}</p>
                {'bike' in event && <p className="text-sm text-gray-600">{event.bike}</p>}
                {'address' in event && <p className="text-sm text-gray-500">{event.address}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
