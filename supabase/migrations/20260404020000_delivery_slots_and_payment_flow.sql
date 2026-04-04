-- Delivery Slots + Payment Flow Migration
-- Run in Supabase SQL Editor

-- Delivery slots (shop sets these)
CREATE TABLE IF NOT EXISTS delivery_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  capacity INTEGER DEFAULT 1,
  booked_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'full', 'disabled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add delivery fields to jobs
ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'pending', 'paid')),
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS delivery_slot_id UUID REFERENCES delivery_slots(id),
  ADD COLUMN IF NOT EXISTS delivery_status TEXT DEFAULT 'none' CHECK (delivery_status IN ('none', 'pending', 'booked', 'out_for_delivery', 'delivered')),
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,
  job_id UUID REFERENCES jobs(id),
  customer_id UUID REFERENCES customers(id),
  subtotal DECIMAL(10,2) DEFAULT 0,
  vat_rate DECIMAL(5,2) DEFAULT 20.00,
  vat_amount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  issue_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  paid_date DATE,
  notes TEXT,
  sent_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SMS log
CREATE TABLE IF NOT EXISTS sms_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id),
  customer_id UUID REFERENCES customers(id),
  channel TEXT DEFAULT 'sms',
  message TEXT NOT NULL,
  twilio_sid TEXT,
  status TEXT DEFAULT 'sent',
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_delivery_slots_date ON delivery_slots(date);
CREATE INDEX IF NOT EXISTS idx_delivery_slots_profile ON delivery_slots(profile_id);
CREATE INDEX IF NOT EXISTS idx_invoices_job ON invoices(job_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_sms_log_job ON sms_log(job_id);
