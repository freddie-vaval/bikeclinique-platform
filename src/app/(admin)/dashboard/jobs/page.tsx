'use client'

import { useState } from 'react'
import Link from 'next/link'

type JobStatus = 'booked_in' | 'waiting_for_work' | 'working_on' | 'bike_ready' | 'collected'

interface Job {
  id: string
  customer: string
  bike: string
  service: string
  technician: string
  status: JobStatus
  booked_at: string
}

const statusLabels: Record<JobStatus, string> = {
  booked_in: 'Booked In',
  waiting_for_work: 'Waiting for Work',
  working_on: 'Working On',
  bike_ready: 'Bike Ready',
  collected: 'Collected',
}

const statusColors: Record<JobStatus, string> = {
  booked_in: 'bg-gray-100 text-gray-700',
  waiting_for_work: 'bg-yellow-100 text-yellow-700',
  working_on: 'bg-blue-100 text-blue-700',
  bike_ready: 'bg-green-100 text-green-700',
  collected: 'bg-purple-100 text-purple-700',
}

// Mock data
const mockJobs: Job[] = [
  { id: '#171', customer: 'Steve Brookes', bike: 'Specialized Diverge', service: 'Full Service', technician: 'Freddie', status: 'working_on', booked_at: '2026-02-20' },
  { id: '#170', customer: 'Mark Gleeson', bike: 'Ribble Aero 883', service: 'Gear Tune', technician: 'Freddie', status: 'bike_ready', booked_at: '2026-02-19' },
  { id: '#169', customer: 'John Keighley', bike: 'Cannondale', service: 'Brake Service', technician: 'Lucio', status: 'waiting_for_work', booked_at: '2026-02-19' },
  { id: '#168', customer: 'Sarah Smith', bike: 'Trek Domane', service: 'Tyre Change', technician: 'Freddie', status: 'collected', booked_at: '2026-02-18' },
  { id: '#167', customer: 'Mike Jones', bike: 'Brompton', service: 'Full Service', technician: 'Lucio', status: 'booked_in', booked_at: '2026-02-21' },
  { id: '#166', customer: 'Emma Wilson', bike: 'Pinarello', service: 'Chain Replace', technician: 'Freddie', status: 'bike_ready', booked_at: '2026-02-17' },
]

export default function JobsPage() {
  const [filter, setFilter] = useState<JobStatus | 'all'>('all')

  const filteredJobs = filter === 'all' ? mockJobs : mockJobs.filter(j => j.status === filter)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Jobs</h1>
        <button className="bg-[#FF6B35] text-white px-4 py-2 rounded-lg hover:bg-[#e55a2b] transition-colors">
          + New Job
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
            filter === 'all' ? 'bg-[#1A1A2E] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          All ({mockJobs.length})
        </button>
        {(Object.keys(statusLabels) as JobStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
              filter === status ? 'bg-[#1A1A2E] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {statusLabels[status]} ({mockJobs.filter(j => j.status === status).length})
          </button>
        ))}
      </div>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJobs.map((job) => (
          <Link key={job.id} href={`/dashboard/jobs/${job.id.replace('#', '')}`}>
          <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-lg font-bold">{job.id}</span>
                <p className="text-sm text-gray-500">{job.booked_at}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[job.status]}`}>
                {statusLabels[job.status]}
              </span>
            </div>
            
            <h3 className="font-semibold text-[#1A1A2E] mb-1">{job.customer}</h3>
            <p className="text-sm text-gray-600 mb-3">{job.bike}</p>
            
            <div className="flex justify-between items-center pt-3 border-t">
              <span className="text-sm text-gray-500">{job.service}</span>
              <span className="text-sm font-medium text-[#FF6B35]">{job.technician}</span>
            </div>
          </div>
          </Link>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No jobs found with this status
        </div>
      )}
    </div>
  )
}
