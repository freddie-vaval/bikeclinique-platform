-- Technicians table for BikeClinique
-- Created: 2026-02-25

CREATE TABLE IF NOT EXISTS technicians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Mechanic',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'on_leave', 'unavailable')),
  hourly_rate INTEGER NOT NULL DEFAULT 25,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;

-- Allow public read access for demo (in production, restrict this)
CREATE POLICY "Allow public read" ON technicians FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON technicians FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON technicians FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON technicians FOR DELETE USING (true);

-- Add some sample data
INSERT INTO technicians (name, email, phone, role, status, hourly_rate) VALUES
  ('Mike Johnson', 'mike@bikeclinique.co.uk', '07700 900123', 'Lead Mechanic', 'active', 35),
  ('Sarah Williams', 'sarah@bikeclinique.co.uk', '07700 900124', 'Mechanic', 'active', 28),
  ('Tom Davies', 'tom@bikeclinique.co.uk', '07700 900125', 'Apprentice', 'active', 18)
ON CONFLICT (email) DO NOTHING;
