'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const statusColors: Record<string, string> = {
  booked_in: 'bg-gray-100 text-gray-700',
  waiting_for_work: 'bg-yellow-100 text-yellow-700',
  working_on: 'bg-blue-100 text-blue-700',
  bike_ready: 'bg-green-100 text-green-700',
  collected: 'bg-purple-100 text-purple-700',
}

interface Job {
  id: string
  job_number: string
  customer_name: string
  bike_details: string
  status: string
  booked_at: string
}

interface Booking {
  id: string
  customer_name: string
  booking_date: string
  booking_time: string
  status: string
}

export default function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      // Fetch jobs
      const jobsRes = await fetch(`${supabaseUrl}/rest/v1/jobs?select=*&order=created_at.desc&limit=5`, {
        headers: {
          'apikey': supabaseKey!,
          'Authorization': `Bearer ${supabaseKey}`
        }
      })
      const jobsData = await jobsRes.json()

      // Fetch customers for names
      const custRes = await fetch(`${supabaseUrl}/rest/v1/customers?select=id,name`, {
        headers: {
          'apikey': supabaseKey!,
          'Authorization': `Bearer ${supabaseKey}`
        }
      })
      const customers = await custRes.json()

      // Map customer names to jobs
      const jobsWithNames = (jobsData || []).map((job: any) => {
        const customer = customers?.find((c: any) => c.id === job.customer_id)
        return {
          ...job,
          customer_name: customer?.name || 'Unknown'
        }
      })
      setJobs(jobsWithNames)

      // Fetch today's bookings
      const today = new Date().toISOString().split('T')[0]
      const bookingsRes = await fetch(`${supabaseUrl}/rest/v1/bookings?booking_date=eq.${today}&select=*&order=booking_time`, {
        headers: {
          'apikey': supabaseKey!,
          'Authorization': `Bearer ${supabaseKey}`
        }
      })
      setBookings(await bookingsRes.json() || [])

    } catch (err) {
      console.error('Error fetching data:', err)
    }
    setLoading(false)
  }

  const stats = [
    { label: 'Open Jobs', value: jobs.filter(j => !['collected', 'bike_ready'].includes(j.status)).length || '0', icon: '🔧', color: 'bg-blue-500' },
    { label: 'Ready for Collection', value: jobs.filter(j => j.status === 'bike_ready').length || '0', icon: '✅', color: 'bg-green-500' },
    { label: 'Today\'s Bookings', value: bookings.length || '0', icon: '📅', color: 'bg-orange-500' },
    { label: 'Total Jobs', value: jobs.length || '0', icon: '📋', color: 'bg-purple-500' },
  ]

  const formatStatus = (status: string) => status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Dashboard</h1>
          <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <Link href="/dashboard/jobs" className="bg-[#FF6B35] text-white px-4 py-2 rounded-lg hover:bg-[#e55a2b] transition-colors">
          + New Job
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white text-xl`}>
                {stat.icon}
              </span>
            </div>
            <p className="text-3xl font-bold text-[#1A1A2E]">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#1A1A2E]">Recent Jobs</h2>
            <Link href="/dashboard/jobs" className="text-sm text-[#FF6B35] hover:underline">View all</Link>
          </div>
          {loading ? (
            <div className="animate-pulse space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-12 bg-gray-100 rounded-lg" />)}
            </div>
          ) : jobs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No jobs yet</p>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <Link key={job.id} href={`/dashboard/jobs/${job.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-medium text-[#1A1A2E]">{job.job_number || '#'}</p>
                    <p className="text-sm text-gray-500">{job.customer_name}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs ${statusColors[job.status] || 'bg-gray-100 text-gray-700'}`}>
                    {formatStatus(job.status)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#1A1A2E]">Today&apos;s Schedule</h2>
            <Link href="/dashboard/bookings" className="text-sm text-[#FF6B35] hover:underline">View all</Link>
          </div>
          {loading ? (
            <div className="animate-pulse space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-12 bg-gray-100 rounded-lg" />)}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No bookings today</p>
              <Link href="/book" className="text-[#FF6B35] hover:underline text-sm">Share booking link →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-medium text-[#FF6B35]">{booking.booking_time}</span>
                    <div>
                      <p className="font-medium text-[#1A1A2E]">{booking.customer_name}</p>
                      <p className="text-xs text-gray-500 capitalize">{booking.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-gradient-to-r from-[#1A1A2E] to-[#2D2D4A] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-4">
          <Link href="/dashboard/jobs" className="bg-white/10 hover:bg-white/20 text-white p-4 rounded-lg text-center transition-colors">
            <span className="text-2xl block mb-1">🔧</span>
            <span className="text-sm">New Job</span>
          </Link>
          <Link href="/dashboard/customers" className="bg-white/10 hover:bg-white/20 text-white p-4 rounded-lg text-center transition-colors">
            <span className="text-2xl block mb-1">👤</span>
            <span className="text-sm">Add Customer</span>
          </Link>
          <Link href="/book" className="bg-white/10 hover:bg-white/20 text-white p-4 rounded-lg text-center transition-colors">
            <span className="text-2xl block mb-1">📅</span>
            <span className="text-sm">Booking Link</span>
          </Link>
          <Link href="/dashboard/reports" className="bg-white/10 hover:bg-white/20 text-white p-4 rounded-lg text-center transition-colors">
            <span className="text-2xl block mb-1">📊</span>
            <span className="text-sm">Reports</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
