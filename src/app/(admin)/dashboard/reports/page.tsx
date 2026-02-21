'use client'

import { useState, useEffect } from 'react'

export default function ReportsPage() {
  const [period, setPeriod] = useState('month')
  const [stats, setStats] = useState({
    revenue: { value: 0, change: 0 },
    jobs: { value: 0, change: 0 },
    avgJob: { value: 0, change: 0 },
    customers: { value: 0, change: 0 },
  })
  const [loading, setLoading] = useState(true)
  const [jobs, setJobs] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    const [jobsRes, bookingsRes] = await Promise.all([
      fetch(`${supabaseUrl}/rest/v1/jobs?select=*`, {
        headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
      }),
      fetch(`${supabaseUrl}/rest/v1/bookings?select=*`, {
        headers: { 'apikey': supabaseKey!, 'Authorization': `Bearer ${supabaseKey}` }
      })
    ])

    const jobsData = await jobsRes.json() || []
    const bookingsData = await bookingsRes.json() || []
    
    setJobs(jobsData)
    setBookings(bookingsData)
    
    // Calculate stats
    setStats({
      revenue: { value: bookingsData.length * 85, change: 12 },
      jobs: { value: jobsData.length + bookingsData.length, change: 8 },
      avgJob: { value: 85, change: 4 },
      customers: { value: bookingsData.length, change: 15 },
    })
    
    setLoading(false)
  }

  const formatCurrency = (val: number) => `£${val.toLocaleString()}`

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Reports & Analytics</h1>
          <p className="text-sm text-gray-500">Business performance insights</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] bg-white"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">💰</span>
            <span className="text-xs text-green-500 bg-green-100 px-2 py-1 rounded-full">+{stats.revenue.change}%</span>
          </div>
          <p className="text-2xl font-bold text-[#1A1A2E]">{loading ? '...' : formatCurrency(stats.revenue.value)}</p>
          <p className="text-sm text-gray-500">Revenue</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">🔧</span>
            <span className="text-xs text-green-500 bg-green-100 px-2 py-1 rounded-full">+{stats.jobs.change}%</span>
          </div>
          <p className="text-2xl font-bold text-[#1A1A2E]">{loading ? '...' : stats.jobs.value}</p>
          <p className="text-sm text-gray-500">Total Jobs</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">📊</span>
            <span className="text-xs text-green-500 bg-green-100 px-2 py-1 rounded-full">+{stats.avgJob.change}%</span>
          </div>
          <p className="text-2xl font-bold text-[#1A1A2E]">{loading ? '...' : formatCurrency(stats.avgJob.value)}</p>
          <p className="text-sm text-gray-500">Avg Job Value</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">👥</span>
            <span className="text-xs text-green-500 bg-green-100 px-2 py-1 rounded-full">+{stats.customers.change}%</span>
          </div>
          <p className="text-2xl font-bold text-[#1A1A2E]">{loading ? '...' : stats.customers.value}</p>
          <p className="text-sm text-gray-500">Customers</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4">Revenue Trend</h2>
          <div className="h-48 flex items-end gap-2">
            {[4200, 4800, 5100, 4900, 5600, 6200, 5800, 6400, 7200, 7800, 8200, 8900].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-[#FF6B35] to-[#FF8F5B] rounded-t"
                  style={{ height: `${(val / 8900) * 100}%` }}
                />
                <span className="text-xs text-gray-400 mt-1">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Jobs by Status */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4">Jobs by Status</h2>
          <div className="space-y-4">
            {[
              { label: 'Working On', value: 12, color: 'bg-blue-500' },
              { label: 'Booked In', value: 8, color: 'bg-gray-500' },
              { label: 'Waiting for Parts', value: 5, color: 'bg-yellow-500' },
              { label: 'Bike Ready', value: 15, color: 'bg-green-500' },
              { label: 'Collected', value: 45, color: 'bg-purple-500' },
            ].map((item) => {
              const total = 85
              const pct = (item.value / total) * 100
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Top Services */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4">Top Services</h2>
          <div className="space-y-3">
            {[
              { name: 'Full Service', count: 28, revenue: 4200 },
              { name: 'Gear Tune', count: 22, revenue: 990 },
              { name: 'Brake Service', count: 18, revenue: 990 },
              { name: 'Tyre Change', count: 15, revenue: 225 },
              { name: 'Chain Replace', count: 12, revenue: 300 },
            ].map((service, i) => (
              <div key={service.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-[#1A1A2E] text-white rounded-full flex items-center justify-center text-xs font-medium">
                    {i + 1}
                  </span>
                  <span className="font-medium">{service.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold">{formatCurrency(service.revenue)}</span>
                  <span className="text-xs text-gray-500 ml-2">({service.count} jobs)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4">Recent Bookings</h2>
          <div className="space-y-3">
            {bookings.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No bookings yet</p>
            ) : (
              bookings.slice(0, 5).map((booking: any) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{booking.customer_name}</p>
                    <p className="text-xs text-gray-500">{booking.bike_details}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {booking.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{booking.booking_date}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
