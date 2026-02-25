-- Collections/Deliveries table for BikeClinique
-- Created: 2026-02-25
-- Key Hubtiger-style feature for pickup & delivery scheduling

CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  collection_type TEXT NOT NULL CHECK (collection_type IN ('pickup', 'delivery')),
  scheduled_date DATE NOT NULL,
  scheduled_time TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  postcode TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'en_route', 'completed', 'cancelled')),
  notes TEXT,
  driver_id UUID REFERENCES technicians(id),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public read" ON collections FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON collections FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON collections FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON collections FOR DELETE USING (true);

-- Add sample data
INSERT INTO collections (customer_id, collection_type, scheduled_date, scheduled_time, address_line1, city, postcode, contact_name, contact_phone, status)
SELECT 
  c.id,
  'pickup',
  CURRENT_DATE + INTERVAL '1 day',
  '10:00',
  '123 High Street',
  'London',
  'SW1A 1AA',
  c.name,
  c.phone,
  'scheduled'
FROM customers c
LIMIT 2;

-- Add index for faster queries
CREATE INDEX idx_collections_date ON collections(scheduled_date);
CREATE INDEX idx_collections_status ON collections(status);
