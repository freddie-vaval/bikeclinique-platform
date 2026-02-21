'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type JobStatus = 'booked_in' | 'waiting_for_work' | 'working_on' | 'bike_ready' | 'collected'

interface Job {
  id: string
  job_number: string
  customer_id: string
  bike_id: string
  technician_id: string
  status: JobStatus
  booked_at: string
  notes: string
}

interface Customer {
  id: string
  name: string
}

interface Bike {
  id: string
  make: string
  model: string
}

const statusLabels: Record<string, string> = {
  booked_in: 'Booked In',
  waiting_for_work: 'Waiting for Work',
  working_on: 'Working On',
  bike_ready: 'Bike Ready',
  collected: 'Collected',
}

const statusColors: Record<string, string> = {
  booked_in: 'bg-gray-100 text-gray-700',
  waiting_for_work: 'bg-yellow-100 text-yellow-700',
  working_on: 'bg-blue-100 text-blue-700',
  bike_ready: 'bg-green-100 text-green-700',
  collected: 'bg-purple-100 text-purple-700',
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [bikes, setBikes] = useState<Bike[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    customer_id: '',
    bike_details: '',
    notes: '',
    booking_date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    const [jobsRes, customersRes, bikesRes] = await Promise.all([
      fetch(`${supabaseUrl}/rest/v1/jobs?select=*&order=created_at.desc&limit=50`, {
        headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
      }),
      fetch(`${supabaseUrl}/rest/v1/customers?select=id,name`, {
        headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
      }),
      fetch(`${supabaseUrl}/rest/v1/bikes?select=id,make,model`, {
        headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
      })
    ])

    setJobs(await jobsRes.json() || [])
    setCustomers(await customersRes.json() || [])
    setBikes(await bikesRes.json() || [])
    setLoading(false)
  }

  const getCustomerName = (id: string) => customers.find(c => c.id === id)?.name || 'Unknown'
  const getBikeDetails = (id: string) => {
    const bike = bikes.find(b => b.id === id)
    return bike ? `${bike.make} ${bike.model}` : 'No bike'
  }

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault()
    const jobNumber = `#${Date.now().toString().slice(-4)}`
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    await fetch(`${supabaseUrl}/rest/v1/jobs`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey!,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        job_number: jobNumber,
        customer_id: formData.customer_id,
        bike_id: formData.bike_details || null,
        status: 'booked_in',
        booked_at: formData.booking_date,
        notes: formData.notes
      })
    })

    setShowModal(false)
    setFormData({ customer_id: '', bike_details: '', notes: '', booking_date: new Date().toISOString().split('T')[0] })
    fetchData()
  }

  const filteredJobs = filter === 'all' ? jobs : jobs.filter(j => j.status === filter)

  const filters = [
    { key: 'all', label: 'All Jobs' },
    { key: 'booked_in', label: 'Booked In' },
    { key: 'working_on', label: 'Working On' },
    { key: 'bike_ready', label: 'Ready' },
    { key: 'collected', label: 'Collected' },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Jobs</h1>
          <p className="text-sm text-gray-500">{filteredJobs.length} jobs</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#FF6B35] text-white px-4 py-2 rounded-lg hover:bg-[#e55a2b] transition-colors flex items-center gap-2"
        >
          <span>+</span> New Job
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f.key 
                ? 'bg-[#1A1A2E] text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <div className="text-4xl mb-4">🔧</div>
          <p className="text-gray-500 mb-4">{filter === 'all' ? 'No jobs yet' : 'No jobs in this status'}</p>
          <button 
            onClick={() => setShowModal(true)}
            className="text-[#FF6B35] hover:underline"
          >
            Create your first job →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredJobs.map((job) => (
            <Link 
              key={job.id} 
              href={`/dashboard/jobs/${job.id}`}
              className="block bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all hover:translate-x-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#1A1A2E] rounded-lg flex items-center justify-center text-white font-bold">
                    {job.job_number || '#'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A1A2E]">{getCustomerName(job.customer_id)}</h3>
                    <p className="text-sm text-gray-500">{getBikeDetails(job.bike_id)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[job.status] || 'bg-gray-100'}`}>
                    {statusLabels[job.status] || job.status}
                  </span>
                  <span className="text-sm text-gray-400">
                    {job.booked_at ? new Date(job.booked_at).toLocaleDateString('en-GB') : ''}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* New Job Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-4">Create New Job</h2>
            <form onSubmit={handleCreateJob} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label>
                <select
                  required
                  value={formData.customer_id}
                  onChange={e => setFormData({...formData, customer_id: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                >
                  <option value="">Select customer...</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Booking Date *</label>
                <input
                  type="date"
                  required
                  value={formData.booking_date}
                  onChange={e => setFormData({...formData, booking_date: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                  placeholder="Customer requests, special instructions..."
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
                  Create Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
