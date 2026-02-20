'use client'

import { useState } from 'react'

interface Service {
  id: string
  name: string
  category: string
  price: number
  duration: number
  description: string
}

const mockServices: Service[] = [
  { id: '1', name: 'Full Service', category: 'Service', price: 150, duration: 90, description: 'Complete bike service including gears, brakes, and lubrication' },
  { id: '2', name: 'Gear Tune', category: 'Service', price: 45, duration: 30, description: 'Gear indexing and adjustment' },
  { id: '3', name: 'Brake Service', category: 'Service', price: 55, duration: 30, description: 'Brake pad replacement and adjustment' },
  { id: '4', name: 'Tyre Change', category: 'Labour', price: 15, duration: 15, description: 'Per tyre - tube and labour' },
  { id: '5', name: 'Chain Replace', category: 'Labour', price: 25, duration: 20, description: 'Chain replacement including lubricant' },
  { id: '6', name: 'Puncture Repair', category: 'Labour', price: 12, duration: 15, description: 'Inner tube replacement' },
]

const categories = ['All', 'Service', 'Labour', 'Repair', 'Accessory']

export default function ServicesPage() {
  const [filter, setFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)

  const filtered = filter === 'All' ? mockServices : mockServices.filter(s => s.category === filter)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Services & Pricing</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#FF6B35] text-white px-4 py-2 rounded-lg hover:bg-[#e55a2b] transition-colors"
        >
          + Add Service
        </button>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
              filter === cat ? 'bg-[#1A1A2E] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((service) => (
          <div key={service.id} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-[#1A1A2E]">{service.name}</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{service.category}</span>
              </div>
              <span className="text-lg font-bold text-[#FF6B35]">£{service.price}</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{service.description}</p>
            <div className="flex justify-between items-center pt-3 border-t">
              <span className="text-sm text-gray-500">{service.duration} min</span>
              <button className="text-sm text-[#FF6B35] hover:underline">Edit</button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No services in this category
        </div>
      )}
    </div>
  )
}
