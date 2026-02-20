import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { User } from '@supabase/supabase-js'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle cookie error
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Handle cookie error
          }
        },
      },
    }
  )
}

type Session = {
  user: User
  profile: any
}

export async function getSession(request: NextRequest): Promise<Session | null> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return { user, profile }
}

export async function requireAuth(request: NextRequest): Promise<Session | NextResponse> {
  const session = await getSession(request)

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return session
}

export async function requireRole(request: NextRequest, roles: string[]): Promise<Session | NextResponse> {
  const result = await requireAuth(request)

  // If it's a NextResponse, it's an error/redirect
  if (result instanceof NextResponse) {
    return result
  }

  if (!roles.includes(result.profile?.role || '')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return result
}
