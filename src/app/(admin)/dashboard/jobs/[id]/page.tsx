'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

type JobStatus = 'booked_in' | 'waiting_for_work' | 'working_on' | 'bike_ready' | 'collected'

const mockJob = {
  id: '#171',
  customer: {
    name: 'Steve Brookes',
    email: 'steve@email.com',
    phone: '+44 7123 456789',
  },
  bike: {
    make: 'Specialized',
    model: 'Women\'s Diverge E5 Comp',
    frame: 'WT345678',
    type: 'Road',
  },
  services: [
    { name: 'Pinnacle Laterite Advance Service', price: 150, duration: 90 },
  ],
  technician: 'Freddie',
  status: 'working_on' as JobStatus,
  booked_at: '2026-02-20',
  started_at: '2026-02-20 08:30',
  notes: 'Customer requested priority service. New brake pads needed.',
  parts: [
    { name: 'Brake Pads - SwissStop', cost: 25, retail: 45 },
  ],
}

const statusLabels: Record<JobStatus, string> = {
  booked_in: 'Booked In',
  waiting_for_work: 'Waiting for Work',
  working_on: 'Working On',
  bike_ready: 'Bike Ready',
  collected: 'Collected',
}

const statusColors: Record<JobStatus, string> = {
  booked_in: 'bg-gray-100 text-gray-700 border-gray-300',
  waiting_for_work: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  working_on: 'bg-blue-100 text-blue-700 border-blue-300',
  bike_ready: 'bg-green-100 text-green-700 border-green-300',
  collected: 'bg-purple-100 text-purple-700 border-purple-300',
}

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [status, setStatus] = useState<JobStatus>(mockJob.status)
  const [notes, setNotes] = useState(mockJob.notes)

  const laborTotal = mockJob.services.reduce((sum, s) => sum + s.price, 0)
  const partsTotal = mockJob.parts.reduce((sum, p) => sum + p.retail, 0)
  const total = laborTotal + partsTotal

  const handleStatusChange = (newStatus: JobStatus) => {
    setStatus(newStatus)
    // TODO: Save to Supabase
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700">
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">{mockJob.id}</h1>
        <span className={`px-3 py-1 rounded-full text-sm border ${statusColors[status]}`}>
          {statusLabels[status]}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Customer</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{mockJob.customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{mockJob.customer.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{mockJob.customer.email}</p>
              </div>
            </div>
          </div>

          {/* Bike Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Bike</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Make & Model</p>
                <p className="font-medium">{mockJob.bike.make} {mockJob.bike.model}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Frame Number</p>
                <p className="font-medium font-mono">{mockJob.bike.frame}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bike Type</p>
                <p className="font-medium">{mockJob.bike.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Technician</p>
                <p className="font-medium">{mockJob.technician}</p>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Services</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-gray-500">
                  <th className="pb-2">Service</th>
                  <th className="pb-2">Duration</th>
                  <th className="pb-2 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {mockJob.services.map((service, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-3">{service.name}</td>
                    <td className="py-3 text-gray-500">{service.duration} min</td>
                    <td className="py-3 text-right">£{service.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Parts */}
          {mockJob.parts.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Parts</h2>
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-500">
                    <th className="pb-2">Part</th>
                    <th className="pb-2 text-right">Cost</th>
                    <th className="pb-2 text-right">Retail</th>
                  </tr>
                </thead>
                <tbody>
                  {mockJob.parts.map((part, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-3">{part.name}</td>
                      <td className="py-3 text-right text-gray-500">£{part.cost}</td>
                      <td className="py-3 text-right">£{part.retail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Notes */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-32 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              placeholder="Add notes..."
            />
          </div>
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-6">
          {/* Status Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Update Status</h2>
            <div className="space-y-2">
              {(Object.keys(statusLabels) as JobStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`w-full p-3 rounded-lg text-left text-sm border transition-colors ${
                    status === s
                      ? statusColors[s] + ' border-2'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {statusLabels[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Labor</span>
                <span>£{laborTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Parts</span>
                <span>£{partsTotal}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-[#FF6B35]">£{total}</span>
              </div>
            </div>
            <button className="w-full mt-4 bg-[#FF6B35] text-white py-3 rounded-lg hover:bg-[#e55a2b] transition-colors">
              Create Invoice
            </button>
          </div>

          {/* Dates */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Dates</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500">Booked</p>
                <p className="font-medium">{mockJob.booked_at}</p>
              </div>
              <div>
                <p className="text-gray-500">Started</p>
                <p className="font-medium">{mockJob.started_at}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
