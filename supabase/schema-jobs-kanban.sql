-- BikeClinique Jobs Kanban Schema
-- HubTiger-style 7-column status system

-- Jobs table with HubTiger statuses
-- Drop and recreate for fresh setup (or use ALTER for existing)

ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_status_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_status_check CHECK (
  status IN (
    'booked_in',
    'waiting_for_work', 
    'waiting_client',
    'waiting_parts',
    'working_on',
    'bike_ready',
    'collected'
  )
);

-- Add priority column if not exists
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal' CHECK (priority IN ('urgent', 'high', 'normal'));

-- Add service_type column
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS service_type TEXT;

-- Add scheduled_date column
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS scheduled_date TIMESTAMPTZ;

-- Add bike_model column for quick reference
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS bike_model TEXT;

-- Add checklist JSONB column for service checklist
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS checklist JSONB DEFAULT '{}';

-- Create index for status filtering
CREATE INDEX IF NOT EXISTS idx_jobs_status_kanban ON jobs(status);

-- Seed some sample services
INSERT INTO services (name, price, duration_minutes, is_active) VALUES
  ('Minimum Service', 45.00, 30, true),
  ('Full Service', 85.00, 60, true),
  ('Advanced Service', 150.00, 90, true),
  ('Bike Overhaul', 250.00, 180, true),
  ('Wheel True', 25.00, 20, true),
  ('Puncture/Fit Tyre', 15.00, 15, true),
  ('Brake Service', 35.00, 30, true),
  ('Gear Tune', 30.00, 25, true),
  ('Chain Replacement', 20.00, 15, true),
  ('Safety Check', 25.00, 20, true)
ON CONFLICT DO NOTHING;

-- Sample technicians
INSERT INTO profiles (id, name, role) VALUES
  (uuid_generate_v4(), 'Dave', 'mechanic'),
  (uuid_generate_v4(), 'Sarah', 'mechanic'),
  (uuid_generate_v4(), 'Mike', 'mechanic')
ON CONFLICT DO NOTHING;
