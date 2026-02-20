'use client'

import { useState } from 'react'

export default function ReportsPage() {
  const [period, setPeriod] = useState('month')

  const stats = {
    revenue: { value: '£12,450', change: '+12%', trend: 'up' },
    jobs: { value: '89', change: '+8%', trend: 'up' },
    avgJob: { value: '£140', change: '+4%', trend: 'up' },
    customers: { value: '42', change: '+15%', trend: 'up' },
  }

  const topServices = [
    { name: 'Full Service', count: 28, revenue: 4200 },
    { name: 'Gear Tune', count: 22, revenue: 990 },
    { name: 'Brake Service', count: 18, revenue: 990 },
    { name: 'Tyre Change', count: 15, revenue: 225 },
    { name: 'Chain Replace', count: 12, revenue: 300 },
  ]

  const technicianPerformance = [
    { name: 'Freddie', jobs: 52, revenue: 7800, rating: 4.8 },
    { name: 'Lucio', jobs: 37, revenue: 4650, rating: 4.6 },
  ]

  const monthlyData = [
    { month: 'Aug', revenue: 8200 },
    { month: 'Sep', revenue: 9100 },
    { month: 'Oct', revenue: 8800 },
    { month: 'Nov', revenue: 10200 },
    { month: 'Dec', revenue: 9500 },
    { month: 'Jan', revenue: 12450 },
  ]

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue))

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Reports & Analytics</h1>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {Object.entries(stats).map(([key, stat]) => (
          <div key={key} className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-[#1A1A2E]">{stat.value}</span>
              <span className={`text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Revenue Trend</h2>
          <div className="h-48 flex items-end gap-2">
            {monthlyData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-[#FF6B35] rounded-t transition-all hover:opacity-80"
                  style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                />
                <span className="text-xs text-gray-500 mt-2">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Services */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Top Services</h2>
          <div className="space-y-3">
            {topServices.map((service, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-[#FF6B35] text-white rounded-full flex items-center justify-center text-xs">
                    {i + 1}
                  </span>
                  <span className="font-medium">{service.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold">£{service.revenue}</span>
                  <span className="text-sm text-gray-500 ml-2">({service.count})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technician Performance */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Technician Performance</h2>
          <div className="space-y-4">
            {technicianPerformance.map((tech, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{tech.name}</h3>
                    <p className="text-sm text-gray-500">{tech.jobs} jobs</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#FF6B35]">£{tech.revenue}</p>
                    <p className="text-sm text-gray-500">⭐ {tech.rating}</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#FF6B35] h-2 rounded-full"
                    style={{ width: `${(tech.revenue / 8000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">3.2 days</p>
              <p className="text-sm text-gray-600">Avg Turnaround</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">94%</p>
              <p className="text-sm text-gray-600">Customer Satisfaction</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">£38</p>
              <p className="text-sm text-gray-600">Avg Parts per Job</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">67%</p>
              <p className="text-sm text-gray-600">Repeat Customers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
