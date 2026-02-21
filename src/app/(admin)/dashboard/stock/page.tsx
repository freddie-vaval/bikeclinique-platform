'use client'

import { useState, useEffect } from 'react'

interface Part {
  id: string
  name: string
  sku: string
  category: string
  quantity: number
  cost: number
  retail: number
  supplier: string
  reorder_level: number
}

export default function StockPage() {
  const [parts, setParts] = useState<Part[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '', sku: '', category: '', quantity: '', cost: '', retail: '', supplier: '', reorder_level: '5'
  })

  useEffect(() => {
    fetchParts()
  }, [])

  const fetchParts = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    const res = await fetch(`${supabaseUrl}/rest/v1/parts?select=*&order=name`, {
      headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
    })
    setParts(await res.json() || [])
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    await fetch(`${supabaseUrl}/rest/v1/parts`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey!,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        quantity: parseInt(formData.quantity) || 0,
        cost: parseFloat(formData.cost) || 0,
        retail: parseFloat(formData.retail) || 0,
        supplier: formData.supplier,
        reorder_level: parseInt(formData.reorder_level) || 5
      })
    })

    setShowModal(false)
    setFormData({ name: '', sku: '', category: '', quantity: '', cost: '', retail: '', supplier: '', reorder_level: '5' })
    fetchParts()
  }

  const filtered = parts.filter(p => {
    const matchesFilter = filter === 'all' 
      ? true 
      : filter === 'low' 
        ? p.quantity <= (p.reorder_level || 5)
        : filter === 'in_stock'
          ? p.quantity > (p.reorder_level || 5)
          : true
    const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase()) || 
                         p.sku?.toLowerCase().includes(search.toLowerCase()) ||
                         p.category?.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const totalValue = parts.reduce((sum, p) => sum + ((p.quantity || 0) * (p.cost || 0)), 0)
  const lowStock = parts.filter(p => (p.quantity || 0) <= (p.reorder_level || 5)).length
  const categories = [...new Set(parts.map(p => p.category).filter(Boolean))]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Stock / Inventory</h1>
          <p className="text-sm text-gray-500">{parts.length} parts</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#FF6B35] text-white px-4 py-2 rounded-lg hover:bg-[#e55a2b] transition-colors flex items-center gap-2"
        >
          <span>+</span> Add Part
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-3xl font-bold text-[#1A1A2E]">{parts.length}</p>
          <p className="text-sm text-gray-500">Total Parts</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-3xl font-bold text-[#1A1A2E]">£{totalValue.toFixed(0)}</p>
          <p className="text-sm text-gray-500">Stock Value (Cost)</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className={`text-3xl font-bold ${lowStock > 0 ? 'text-red-500' : 'text-green-500'}`}>{lowStock}</p>
          <p className="text-sm text-gray-500">Low Stock Items</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search parts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
          />
        </div>
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'All' },
            { key: 'in_stock', label: 'In Stock' },
            { key: 'low', label: 'Low Stock' }
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === f.key ? 'bg-[#1A1A2E] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Parts Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white rounded-xl p-5 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <div className="text-4xl mb-4">📦</div>
          <p className="text-gray-500 mb-4">{search ? 'No parts found' : 'No parts in inventory'}</p>
          <button onClick={() => setShowModal(true)} className="text-[#FF6B35] hover:underline">
            Add your first part →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((part) => {
            const isLow = (part.quantity || 0) <= (part.reorder_level || 5)
            return (
              <div key={part.id} className={`bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow ${isLow && 'border-2 border-red-200'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-[#1A1A2E]">{part.name}</h3>
                    <p className="text-xs text-gray-500">{part.sku}</p>
                  </div>
                  {isLow && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Low Stock</span>
                  )}
                </div>
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Category</p>
                    <p className="text-sm font-medium">{part.category || '-'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">In Stock</p>
                    <p className={`text-lg font-bold ${isLow ? 'text-red-500' : 'text-green-500'}`}>{part.quantity || 0}</p>
                  </div>
                </div>
                <div className="pt-3 border-t flex justify-between text-sm">
                  <div>
                    <span className="text-gray-500">Cost: </span>
                    <span className="font-medium">£{part.cost}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Retail: </span>
                    <span className="font-medium">£{part.retail}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add Part Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-4">Add Part</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Part Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={e => setFormData({...formData, sku: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qty</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={e => setFormData({...formData, quantity: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost (£)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={e => setFormData({...formData, cost: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Retail (£)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.retail}
                    onChange={e => setFormData({...formData, retail: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                  />
                </div>
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
                  Add Part
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
