'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Demo bypass
    if (email === 'demo@bikeclinique.co.uk' && password === 'demopassword') {
      document.cookie = 'demo_user=true; path=/; max-age=86400'
      window.location.href = '/dashboard'
      return
    }

    setError('Invalid credentials')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(42,42,42,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(42,42,42,0.3)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF3131] rounded-full blur-[200px] opacity-15" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#39FF14] rounded-full blur-[150px] opacity-10" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#FF3131] mx-auto mb-4 flex items-center justify-center">
            <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <circle cx="5.5" cy="17.5" r="3" />
              <circle cx="18.5" cy="17.5" r="3" />
              <path d="M8.5 17.5L15.5 6.5M15.5 17.5L8.5 6.5" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold tracking-wider text-white">BIKE CLINIQUE</h1>
          <p className="text-xs text-[#FF3131] font-bold tracking-[0.3em] mt-1">WORKSHOP MANAGEMENT</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#141414] border-2 border-[#2A2A2A] p-8">
          <h2 className="text-2xl font-bold mb-6 tracking-wider">SIGN IN</h2>

          {error && (
            <div className="mb-4 p-3 border border-[#FF3131] text-[#FF3131] text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#666] mb-2 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#0A0A0A] border-2 border-[#2A2A2A] text-white focus:border-[#FF3131] outline-none font-bold"
                placeholder="YOU@EXAMPLE.COM"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#666] mb-2 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#0A0A0A] border-2 border-[#2A2A2A] text-white focus:border-[#FF3131] outline-none font-bold"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#FF3131] text-black font-bold text-lg hover:bg-white transition-all hover:scale-[1.02] disabled:opacity-30"
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 border border-[#2A2A2A]">
            <p className="text-xs text-[#666] mb-2 uppercase tracking-wider">Demo credentials:</p>
            <p className="text-xs text-[#888] font-mono">demo@bikeclinique.co.uk</p>
            <p className="text-xs text-[#888] font-mono">demopassword</p>
          </div>
        </div>

        {/* Back link */}
        <p className="text-center mt-6">
          <a href="/" className="text-[#666] hover:text-[#FF3131] text-sm font-bold uppercase tracking-wider">
            ← BACK TO HOME
          </a>
        </p>
      </div>
    </div>
  )
}
