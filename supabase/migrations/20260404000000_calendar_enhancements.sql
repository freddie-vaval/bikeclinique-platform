-- Calendar enhancements migration
-- Run this in Supabase dashboard: SQL Editor

-- Add booking_date, booking_time, assigned_to to jobs
ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS booking_date DATE,
  ADD COLUMN IF NOT EXISTS booking_time TEXT,
  ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS duration_hours DECIMAL(4,2) DEFAULT 1,
  ADD COLUMN IF NOT EXISTS job_color TEXT;

-- Copy from bookings table if linked
UPDATE jobs j
SET
  booking_date = b.booking_date,
  booking_time = b.booking_time
FROM bookings b
WHERE b.job_id = j.id;

-- Create technician_leave table
CREATE TABLE IF NOT EXISTS technician_leave (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  technician_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TEXT NOT NULL DEFAULT '12:00',
  end_time TEXT NOT NULL DEFAULT '13:00',
  type TEXT NOT NULL DEFAULT 'leave' CHECK (type IN ('leave', 'lunch')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_jobs_booking_date ON jobs(booking_date);
CREATE INDEX IF NOT EXISTS idx_jobs_assigned_to ON jobs(assigned_to);
CREATE INDEX IF NOT EXISTS idx_technician_leave_date ON technician_leave(date);
CREATE INDEX IF NOT EXISTS idx_technician_leave_technician ON technician_leave(technician_id);

-- Add color field to profiles for technicians
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS technician_color TEXT DEFAULT '#6B7280',
  ADD COLUMN IF NOT EXISTS technician_role TEXT DEFAULT 'mechanic',
  ADD COLUMN IF NOT EXISTS hourly_goal DECIMAL(5,2) DEFAULT 8.00,
  ADD COLUMN IF NOT EXISTS working_hours JSONB DEFAULT '{"mon":"09:00-17:00","tue":"09:00-17:00","wed":"09:00-17:00","thu":"09:00-17:00","fri":"09:00-17:00","sat":"09:00-17:00","sun":""}';
