-- Add pickup address columns to bookings table
-- Run this in Supabase SQL Editor

ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS pickup_address TEXT,
ADD COLUMN IF NOT EXISTS delivery_postcode TEXT;

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bookings' 
ORDER BY ordinal_position;
