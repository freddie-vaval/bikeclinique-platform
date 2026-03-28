# BikeClinique Platform - V2 Improvements

## What BikeBook Has (✅ = We Have It):

### ✅ DONE - Already Built
- Dashboard with stats
- Jobs Kanban Board (7 columns: Booked In → Collected)
- Jobs List View
- Job Detail Page with checklist, notes, photos
- Customers management
- Services management
- Technicians management
- Collections/Deliveries
- Public booking page (for customers)
- Authentication (login/signup)

### ❌ NOT YET BUILT (Based on BikeBook Research)

#### 🔴 CRITICAL
1. **Live Chat** - Chat with customers on website (BikeBook has this)
2. **Public Profile Page** - Shop profile visible to public (like bikebook.co.uk/mechanic/...)
3. **Reviews System** - Display and respond to customer reviews
4. **Export Jobs** - CSV export functionality
5. **Job Filters** - Filter by date range, status, technician

#### 🟡 MEDIUM PRIORITY
1. **Calendar View** - Day/Week/Month calendar for jobs
2. **Payments Integration** - Stripe for taking payments
3. **Stock/Parts Management** - Track inventory
4. **Multi-mechanic** - Assign jobs to specific technicians
5. **Email/SMS Notifications** - Automated messages to customers

#### 🟢 NICE TO HAVE
1. **Membership/Rental** - Recurring revenue features
2. **POS Integration** - Point of sale for walk-ins
3. **Booking Widget** - Embeddable widget for other sites
4. **Mobile App** - Native mobile apps

---

## Quick Wins to Implement Now

### 1. Add Export Button to Jobs List
- Simple CSV export of current filter
- ✅ DONE (2026-03-11): Added CSV export button to Jobs page

### 2. Add Filter to Jobs Board
- Filter by mechanic
- Filter by date range
- ✅ DONE (2026-03-11): Added technician filter dropdown

### 3. Add Live Chat Widget
- Use something like Chatlio or Intercom (free tiers)
- Or build simple one with Supabase

### 4. Create Public Profile Page
- /profile route
- Shop name, location, hours, services
- Contact form

### 5. Add Reviews Section
- Show on dashboard
- Allow response

---

## Current Issues
- Need to deploy to Vercel for public access
- Need to set up proper domain
- Need Stripe keys for payments

---

*Last updated: 2026-03-10*
*Research source: BikeBook workshop.bikebook.co.uk*
