'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export const dynamic = 'force-dynamic'

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClient()
  const [error, setError] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      const { error } = await supabase.auth.getSession()
      
      if (error) {
        setError(error.message)
      } else {
        // Successful auth, redirect to dashboard
        router.push('/dashboard')
      }
    }

    handleCallback()
  }, [router, supabase])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <a href="/login" className="text-[#FF6B35] hover:underline">
            Back to login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#FF6B35] border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-600">Setting up your account...</p>
      </div>
    </div>
  )
}
