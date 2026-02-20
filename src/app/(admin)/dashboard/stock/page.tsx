'use client'

import { useState } from 'react'

interface Part {
  id: string
  name: string
  sku: string
  category: string
  quantity: number
  cost: number
  retail: number
  supplier: string
}

const mockParts: Part[] = [
  { id: '1', name: 'Brake Pads - SwissStop', sku: 'BRK-SS-001', category: 'Brakes', quantity: 12, cost: 25, retail: 45, supplier: 'Madison' },
  { id: '2', name: 'Inner Tube - 700x25c', sku: 'TUB-700-25', category: 'Tyres', quantity: 24, cost: 6, retail: 12, supplier: 'BSA' },
  { id: '3', name: 'Chain - Shimano 105', sku: 'CHN-105-11', category: 'Drivetrain', quantity: 8, cost: 28, retail: 45, supplier: 'Madison' },
  { id: '4', name: 'Bar Tape - Black', sku: 'TAPE-BLK', category: 'Cockpit', quantity: 15, cost: 8, retail: 18, supplier: 'Extra' },
  { id: '5', name: 'Cables - Gear Set', sku: 'CAB-GEAR', category: 'Cables', quantity: 20, cost: 4, retail: 10, supplier: 'BSA' },
  { id: '6', name: 'Bottom Bracket - BSA', sku: 'BB-BSA', category: 'Drivetrain', quantity: 3, cost: 35, retail: 65, supplier: 'Madison' },
]

const categories = ['All', 'Brakes', 'Tyres', 'Drivetrain', 'Cockpit', 'Cables']

export default function StockPage() {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = mockParts.filter(p => {
    const matchesCategory = filter === 'All' || p.category === filter
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const totalValue = mockParts.reduce((sum, p) => sum + (p.quantity * p.cost), 0)
  const lowStock = mockParts.filter(p => p.quantity < 5).length

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Stock / Inventory</h1>
        <button className="bg-[#FF6B35] text-white px-4 py-2 rounded-lg hover:bg-[#e55a2b] transition-colors">
          + Add Part
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-[#1A1A2E]">{mockParts.length}</p>
          <p className="text-sm text-gray-500">Total Parts</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-[#1A1A2E]">£{totalValue.toFixed(0)}</p>
          <p className="text-sm text-gray-500">Stock Value (Cost)</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className={`text-2xl font-bold ${lowStock > 0 ? 'text-red-500' : 'text-green-500'}`}>{lowStock}</p>
          <p className="text-sm text-gray-500">Low Stock Items</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 max-w-md px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Part</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cost</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Retail</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Margin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((part) => (
              <tr key={part.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{part.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500 font-mono">{part.sku}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{part.category}</td>
                <td className="px-6 py-4">
                  <span className={part.quantity < 5 ? 'text-red-500 font-medium' : ''}>{part.quantity}</span>
                </td>
                <td className="px-6 py-4 text-right">£{part.cost}</td>
                <td className="px-6 py-4 text-right">£{part.retail}</td>
                <td className="px-6 py-4 text-right text-green-600">
                  {((part.retail - part.cost) / part.cost * 100).toFixed(0)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
