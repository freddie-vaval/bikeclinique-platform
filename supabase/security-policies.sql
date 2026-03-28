-- BikeClinique Platform - Security Policies Fix
-- Run this in your Supabase SQL Editor

-- ============================================
-- PROFILES (already has policies, verify)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Admins can do everything
CREATE POLICY "Admins can do everything" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================
-- SHOPS
-- ============================================

ALTER TABLE shops ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can do everything" ON shops;

-- Anyone authenticated can view shops
CREATE POLICY "Authenticated users can view shops" ON shops FOR SELECT TO authenticated USING (true);

-- Only admins can modify
CREATE POLICY "Admins can manage shops" ON shops FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================
-- CUSTOMERS
-- ============================================

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Users can view customers for their shop
CREATE POLICY "Users can view customers" ON customers FOR SELECT USING (
  shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid())
);

-- Users can insert customers for their shop
CREATE POLICY "Users can insert customers" ON customers FOR INSERT WITH CHECK (
  shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid())
);

-- Users can update customers for their shop
CREATE POLICY "Users can update customers" ON customers FOR UPDATE USING (
  shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid())
);

-- Users can delete customers for their shop
CREATE POLICY "Users can delete customers" ON customers FOR DELETE USING (
  shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid())
);

-- ============================================
-- BIKES
-- ============================================

ALTER TABLE bikes ENABLE ROW LEVEL SECURITY;

-- View bikes for customers in same shop
CREATE POLICY "Users can view bikes" ON bikes FOR SELECT USING (
  customer_id IN (SELECT id FROM customers WHERE shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid()))
);

CREATE POLICY "Users can insert bikes" ON bikes FOR INSERT WITH CHECK (
  customer_id IN (SELECT id FROM customers WHERE shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid()))
);

CREATE POLICY "Users can update bikes" ON bikes FOR UPDATE USING (
  customer_id IN (SELECT id FROM customers WHERE shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid()))
);

CREATE POLICY "Users can delete bikes" ON bikes FOR DELETE USING (
  customer_id IN (SELECT id FROM customers WHERE shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid()))
);

-- ============================================
-- SERVICE CATEGORIES
-- ============================================

ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view categories" ON service_categories FOR SELECT USING (
  shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid())
);

CREATE POLICY "Users can manage categories" ON service_categories FOR ALL USING (
  shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid())
);

-- ============================================
-- SERVICES
-- ============================================

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view services" ON services FOR SELECT USING (
  shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid())
);

CREATE POLICY "Users can manage services" ON services FOR ALL USING (
  shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid())
);

-- ============================================
-- JOBS
-- ============================================

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- View jobs for your shop
CREATE POLICY "Users can view jobs" ON jobs FOR SELECT USING (
  shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid())
);

-- Create jobs for your shop
CREATE POLICY "Users can insert jobs" ON jobs FOR INSERT WITH CHECK (
  shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid())
);

-- Update jobs for your shop
CREATE POLICY "Users can update jobs" ON jobs FOR UPDATE USING (
  shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid())
);

-- Delete jobs for your shop
CREATE POLICY "Users can delete jobs" ON jobs FOR DELETE USING (
  shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid())
);

-- ============================================
-- JOB SERVICES
-- ============================================

ALTER TABLE job_services ENABLE ROW LEVEL SECURITY;

-- Link to jobs user can access
CREATE POLICY "Users can manage job_services" ON job_services FOR ALL USING (
  job_id IN (SELECT id FROM jobs WHERE shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid()))
);

-- ============================================
-- JOB PARTS
-- ============================================

ALTER TABLE job_parts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage job_parts" ON job_parts FOR ALL USING (
  job_id IN (SELECT id FROM jobs WHERE shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid()))
);

-- ============================================
-- PARTS/INVENTORY
-- ============================================

ALTER TABLE parts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view parts" ON parts FOR SELECT USING (
  shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid())
);

CREATE POLICY "Users can manage parts" ON parts FOR ALL USING (
  shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid())
);

-- ============================================
-- COLLECTIONS
-- ============================================

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view collections" ON collections FOR SELECT USING (
  shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid())
);

CREATE POLICY "Users can manage collections" ON collections FOR ALL USING (
  shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid())
);

-- ============================================
-- BOOKINGS (Public - for website forms)
-- ============================================

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Anyone can create bookings
CREATE POLICY "Anyone can create bookings" ON bookings FOR INSERT WITH CHECK (true);

-- Users can view/update their shop's bookings
CREATE POLICY "Users can view bookings" ON bookings FOR SELECT USING (
  shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid())
);

CREATE POLICY "Users can update bookings" ON bookings FOR UPDATE USING (
  shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid())
);

-- ============================================
-- GENERATED CONTENT
-- ============================================

ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view content" ON generated_content FOR SELECT USING (
  shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid())
);

CREATE POLICY "Users can manage content" ON generated_content FOR ALL USING (
  shop_id IN (SELECT shop_id FROM profiles WHERE id = auth.uid())
);

-- ============================================
-- AUTH - Allow public sign up
-- ============================================

-- Allow anyone to sign up (disable if you want invite-only)
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow sign ups" ON auth.users FOR INSERT WITH CHECK (true);

-- ============================================
-- VERIFY ALL POLICIES
-- ============================================

SELECT 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename;
