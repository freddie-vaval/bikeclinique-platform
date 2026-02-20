-- BikeClinique Platform - Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set search path to include extensions
SET search_path TO public, extensions, auth;

-- ============================================
-- USERS & AUTH
-- ============================================

-- Custom profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'mechanic', 'customer')),
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CORE BUSINESS TABLES
-- ============================================

-- Shops (for multi-tenant)
CREATE TABLE shops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  opening_hours JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bikes
CREATE TABLE bikes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  make TEXT NOT NULL,
  model TEXT,
  frame_number TEXT,
  bike_type TEXT,
  year INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SERVICES & PRICING
-- ============================================

-- Service categories
CREATE TABLE service_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  category_id UUID REFERENCES service_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- JOBS
-- ============================================

-- Jobs
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_number TEXT NOT NULL,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  bike_id UUID REFERENCES bikes(id) ON DELETE SET NULL,
  technician_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'booked_in' CHECK (status IN ('booked_in', 'waiting_for_work', 'working_on', 'bike_ready', 'collected', 'cancelled')),
  booked_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job services (many-to-many)
CREATE TABLE job_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  price DECIMAL(10,2) NOT NULL,
  notes TEXT
);

-- Job parts
CREATE TABLE job_parts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  part_name TEXT NOT NULL,
  cost DECIMAL(10,2),
  retail DECIMAL(10,2),
  quantity INTEGER DEFAULT 1
);

-- ============================================
-- INVENTORY
-- ============================================

-- Parts/Products
CREATE TABLE parts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT UNIQUE,
  category TEXT,
  quantity INTEGER DEFAULT 0,
  cost DECIMAL(10,2),
  retail DECIMAL(10,2),
  supplier TEXT,
  reorder_level INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COLLECTIONS & DELIVERIES
-- ============================================

-- Collections/Deliveries
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('collection', 'delivery')),
  address TEXT NOT NULL,
  time_slot TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  scheduled_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ============================================
-- BOOKINGS
-- ============================================

-- Online bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  bike_details TEXT,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL,
  collection_needed BOOLEAN DEFAULT false,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CONTENT (AI)
-- ============================================

-- Generated content
CREATE TABLE generated_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('blog', 'social', 'email', 'caption')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  prompt TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_jobs_shop ON jobs(shop_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_customer ON jobs(customer_id);
CREATE INDEX idx_customers_shop ON customers(shop_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_collections_date ON collections(scheduled_date);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Shops: Admins can do everything
CREATE POLICY "Admins can do everything" ON shops USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
