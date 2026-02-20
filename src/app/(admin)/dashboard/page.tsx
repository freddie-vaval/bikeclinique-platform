export default function DashboardPage() {
  const stats = [
    { label: 'Open Jobs', value: '12', icon: '🔧', color: 'bg-blue-500' },
    { label: 'Ready for Collection', value: '5', icon: '✅', color: 'bg-green-500' },
    { label: 'Collections Today', value: '8', icon: '🚚', color: 'bg-orange-500' },
    { label: 'Revenue (MTD)', value: '£4,250', icon: '💰', color: 'bg-purple-500' },
  ]

  const recentJobs = [
    { id: '#171', customer: 'Steve Brookes', bike: 'Specialized Diverge', status: 'Working On', time: '12:40' },
    { id: '#170', customer: 'Mark Gleeson', bike: 'Ribble Aero 883', status: 'Bike Ready', time: '11:30' },
    { id: '#169', customer: 'John Keighley', bike: 'Cannondale', status: 'Waiting for Parts', time: '10:15' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1A1A2E] mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center text-white`}>
                {stat.icon}
              </span>
            </div>
            <p className="text-2xl font-bold text-[#1A1A2E]">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Jobs */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4">Recent Jobs</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-sm text-gray-500">
              <th className="pb-3">Job</th>
              <th className="pb-3">Customer</th>
              <th className="pb-3">Bike</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {recentJobs.map((job) => (
              <tr key={job.id} className="border-b last:border-0">
                <td className="py-3 font-medium">{job.id}</td>
                <td className="py-3">{job.customer}</td>
                <td className="py-3">{job.bike}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    job.status === 'Working On' ? 'bg-blue-100 text-blue-700' :
                    job.status === 'Bike Ready' ? 'bg-green-100 text-green-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {job.status}
                  </span>
                </td>
                <td className="py-3 text-gray-500">{job.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
