import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for the database tables
export type Customer = {
  id: string
  email: string
  phone: string | null
  name: string
  created_at: string
  updated_at: string
}

export type Bike = {
  id: string
  customer_id: string
  make: string
  model: string
  frame_number: string | null
  bike_type: string
  created_at: string
}

export type Job = {
  id: string
  customer_id: string
  bike_id: string
  technician_id: string | null
  status: 'booked_in' | 'waiting_for_work' | 'working_on' | 'bike_ready' | 'collected'
  booked_at: string
  started_at: string | null
  completed_at: string | null
  notes: string | null
  created_at: string
}

export type Service = {
  id: string
  name: string
  description: string | null
  price: number
  duration_minutes: number
  category: string
}

export type Technician = {
  id: string
  name: string
  color: string
  is_active: boolean
}
