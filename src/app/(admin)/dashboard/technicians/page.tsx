'use client'

import { useState, useEffect } from 'react'

type TechnicianStatus = 'active' | 'on_leave' | 'unavailable'

interface Technician {
  id: string
  name: string
  email: string
  phone: string
  role: string
  status: TechnicianStatus
  hourly_rate: number
  created_at: string
}

const roleOptions = ['Lead Mechanic', 'Mechanic', 'Apprentice', 'Service Manager', 'Mobile Technician']
const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  on_leave: 'bg-yellow-100 text-yellow-700',
  unavailable: 'bg-red-100 text-red-700',
}
const statusLabels: Record<string, string> = {
  active: 'Active',
  on_leave: 'On Leave',
  unavailable: 'Unavailable',
}

export default function TechniciansPage() {
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Mechanic',
    status: 'active' as TechnicianStatus,
    hourly_rate: 25
  })

  useEffect(() => {
    fetchTechnicians()
  }, [])

  const fetchTechnicians = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    const res = await fetch(`${supabaseUrl}/rest/v1/technicians?select=*&order=created_at.desc`, {
      headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
    })
    const data = await res.json()
    setTechnicians(data || [])
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (editingId) {
      // Update existing
      await fetch(`${supabaseUrl}/rest/v1/technicians?id=eq.${editingId}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey!,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(formData)
      })
    } else {
      // Create new
      await fetch(`${supabaseUrl}/rest/v1/technicians`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey!,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(formData)
      })
    }

    setShowModal(false)
    setEditingId(null)
    setFormData({ name: '', email: '', phone: '', role: 'Mechanic', status: 'active', hourly_rate: 25 })
    fetchTechnicians()
  }

  const handleEdit = (tech: Technician) => {
    setFormData({
      name: tech.name,
      email: tech.email,
      phone: tech.phone,
      role: tech.role,
      status: tech.status,
      hourly_rate: tech.hourly_rate
    })
    setEditingId(tech.id)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this technician?')) return
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    await fetch(`${supabaseUrl}/rest/v1/technicians?id=eq.${id}`, {
      method: 'DELETE',
      headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
    })
    fetchTechnicians()
  }

  const handleStatusChange = async (id: string, status: TechnicianStatus) => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    await fetch(`${supabaseUrl}/rest/v1/technicians?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey!,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ status })
    })
    fetchTechnicians()
  }

  const filteredTechs = filter === 'all' 
    ? technicians 
    : technicians.filter(t => t.status === filter)

  const activeCount = technicians.filter(t => t.status === 'active').length
  const totalWeeklyCost = technicians
    .filter(t => t.status === 'active')
    .reduce((sum, t) => sum + (t.hourly_rate * 40), 0)

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'on_leave', label: 'On Leave' },
    { key: 'unavailable', label: 'Unavailable' },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Technicians</h1>
          <p className="text-sm text-gray-500">{activeCount} active team members</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null)
            setFormData({ name: '', email: '', phone: '', role: 'Mechanic', status: 'active', hourly_rate: 25 })
            setShowModal(true)
          }}
          className="bg-[#FF6B35] text-white px-4 py-2 rounded-lg hover:bg-[#e55a2b] transition-colors flex items-center gap-2"
        >
          <span>+</span> Add Technician
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Team</p>
          <p className="text-2xl font-bold text-[#1A1A2E]">{technicians.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Active Now</p>
          <p className="text-2xl font-bold text-green-600">{activeCount}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Weekly Labor Cost</p>
          <p className="text-2xl font-bold text-[#1A1A2E]">£{totalWeeklyCost.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === f.key 
                ? 'bg-[#1A1A2E] text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Technicians List */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : filteredTechs.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <div className="text-4xl mb-4">👨‍🔧</div>
          <p className="text-gray-500 mb-4">No technicians found</p>
          <button 
            onClick={() => setShowModal(true)}
            className="text-[#FF6B35] hover:underline"
          >
            Add your first technician →
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTechs.map((tech) => (
            <div key={tech.id} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#1A1A2E] rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {tech.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A1A2E]">{tech.name}</h3>
                    <p className="text-sm text-gray-500">{tech.role} • £{tech.hourly_rate}/hr</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <select
                    value={tech.status}
                    onChange={(e) => handleStatusChange(tech.id, e.target.value as TechnicianStatus)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${statusColors[tech.status]}`}
                  >
                    <option value="active">Active</option>
                    <option value="on_leave">On Leave</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(tech)}
                      className="text-gray-400 hover:text-[#FF6B35] transition-colors"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDelete(tech.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex gap-6 text-sm text-gray-500">
                <span>📧 {tech.email}</span>
                <span>📞 {tech.phone}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-4">
              {editingId ? 'Edit Technician' : 'Add New Technician'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                  placeholder="John Smith"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                    placeholder="07123 456789"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                  >
                    {roleOptions.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (£) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.hourly_rate}
                    onChange={e => setFormData({...formData, hourly_rate: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingId(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#e55a2b]"
                >
                  {editingId ? 'Save Changes' : 'Add Technician'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
