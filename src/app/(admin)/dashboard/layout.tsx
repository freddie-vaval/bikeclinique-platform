import Link from 'next/link'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { name: 'Bookings', href: '/dashboard/bookings', icon: '📅' },
  { name: 'Jobs', href: '/dashboard/jobs', icon: '🔧' },
  { name: 'Calendar', href: '/dashboard/calendar', icon: '📆' },
  { name: 'Customers', href: '/dashboard/customers', icon: '👥' },
  { name: 'Services', href: '/dashboard/services', icon: '⚙️' },
  { name: 'Collections', href: '/dashboard/collections', icon: '🚚' },
  { name: 'Stock', href: '/dashboard/stock', icon: '📦' },
  { name: 'Reports', href: '/dashboard/reports', icon: '📊' },
  { name: 'Messages', href: '/dashboard/messages', icon: '💬' },
  { name: 'Content AI', href: '/dashboard/content', icon: '✨' },
  { name: 'Settings', href: '/dashboard/settings', icon: '⚡' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1A1A2E] text-white p-4">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-[#FF6B35]">BikeClinique</h1>
          <p className="text-xs text-gray-400">Workshop Management</p>
        </div>
        
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-[#2D2D4A] hover:text-white transition-colors"
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
