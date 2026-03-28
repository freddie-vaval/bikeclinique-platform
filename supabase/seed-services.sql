-- BikeClinique Default Services Seeder
-- Run this in Supabase SQL Editor to create default services

-- First, ensure we have a shop (use a placeholder or create one)
INSERT INTO shops (id, name, slug, address, phone, email)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Bike Clinique',
  'bike-clinique',
  '123 Bike Street, London',
  '020 7946 0000',
  'info@bikeclinique.co.uk'
)
ON CONFLICT (slug) DO NOTHING;

-- Insert default services with known UUIDs
INSERT INTO services (id, shop_id, name, description, price, duration_minutes, is_active) VALUES
(
  '00000000-0000-0000-0000-000000000101',
  '00000000-0000-0000-0000-000000000001',
  'Minimum Service',
  'Basic service check - gears, brakes, tyres, chain lubrication',
  79.00,
  60,
  true
),
(
  '00000000-0000-0000-0000-000000000102',
  '00000000-0000-0000-0000-000000000001',
  'Full Service',
  'Complete service - full inspection, adjustment, deep clean',
  120.00,
  120,
  true
),
(
  '00000000-0000-0000-0000-000000000103',
  '00000000-0000-0000-0000-000000000001',
  'Advance Service',
  'Premium service - premium parts, extended warranty, priority booking',
  150.00,
  150,
  true
),
(
  '00000000-0000-0000-0000-000000000104',
  '00000000-0000-0000-0000-000000000001',
  'Bike Overhaul',
  'Full gold standard overhaul - strip, clean, rebuild with new parts',
  350.00,
  280,
  true
),
(
  '00000000-0000-0000-0000-000000000105',
  '00000000-0000-0000-0000-000000000001',
  'Wheel True',
  'Wheel alignment and tension adjustment',
  40.00,
  30,
  true
),
(
  '00000000-0000-0000-0000-000000000106',
  '00000000-0000-0000-0000-000000000001',
  'Puncture Repair',
  'Fix flat tyre - tube replacement or patch',
  20.00,
  15,
  true
)
ON CONFLICT DO NOTHING;

-- Verify services were created
SELECT id, name, price, duration_minutes FROM services WHERE shop_id = '00000000-0000-0000-0000-000000000001';
