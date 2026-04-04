-- Phase 1 Migration: Settings + Leave + Source Tracking
-- Run in Supabase SQL Editor

-- Business Settings
CREATE TABLE IF NOT EXISTS business_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  vat_number TEXT,
  currency TEXT DEFAULT 'GBP',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoice Settings
CREATE TABLE IF NOT EXISTS invoice_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prefix TEXT DEFAULT '#INV-',
  starting_number INTEGER DEFAULT 1,
  tax_rate DECIMAL(5,2) DEFAULT 20.00,
  tax_inclusive BOOLEAN DEFAULT false,
  footer_text TEXT,
  custom_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Booking Settings
CREATE TABLE IF NOT EXISTS booking_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advance_days INTEGER DEFAULT 14,
  default_duration_minutes INTEGER DEFAULT 60,
  default_mechanic_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  auto_accept BOOLEAN DEFAULT false,
  require_terms BOOLEAN DEFAULT true,
  terms_url TEXT,
  privacy_url TEXT,
  show_make BOOLEAN DEFAULT true,
  show_model BOOLEAN DEFAULT true,
  show_serial BOOLEAN DEFAULT false,
  show_year BOOLEAN DEFAULT false,
  show_bike_type BOOLEAN DEFAULT false,
  require_source BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Technician Leave
CREATE TABLE IF NOT EXISTS technician_leave (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  technician_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TEXT NOT NULL DEFAULT '09:00',
  end_time TEXT NOT NULL DEFAULT '17:00',
  type TEXT NOT NULL DEFAULT 'leave' CHECK (type IN ('leave', 'lunch')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add source field to bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS source TEXT;

-- Add technician fields to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS technician_color TEXT DEFAULT '#6B7280',
  ADD COLUMN IF NOT EXISTS technician_role TEXT DEFAULT 'mechanic',
  ADD COLUMN IF NOT EXISTS hourly_goal DECIMAL(5,2) DEFAULT 8.00,
  ADD COLUMN IF NOT EXISTS working_hours JSONB DEFAULT '{"mon":"09:00-17:00","tue":"09:00-17:00","wed":"09:00-17:00","thu":"09:00-17:00","fri":"09:00-17:00","sat":"09:00-17:00","sun":""}';

-- Add booking fields to jobs
ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS booking_date DATE,
  ADD COLUMN IF NOT EXISTS booking_time TEXT,
  ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS duration_hours DECIMAL(4,2) DEFAULT 1,
  ADD COLUMN IF NOT EXISTS job_color TEXT,
  ADD COLUMN IF NOT EXISTS service_id UUID;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_jobs_booking_date ON jobs(booking_date);
CREATE INDEX IF NOT EXISTS idx_jobs_assigned_to ON jobs(assigned_to);
CREATE INDEX IF NOT EXISTS idx_technician_leave_date ON technician_leave(date);
CREATE INDEX IF NOT EXISTS idx_technician_leave_tech ON technician_leave(technician_id);

-- Insert default settings
INSERT INTO business_settings (id, business_name) VALUES (gen_random_uuid(), 'Bike Clinique LTD') ON CONFLICT DO NOTHING;
INSERT INTO invoice_settings (id) VALUES (gen_random_uuid()) ON CONFLICT DO NOTHING;
INSERT INTO booking_settings (id) VALUES (gen_random_uuid()) ON CONFLICT DO NOTHING;
