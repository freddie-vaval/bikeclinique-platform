'use client'

import { useState } from 'react'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  bikes: number
  total_jobs: number
  last_visit: string
}

const mockCustomers: Customer[] = [
  { id: 'C001', name: 'Steve Brookes', email: 'steve@email.com', phone: '+44 7123 456789', bikes: 2, total_jobs: 12, last_visit: '2026-02-20' },
  { id: 'C002', name: 'Mark Gleeson', email: 'mark@email.com', phone: '+44 7123 456790', bikes: 1, total_jobs: 8, last_visit: '2026-02-19' },
  { id: 'C003', name: 'John Keighley', email: 'john@email.com', phone: '+44 7123 456791', bikes: 3, total_jobs: 15, last_visit: '2026-02-19' },
  { id: 'C004', name: 'Sarah Smith', email: 'sarah@email.com', phone: '+44 7123 456792', bikes: 1, total_jobs: 5, last_visit: '2026-02-18' },
  { id: 'C005', name: 'Mike Jones', email: 'mike@email.com', phone: '+44 7123 456793', bikes: 2, total_jobs: 3, last_visit: '2026-02-15' },
]

export default function CustomersPage() {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  const filtered = mockCustomers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Customers</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#FF6B35] text-white px-4 py-2 rounded-lg hover:bg-[#e55a2b] transition-colors"
        >
          + Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bikes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jobs</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Visit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-6 py-4">
                  <div className="font-medium text-[#1A1A2E]">{customer.name}</div>
                  <div className="text-xs text-gray-400">{customer.id}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">{customer.email}</div>
                  <div className="text-xs text-gray-400">{customer.phone}</div>
                </td>
                <td className="px-6 py-4 text-sm">{customer.bikes}</td>
                <td className="px-6 py-4 text-sm">{customer.total_jobs}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{customer.last_visit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No customers found
        </div>
      )}
    </div>
  )
}
