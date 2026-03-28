'use client'

import { useState, useEffect } from 'react'

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration_minutes: number
  category_id: string
  is_active: boolean
}

interface Category {
  id: string
  name: string
  icon: string
}

const categoryIcons: Record<string, string> = {
  'repairs': '🔧',
  'servicing': '⚙️',
  'parts': '🛠️',
  'apparel': '🧢',
  'default': '✨'
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration_minutes: '',
    category_id: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    const [servicesRes, catsRes] = await Promise.all([
      fetch(`${supabaseUrl}/rest/v1/services?select=*&order=category_id,name`, {
        headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
      }),
      fetch(`${supabaseUrl}/rest/v1/service_categories?select=*&order=name`, {
        headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
      })
    ])

    setServices(await servicesRes.json() || [])
    setCategories(await catsRes.json() || [])
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    await fetch(`${supabaseUrl}/rest/v1/services`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey!,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        duration_minutes: parseInt(formData.duration_minutes),
        category_id: formData.category_id || null,
        is_active: true
      })
    })

    setShowModal(false)
    setFormData({ name: '', description: '', price: '', duration_minutes: '', category_id: '' })
    fetchData()
  }

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Other'
  const getCategoryIcon = (id: string) => categoryIcons[getCategoryName(id).toLowerCase()] || categoryIcons['default']

  const filtered = filter === 'all' 
    ? services 
    : filter === 'active' 
      ? services.filter(s => s.is_active)
      : services.filter(s => !s.is_active)

  // Group services by category
  const servicesByCategory = filtered.reduce((acc, service) => {
    const cat = service.category_id || 'other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(service)
    return acc
  }, {} as Record<string, Service[]>)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Services</h1>
          <p className="text-sm text-gray-500">{services.length} services • Click a tile to view details</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#FF6B35] text-white px-4 py-2 rounded-lg hover:bg-[#e55a2b] transition-colors flex items-center gap-2"
        >
          <span>+</span> Add Service
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
            !selectedCategory 
              ? 'bg-[#1A1A2E] text-white shadow-lg' 
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          All Services
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedCategory === cat.id 
                ? 'bg-[#1A1A2E] text-white shadow-lg' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <span>{categoryIcons[cat.name.toLowerCase()] || '✨'}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Services Grid - Workshop Style Tiles */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">🔧</div>
          <p className="text-gray-500 mb-4">No services yet</p>
          <button onClick={() => setShowModal(true)} className="text-[#FF6B35] hover:underline font-medium">
            Add your first service →
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(servicesByCategory).map(([catId, catServices]) => (
            <div key={catId}>
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{getCategoryIcon(catId)}</span>
                <h2 className="text-lg font-bold text-[#1A1A2E]">{getCategoryName(catId)}</h2>
                <span className="text-sm text-gray-400">({catServices.length} services)</span>
              </div>
              
              {/* Tiles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {catServices.map((service) => (
                  <div 
                    key={service.id} 
                    className={`group bg-white rounded-2xl p-6 border-2 border-transparent hover:border-[#FF6B35] hover:shadow-xl transition-all cursor-pointer relative overflow-hidden ${
                      !service.is_active && 'opacity-50'
                    }`}
                  >
                    {/* Price Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="text-2xl font-bold text-[#FF6B35]">£{service.price}</span>
                    </div>

                    {/* Service Name */}
                    <h3 className="font-bold text-[#1A1A2E] text-lg mb-1 pr-20">{service.name}</h3>
                    
                    {/* Category Tag */}
                    <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full mb-3">
                      {getCategoryName(service.category_id)}
                    </span>

                    {/* Description */}
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {service.description || 'No description provided'}
                    </p>

                    {/* Footer */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <span>⏱</span>
                        <span>{service.duration_minutes} min</span>
                      </div>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                        service.is_active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {service.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF6B35]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Service Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-4">Add New Service</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Full Service, Brake Repair"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  placeholder="What does this service include? What's included..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (£) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.duration_minutes}
                    onChange={e => setFormData({...formData, duration_minutes: e.target.value})}
                    placeholder="60"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category_id}
                  onChange={e => setFormData({...formData, category_id: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                >
                  <option value="">Select category...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#FF6B35] text-white rounded-lg hover:bg-[#e55a2b] font-medium"
                >
                  Add Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
