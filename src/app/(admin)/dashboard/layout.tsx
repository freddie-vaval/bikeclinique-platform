'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Calendar, 
  Wrench, 
  Users, 
  Settings, 
  Package, 
  Truck, 
  BarChart3, 
  MessageSquare, 
  Sparkles,
  ClipboardList,
  LogOut,
  Search,
  Bell,
  Bike
} from 'lucide-react'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Jobs', href: '/dashboard/jobs', icon: ClipboardList },
  { name: 'Bookings', href: '/dashboard/bookings', icon: Calendar },
  { name: 'Technicians', href: '/dashboard/technicians', icon: Wrench },
  { name: 'Customers', href: '/dashboard/customers', icon: Users },
  { name: 'Collections', href: '/dashboard/collections', icon: Truck },
  { name: 'Services', href: '/dashboard/services', icon: Settings },
  { name: 'Stock', href: '/dashboard/stock', icon: Package },
  { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
  { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  { name: 'Content AI', href: '/dashboard/content/generator', icon: Sparkles },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
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
    <div className="flex min-h-screen bg-[#0A0A0A]">
      {/* Sidebar - Industrial */}
      <aside className="w-52 bg-[#141414] border-r-4 border-[#FF3131] flex flex-col">
        <div className="p-4 border-b border-[#2A2A2A]">
          <Link href="/dashboard" className="block">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#FF3131] flex items-center justify-center">
                <Bike className="w-7 h-7 text-black" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-wider text-white">BIKE<br/>CLINIQUE</h1>
              </div>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 p-2 space-y-0 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2.5 transition-all ${
                  isActive 
                    ? 'bg-[#FF3131] text-black font-bold' 
                    : 'text-[#888] hover:bg-[#1C1C1C] hover:text-white font-medium'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{item.name}</span>
                {isActive && <div className="ml-auto w-2 h-2 bg-black"></div>}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-[#2A2A2A] bg-[#0A0A0A]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-[#FF3131] text-black font-bold text-xs flex items-center justify-center">
              FV
            </div>
            <div>
              <p className="text-xs font-bold text-white">Freddie Vaval</p>
              <p className="text-[10px] text-[#666]">OWNER</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-[#666] hover:text-[#FF3131] hover:bg-[#1C1C1C] transition-colors"
          >
            <LogOut className="w-3 h-3" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-[#141414] border-b border-[#2A2A2A] px-5 py-3">
          <div className="flex justify-between items-center">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                <input 
                  type="text" 
                  placeholder="SEARCH JOBS, CUSTOMERS..." 
                  className="w-full pl-10 pr-4 py-2 bg-[#0A0A0A] border border-[#2A2A2A] text-sm text-white placeholder-[#555] focus:border-[#FF3131] focus:outline-none uppercase text-xs font-medium tracking-wider"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative p-2 text-[#666] hover:text-[#FF3131] hover:bg-[#1C1C1C] transition-colors">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF3131]"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-5 overflow-auto bg-[#0A0A0A]">
          {children}
        </div>
      </main>
    </div>
  )
}
