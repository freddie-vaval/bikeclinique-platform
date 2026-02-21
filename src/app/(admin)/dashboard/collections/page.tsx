'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Collection {
  id: string
  type: string
  customer_name: string
  customer_phone: string
  address: string
  time_slot: string
  scheduled_date: string
  status: string
  job_id: string
  notes: string
  created_at: string
}

const statusFlow = ['pending', 'driver_assigned', 'in_transit', 'collected', 'delivered', 'completed']

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  driver_assigned: 'Driver Assigned',
  in_transit: 'In Transit',
  collected: 'Bike Collected',
  delivered: 'Delivered',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  driver_assigned: 'bg-blue-100 text-blue-700 border-blue-300',
  in_transit: 'bg-purple-100 text-purple-700 border-purple-300',
  collected: 'bg-orange-100 text-orange-700 border-orange-300',
  delivered: 'bg-green-100 text-green-700 border-green-300',
  completed: 'bg-gray-100 text-gray-700 border-gray-300',
  cancelled: 'bg-red-100 text-red-700 border-red-300',
}

const timeSlots = [
  { label: 'Morning (8-12)', value: '08:00-12:00' },
  { label: 'Midday (12-14)', value: '12:00-14:00' },
  { label: 'Afternoon (14-18)', value: '14:00-18:00' },
  { label: 'Evening (18-20)', value: '18:00-20:00' },
]

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [view, setView] = useState<'list' | 'kanban'>('list')
  const [showModal, setShowModal] = useState(false)
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null)
  const [formData, setFormData] = useState({
    type: 'collection',
    customer_name: '',
    customer_phone: '',
    address: '',
    time_slot: '',
    scheduled_date: new Date().toISOString().split('T')[0],
    notes: ''
  })

  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    const res = await fetch(`${supabaseUrl}/rest/v1/collections?select=*&order=scheduled_date,time_slot`, {
      headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
    })
    setCollections(await res.json() || [])
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    await fetch(`${supabaseUrl}/rest/v1/collections`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey!,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        type: formData.type,
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        address: formData.address,
        time_slot: formData.time_slot,
        scheduled_date: formData.scheduled_date,
        notes: formData.notes,
        status: 'pending'
      })
    })

    setShowModal(false)
    setFormData({
      type: 'collection',
      customer_name: '',
      customer_phone: '',
      address: '',
      time_slot: '',
      scheduled_date: new Date().toISOString().split('T')[0],
      notes: ''
    })
    fetchCollections()
  }

  const updateStatus = async (id: string, status: string) => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    await fetch(`${supabaseUrl}/rest/v1/collections?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey!,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ status })
    })
    fetchCollections()
    setSelectedCollection(null)
  }

  const filtered = collections.filter(c => {
    if (filter === 'all') return true
    if (filter === 'collection') return c.type === 'collection'
    if (filter === 'delivery') return c.type === 'delivery'
    return c.status === filter
  })

  const today = new Date().toISOString().split('T')[0]
  const todayCollections = collections.filter(c => c.scheduled_date === today)
  
  const pending = collections.filter(c => c.status === 'pending').length
  const inTransit = collections.filter(c => c.status === 'in_transit').length
  const completed = collections.filter(c => c.status === 'completed').length

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Collections & Deliveries</h1>
          <p className="text-sm text-gray-500">Manage bike pickups and drop-offs</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'list' ? 'bg-white shadow text-[#1A1A2E]' : 'text-gray-500'}`}
            >
              📋 List
            </button>
            <button
              onClick={() => setView('kanban')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'kanban' ? 'bg-white shadow text-[#1A1A2E]' : 'text-gray-500'}`}
            >
              📊 Board
            </button>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-[#FF6B35] text-white px-4 py-2 rounded-lg hover:bg-[#e55a2b] transition-colors flex items-center gap-2"
          >
            <span>+</span> Schedule Collection
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">📋</div>
            <div>
              <p className="text-2xl font-bold text-[#1A1A2E]">{pending}</p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">🚚</div>
            <div>
              <p className="text-2xl font-bold text-[#1A1A2E]">{inTransit}</p>
              <p className="text-xs text-gray-500">In Transit</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">✅</div>
            <div>
              <p className="text-2xl font-bold text-[#1A1A2E]">{completed}</p>
              <p className="text-xs text-gray-500">Completed Today</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">📅</div>
            <div>
              <p className="text-2xl font-bold text-[#1A1A2E]">{todayCollections.length}</p>
              <p className="text-xs text-gray-500">Today's Runs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'All' },
          { key: 'collection', label: 'Collections' },
          { key: 'delivery', label: 'Deliveries' },
          { key: 'pending', label: 'Pending' },
          { key: 'in_transit', label: 'In Transit' },
          { key: 'completed', label: 'Completed' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              filter === f.key ? 'bg-[#1A1A2E] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Kanban View */}
      {view === 'kanban' && (
        <div className="grid grid-cols-4 gap-4">
          {statusFlow.map(status => (
            <div key={status} className="bg-gray-100 rounded-xl p-3">
              <h3 className="font-medium text-sm text-gray-600 mb-3 px-2">
                {statusLabels[status]} ({filtered.filter(c => c.status === status).length})
              </h3>
              <div className="space-y-2">
                {filtered.filter(c => c.status === status).map(col => (
                  <div 
                    key={col.id}
                    onClick={() => setSelectedCollection(col)}
                    className="bg-white rounded-lg p-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{col.type === 'collection' ? '📥' : '📤'}</span>
                      <span className="font-medium text-sm truncate">{col.customer_name}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{col.address}</p>
                    <p className="text-xs text-gray-400 mt-1">{col.time_slot} • {col.scheduled_date}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="space-y-3">
          {loading ? (
            [1,2,3].map(i => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <div className="text-4xl mb-4">🚚</div>
              <p className="text-gray-500 mb-4">No collections scheduled</p>
              <button onClick={() => setShowModal(true)} className="text-[#FF6B35] hover:underline">
                Schedule a collection →
              </button>
            </div>
          ) : (
            filtered.map((collection) => (
              <div 
                key={collection.id} 
                onClick={() => setSelectedCollection(collection)}
                className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                      collection.type === 'collection' ? 'bg-blue-100' : 'bg-purple-100'
                    }`}>
                      {collection.type === 'collection' ? '📥' : '📤'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${statusColors[collection.status] || 'bg-gray-100'}`}>
                          {statusLabels[collection.status] || collection.status}
                        </span>
                        <span className="text-xs text-gray-400 uppercase">{collection.type}</span>
                      </div>
                      <h3 className="font-semibold text-[#1A1A2E] mt-1">{collection.customer_name}</h3>
                      <p className="text-sm text-gray-500">{collection.address}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[#1A1A2E]">{collection.time_slot || 'Anytime'}</p>
                    <p className="text-sm text-gray-500">
                      {collection.scheduled_date ? new Date(collection.scheduled_date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) : 'Today'}
                    </p>
                    {collection.customer_phone && (
                      <a href={`tel:${collection.customer_phone}`} className="text-xs text-[#FF6B35] hover:underline">
                        📞 {collection.customer_phone}
                      </a>
                    )}
                  </div>
                </div>
                {collection.notes && (
                  <p className="mt-3 text-sm text-gray-500 bg-gray-50 p-2 rounded">{collection.notes}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selectedCollection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-[#1A1A2E]">Collection Details</h2>
              <button onClick={() => setSelectedCollection(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl">{selectedCollection.type === 'collection' ? '📥' : '📤'}</span>
                <div>
                  <p className="font-semibold">{selectedCollection.customer_name}</p>
                  <p className="text-sm text-gray-500">{selectedCollection.address}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium">{selectedCollection.scheduled_date}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Time Slot</p>
                  <p className="font-medium">{selectedCollection.time_slot || 'Anytime'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium">{selectedCollection.customer_phone || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="font-medium">{statusLabels[selectedCollection.status] || selectedCollection.status}</p>
                </div>
              </div>

              {selectedCollection.notes && (
                <div>
                  <p className="text-xs text-gray-500">Notes</p>
                  <p className="text-sm">{selectedCollection.notes}</p>
                </div>
              )}

              {/* Status Actions */}
              <div className="border-t pt-4 mt-4">
                <p className="text-sm font-medium mb-3">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {statusFlow.map(status => (
                    <button
                      key={status}
                      onClick={() => updateStatus(selectedCollection.id, status)}
                      disabled={selectedCollection.status === status}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border-2 transition-colors ${
                        selectedCollection.status === status
                          ? statusColors[status] + ' border-current'
                          : 'border-gray-200 hover:border-[#FF6B35]'
                      }`}
                    >
                      {statusLabels[status]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button className="flex-1 py-2 border rounded-lg hover:bg-gray-50 text-sm">
                  📞 Call Customer
                </button>
                <button className="flex-1 py-2 border rounded-lg hover:bg-gray-50 text-sm">
                  📍 View Map
                </button>
                <button 
                  onClick={() => updateStatus(selectedCollection.id, 'cancelled')}
                  className="flex-1 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm"
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-4">Schedule Collection/Delivery</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                >
                  <option value="collection">📥 Collection (Customer drops off)</option>
                  <option value="delivery">📤 Delivery (Bike goes to customer)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={formData.customer_name}
                  onChange={e => setFormData({...formData, customer_name: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.customer_phone}
                  onChange={e => setFormData({...formData, customer_phone: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.scheduled_date}
                    onChange={e => setFormData({...formData, scheduled_date: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
                  <select
                    value={formData.time_slot}
                    onChange={e => setFormData({...formData, time_slot: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B30"
                  >
                    <option value="">Select time...</option>
                    {timeSlots.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#e55a2b]"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
