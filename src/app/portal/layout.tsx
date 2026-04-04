import Link from 'next/link';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl">🔧</span>
              <span className="font-bold text-lg tracking-tight text-white">Bike<span className="text-orange-500">Clinique</span></span>
            </Link>
            <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </header>
      <main className="pt-20 pb-16 px-4">
        {children}
      </main>
    </div>
  );
}
