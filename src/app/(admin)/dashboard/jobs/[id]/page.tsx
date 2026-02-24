'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

type JobStatus = 'booked_in' | 'waiting_for_work' | 'working_on' | 'bike_ready' | 'collected'

const statusLabels: Record<string, string> = {
  booked_in: 'Booked In',
  waiting_for_work: 'Waiting for Work',
  working_on: 'Working On',
  bike_ready: 'Bike Ready',
  collected: 'Collected',
}

const statusColors: Record<string, string> = {
  booked_in: 'bg-gray-100 text-gray-700 border-gray-300',
  waiting_for_work: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  working_on: 'bg-blue-100 text-blue-700 border-blue-300',
  bike_ready: 'bg-green-100 text-green-700 border-green-300',
  collected: 'bg-purple-100 text-purple-700 border-purple-300',
}

interface Service {
  id: string
  name: string
  price: number
  duration_minutes: number
}

interface JobService {
  id: string
  service_id: string
  service_name: string
  price: number
}

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [job, setJob] = useState<any>(null)
  const [customer, setCustomer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [notes, setNotes] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)
  
  // Services state
  const [availableServices, setAvailableServices] = useState<Service[]>([])
  const [jobServices, setJobServices] = useState<JobService[]>([])
  const [showAddService, setShowAddService] = useState(false)
  const [selectedService, setSelectedService] = useState('')

  useEffect(() => {
    if (params.id) fetchJob()
  }, [params.id])

  const fetchJob = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    const jobRes = await fetch(`${supabaseUrl}/rest/v1/jobs?id=eq.${params.id}`, {
      headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
    })
    const jobsData = await jobRes.json()
    
    if (jobsData && jobsData.length > 0) {
      const jobData = jobsData[0]
      setJob(jobData)
      setNotes(jobData.notes || '')
      
      // Fetch customer
      const custRes = await fetch(`${supabaseUrl}/rest/v1/customers?id=eq.${jobData.customer_id}`, {
        headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
      })
      const custData = await custRes.json()
      if (custData && custData.length > 0) {
        setCustomer(custData[0])
      }
      
      // Fetch available services
      const servRes = await fetch(`${supabaseUrl}/rest/v1/services?is_active=eq.true&select=*`, {
        headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
      })
      const servData = await servRes.json()
      setAvailableServices(servData || [])
      
      // Fetch job services
      const jobServRes = await fetch(`${supabaseUrl}/rest/v1/job_services?job_id=eq.${params.id}&select=*`, {
        headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
      })
      const jobServData = await jobServRes.json()
      setJobServices(jobServData || [])
    }
    setLoading(false)
  }

  const updateStatus = async (newStatus: string) => {
    setUpdating(true)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    await fetch(`${supabaseUrl}/rest/v1/jobs?id=eq.${params.id}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey!,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ 
        status: newStatus,
        ...(newStatus === 'working_on' && { started_at: new Date().toISOString() }),
        ...(newStatus === 'bike_ready' && { completed_at: new Date().toISOString() })
      })
    })
    
    fetchJob()
    setUpdating(false)
  }

  const saveNotes = async () => {
    setSavingNotes(true)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    await fetch(`${supabaseUrl}/rest/v1/jobs?id=eq.${params.id}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey!,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ notes })
    })
    setSavingNotes(false)
  }

  const addService = async () => {
    if (!selectedService) return
    
    const service = availableServices.find(s => s.id === selectedService)
    if (!service) return
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    await fetch(`${supabaseUrl}/rest/v1/job_services`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey!,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        job_id: params.id,
        service_id: service.id,
        price: service.price,
        notes: service.name
      })
    })
    
    setSelectedService('')
    setShowAddService(false)
    fetchJob()
  }

  const removeService = async (jobServId: string) => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    await fetch(`${supabaseUrl}/rest/v1/job_services?id=eq.${jobServId}`, {
      method: 'DELETE',
      headers: {
        'apikey': supabaseKey!,
        'Authorization': `Bearer ${supabaseKey}`
      }
    })
    fetchJob()
  }

  const servicesTotal = jobServices.reduce((sum, s) => sum + (s.price || 0), 0)

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Job not found</p>
        <button onClick={() => router.back()} className="text-[#FF6B35] hover:underline">
          ← Back to Jobs
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700">
            ←
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A2E]">{job.job_number || `#${job.id.slice(0,8)}`}</h1>
            <p className="text-sm text-gray-500">
              Created {new Date(job.created_at).toLocaleDateString('en-GB')}
            </p>
          </div>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-medium border-2 ${statusColors[job.status] || statusColors.booked_in}`}>
          {statusLabels[job.status] || job.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="col-span-2 space-y-6">
          {/* Status Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold mb-4">Update Status</h2>
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(statusLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => updateStatus(key)}
                  disabled={updating || job.status === key}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                    job.status === key
                      ? statusColors[key] + ' border-current'
                      : 'border-gray-200 hover:border-[#FF6B35]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Services</h2>
              <button 
                onClick={() => setShowAddService(true)}
                className="text-sm text-[#FF6B35] hover:underline"
              >
                + Add Service
              </button>
            </div>
            <div className="space-y-3">
              {jobServices.length === 0 ? (
                <p className="text-gray-500 text-sm py-4 text-center">No services added yet</p>
              ) : (
                jobServices.map((js) => (
                  <div key={js.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg group">
                    <div className="flex items-center gap-2">
                      <span>{js.notes || 'Service'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">£{js.price}</span>
                      <button 
                        onClick={() => removeService(js.id)}
                        className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 pt-4 border-t flex justify-between">
              <span className="font-medium">Total</span>
              <span className="text-xl font-bold text-[#FF6B35]">£{servicesTotal}</span>
            </div>
          </div>

          {/* Add Service Modal */}
          {showAddService && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
                <h2 className="text-xl font-bold text-[#1A1A2E] mb-4">Add Service</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Service</label>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                    >
                      <option value="">Choose a service...</option>
                      {availableServices.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} - £{s.price} ({s.duration_minutes} min)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => { setShowAddService(false); setSelectedService(''); }}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addService}
                      disabled={!selectedService}
                      className="flex-1 px-4 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#e55a2b] disabled:opacity-50"
                    >
                      Add Service
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Parts */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Parts Used</h2>
              <button className="text-sm text-[#FF6B35] hover:underline">+ Add Part</button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium">Brake Pads - SwissStop</span>
                  <span className="text-xs text-gray-500 ml-2">×1</span>
                </div>
                <div className="text-right">
                  <span className="font-medium">£45</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Notes</h2>
              <button 
                onClick={saveNotes}
                disabled={savingNotes}
                className="text-sm bg-[#FF6B35] text-white px-3 py-1 rounded hover:bg-[#e55a2b] disabled:opacity-50"
              >
                {savingNotes ? 'Saving...' : 'Save'}
              </button>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this job..."
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              rows={4}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold mb-4">Customer</h2>
            {customer ? (
              <div>
                <p className="font-medium text-lg">{customer.name}</p>
                <p className="text-gray-500 text-sm">{customer.email}</p>
                <p className="text-gray-500 text-sm">{customer.phone}</p>
                {customer.address && (
                  <p className="text-gray-400 text-sm mt-2">{customer.address}</p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No customer linked</p>
            )}
            <button className="mt-4 text-sm text-[#FF6B35] hover:underline">
              View Full Profile →
            </button>
          </div>

          {/* Bike */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold mb-4">Bike</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Make/Model</span>
                <span className="font-medium">-</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Frame</span>
                <span className="font-medium">-</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Type</span>
                <span className="font-medium">-</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold mb-4">Timeline</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Booked</span>
                <span>{job.booked_at ? new Date(job.booked_at).toLocaleDateString('en-GB') : '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Started</span>
                <span>{job.started_at ? new Date(job.started_at).toLocaleDateString('en-GB') : '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Completed</span>
                <span>{job.completed_at ? new Date(job.completed_at).toLocaleDateString('en-GB') : '-'}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold mb-4">Actions</h2>
            <div className="space-y-2">
              <button className="w-full py-2 border rounded-lg hover:bg-gray-50">
                🖨️ Print Invoice
              </button>
              <button className="w-full py-2 border rounded-lg hover:bg-gray-50">
                📧 Send Email
              </button>
              <button className="w-full py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50">
                🗑️ Delete Job
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
