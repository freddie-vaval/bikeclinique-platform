'use client'

import { useState } from 'react'

interface Collection {
  id: string
  type: 'collection' | 'delivery'
  customer: string
  address: string
  time_slot: string
  status: 'pending' | 'in_progress' | 'completed'
  bike: string
}

const mockCollections: Collection[] = [
  { id: '#168', type: 'collection', customer: 'Mark Gleeson', address: '115A Penwith Road, London, SW18 4PY', time_slot: '07:00-08:00', status: 'pending', bike: 'Ribble Aero 883' },
  { id: '#171', type: 'collection', customer: 'Steve Brookes', address: '42 Church Lane', time_slot: 'All-day', status: 'pending', bike: 'Specialized Diverge' },
  { id: '#166', type: 'delivery', customer: 'Sarah Smith', address: '88 Queen Street', time_slot: '16:00-17:00', status: 'pending', bike: 'Trek Domane' },
  { id: '#165', type: 'delivery', customer: 'John Keighley', address: '12 Victoria Road', time_slot: '14:00-15:00', status: 'completed', bike: 'Cannondale' },
]

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
}

export default function CollectionsPage() {
  const [filter, setFilter] = useState<'all' | 'collection' | 'delivery'>('all')

  const filtered = filter === 'all' ? mockCollections : mockCollections.filter(c => c.type === filter)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Collections & Deliveries</h1>
        <button className="bg-[#FF6B35] text-white px-4 py-2 rounded-lg hover:bg-[#e55a2b] transition-colors">
          + Schedule
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-[#1A1A2E]">8</p>
          <p className="text-sm text-gray-500">Today's Collections</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-[#1A1A2E]">3</p>
          <p className="text-sm text-gray-500">Today's Deliveries</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-[#1A1A2E]">5</p>
          <p className="text-sm text-gray-500">Completed</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        {(['all', 'collection', 'delivery'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm capitalize ${filter === f ? 'bg-[#1A1A2E] text-white' : 'bg-white text-gray-600'}`}
          >
            {f === 'all' ? 'All' : f + 's'}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <span className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${item.type === 'collection' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                  {item.type === 'collection' ? '🚚' : '📦'}
                </span>
                <div>
                  <p className="font-semibold">{item.customer}</p>
                  <p className="text-sm text-gray-500">{item.address}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs ${statusColors[item.status]}`}>
                  {item.status.replace('_', ' ')}
                </span>
                <p className="text-sm text-gray-500 mt-1">{item.time_slot}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t flex justify-between items-center">
              <span className="text-sm text-gray-600">{item.bike}</span>
              <span className="text-xs text-gray-400">{item.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
