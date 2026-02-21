'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
  const pathname = usePathname()

  const handleLogout = () => {
    document.cookie = 'demo_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    window.location.href = '/login'
  }

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1A1A2E] text-white flex flex-col">
        <div className="p-4 border-b border-white/10">
          <Link href="/dashboard" className="block">
            <h1 className="text-xl font-bold text-[#FF6B35]">BikeClinique</h1>
            <p className="text-xs text-gray-400">Workshop Management</p>
          </Link>
        </div>
        
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-[#FF6B35] text-white' 
                    : 'text-gray-300 hover:bg-[#2D2D4A] hover:text-white'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center text-white text-sm font-medium">
              D
            </div>
            <div>
              <p className="text-sm font-medium text-white">Demo User</p>
              <p className="text-xs text-gray-400">Admin</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#2D2D4A] rounded-lg transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                <input 
                  type="text" 
                  placeholder="Search jobs, customers..." 
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:bg-white transition-all"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-500 hover:text-[#FF6B35] transition-colors">
                <span>🔔</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <Link href="/profile" className="p-2 text-gray-500 hover:text-[#FF6B35] transition-colors" title="Shop Profile">
                🚴
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
