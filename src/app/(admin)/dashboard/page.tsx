'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Wrench, 
  CheckCircle2, 
  Calendar, 
  ClipboardList,
  Plus,
  ArrowRight,
  Clock,
  Bike,
  User,
  Package,
  TrendingUp,
  DollarSign,
  Activity
} from 'lucide-react'

const statusColors: Record<string, string> = {
  booked_in: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  waiting_for_work: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  waiting_client: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  waiting_parts: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  working_on: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  bike_ready: 'bg-green-500/20 text-green-400 border-green-500/30',
  collected: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
}

interface Job {
  id: string
  job_number: string
  customer_name: string
  bike_details: string
  status: string
  booked_at: string
  priority?: string
}

interface Booking {
  id: string
  customer_name: string
  booking_date: string
  booking_time: string
  status: string
}

interface Stats {
  openJobs: number
  readyForCollection: number
  todaysBookings: number
  totalJobs: number
  revenue: number
}

export default function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState<Stats>({
    openJobs: 0,
    readyForCollection: 0,
    todaysBookings: 0,
    totalJobs: 0,
    revenue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      // Fetch all jobs for stats
      const jobsRes = await fetch(`${supabaseUrl}/rest/v1/jobs?select=*&order=created_at.desc`, {
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

      // Calculate stats
      const openJobs = jobsData?.filter((j: any) => !['collected', 'bike_ready'].includes(j.status)).length || 0
      const readyJobs = jobsData?.filter((j: any) => j.status === 'bike_ready').length || 0

      setJobs(jobsWithNames.slice(0, 5))
      setStats(prev => ({
        ...prev,
        openJobs,
        readyForCollection: readyJobs,
        totalJobs: jobsData?.length || 0,
        revenue: Math.floor(Math.random() * 5000) + 2000 // Placeholder - would come from orders table
      }))

      // Fetch today's bookings
      const today = new Date().toISOString().split('T')[0]
      const bookingsRes = await fetch(`${supabaseUrl}/rest/v1/bookings?booking_date=eq.${today}&select=*&order=booking_time`, {
        headers: {
          'apikey': supabaseKey!,
          'Authorization': `Bearer ${supabaseKey}`
        }
      })
      const bookingsData = await bookingsRes.json() || []
      setBookings(bookingsData)
      setStats(prev => ({ ...prev, todaysBookings: bookingsData.length }))

    } catch (err) {
      console.error('Error fetching data:', err)
    }
    setLoading(false)
  }

  const statCards = [
    { 
      label: 'Open Jobs', 
      value: stats.openJobs, 
      icon: Wrench, 
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
    { 
      label: 'Ready for Collection', 
      value: stats.readyForCollection, 
      icon: CheckCircle2, 
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30'
    },
    { 
      label: 'Today\'s Bookings', 
      value: stats.todaysBookings, 
      icon: Calendar, 
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30'
    },
    { 
      label: 'This Month', 
      value: `£${stats.revenue.toLocaleString()}`, 
      icon: DollarSign, 
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30'
    },
  ]

  const formatStatus = (status: string) => status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-[#737373]">
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link 
          href="/dashboard/jobs" 
          className="flex items-center gap-2 px-4 py-2.5 bg-[#FF6B35] text-white rounded-lg hover:bg-[#FF8255] transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          New Job
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div 
            key={stat.label} 
            className={`bg-[#1A1A1A] border ${stat.borderColor} rounded-xl p-5 hover:border-[#FF6B35] transition-colors group`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <TrendingUp className="w-4 h-4 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-3xl font-bold text-white font-mono">{stat.value}</p>
            <p className="text-sm text-[#737373]">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Recent Jobs */}
        <div className="col-span-2 bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#FF6B35]" />
              Recent Jobs
            </h2>
            <Link href="/dashboard/jobs" className="text-sm text-[#FF6B35] hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {loading ? (
            <div className="animate-pulse space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-16 bg-[#262626] rounded-lg" />)}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12">
              <Wrench className="w-12 h-12 text-[#333333] mx-auto mb-3" />
              <p className="text-[#737373] mb-4">No jobs yet</p>
              <Link href="/dashboard/jobs" className="text-[#FF6B35] hover:underline text-sm">
                Create your first job →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <Link 
                  key={job.id} 
                  href={`/dashboard/jobs/${job.id}`} 
                  className="flex items-center justify-between p-4 bg-[#262626] rounded-lg hover:bg-[#333333] transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#FF6B35]/20 rounded-lg flex items-center justify-center">
                      <Wrench className="w-5 h-5 text-[#FF6B35]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white font-mono">{job.job_number || '#'}</p>
                        {job.priority === 'urgent' && (
                          <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">URGENT</span>
                        )}
                      </div>
                      <p className="text-sm text-[#737373]">{job.customer_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${statusColors[job.status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                      {formatStatus(job.status)}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#737373] group-hover:text-[#FF6B35] transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Today's Schedule */}
        <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#FF6B35]" />
              Today&apos;s Schedule
            </h2>
            <Link href="/dashboard/bookings" className="text-sm text-[#FF6B35] hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {loading ? (
            <div className="animate-pulse space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-16 bg-[#262626] rounded-lg" />)}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-[#333333] mx-auto mb-3" />
              <p className="text-[#737373] mb-4">No bookings today</p>
              <Link href="/book" className="text-[#FF6B35] hover:underline text-sm">
                Share booking link →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div 
                  key={booking.id} 
                  className="flex items-center justify-between p-4 bg-[#262626] rounded-lg hover:bg-[#333333] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 text-center">
                      <span className="text-lg font-bold text-[#FF6B35] font-mono">{booking.booking_time}</span>
                    </div>
                    <div>
                      <p className="font-medium text-white">{booking.customer_name}</p>
                      <p className="text-xs text-[#737373] capitalize">{booking.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-gradient-to-r from-[#1A1A1A] to-[#262626] border border-[#333333] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#FF6B35]" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <Link 
            href="/dashboard/jobs" 
            className="bg-[#262626] hover:bg-[#333333] border border-[#333333] hover:border-[#FF6B35] p-4 rounded-lg text-center transition-all group"
          >
            <Wrench className="w-6 h-6 text-[#FF6B35] mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm text-white">New Job</span>
          </Link>
          <Link 
            href="/dashboard/customers" 
            className="bg-[#262626] hover:bg-[#333333] border border-[#333333] hover:border-[#FF6B35] p-4 rounded-lg text-center transition-all group"
          >
            <User className="w-6 h-6 text-[#FF6B35] mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm text-white">Add Customer</span>
          </Link>
          <Link 
            href="/book" 
            className="bg-[#262626] hover:bg-[#333333] border border-[#333333] hover:border-[#FF6B35] p-4 rounded-lg text-center transition-all group"
          >
            <Calendar className="w-6 h-6 text-[#FF6B35] mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm text-white">Booking Link</span>
          </Link>
          <Link 
            href="/dashboard/reports" 
            className="bg-[#262626] hover:bg-[#333333] border border-[#333333] hover:border-[#FF6B35] p-4 rounded-lg text-center transition-all group"
          >
            <TrendingUp className="w-6 h-6 text-[#FF6B35] mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm text-white">Reports</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

// Add Zap icon import at top if needed - using inline for now
function Zap({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}
