# Competitor Analysis: HubTiger & BikeBook

## HubTiger (hubtiger.com)

**What they do:** All-in-one repair shop software for bikes, motorcycles, scooters, appliances, jewelry

### Key Features:
1. **Job Card System** - Digital job cards with status workflow
2. **Online Booking** - Calendar-based booking widget
3. **Customer Management** - Bike profiles, service history
4. **Collection & Delivery** - Pick-up/drop-off scheduling
5. **Technician Management** - Assignment, availability
6. **Automated Notifications** - SMS/email updates to customers
7. **POS Integration** - Payment processing
8. **Multi-language** - EN, ES, NL, DE, PT, FR, IT

### Pricing Model:
- SaaS subscription (likely per technician/month)
- Used by big names: 99 Bikes, Giant Store Breda, bikeNOW

### Strengths:
- Feature-complete for workshops
- Proven at scale (1000+ shops)
- Multi-country support

---

## BikeBook (workshop.bikebook.co.uk)

**Status:** ✅ Active - Logged in as Bike Clinique LTD

### Navigation Structure:
- Home
- Dashboard
- Travel
- Live Chat
- My Customers
- Public Profile
- **Jobs** (sub-menu: Board, List, Calendar)
- Payments
- Stock
- Availability
- Services
- Messaging
- Configuration

### Dashboard Features:
- **Stats Cards:** Jobs this month, Revenue this month, New customers
- **Active Bikes Being Serviced:** Status breakdown with counts:
  - Booked In
  - Bike Arrived
  - Pending Collection
  - Working On
  - Waiting for Parts
  - Waiting for Approval
  - Bike Ready For Collection
- **Charts:**
  - Jobs Per Month (Collection vs Bring In)
  - Customer Bookings (New vs Existing)
- **Recent Customer Reviews:** 5-star reviews with owner response capability

### Jobs - Board View (Kanban):
- **Columns:**
  - Booked In (2 bikes, £470)
  - Bike Arrived (2 bikes, £220)
  - Waiting for Approval (2 bikes)
  - Bike Ready For Collection (3 bikes, £565.32)
  - Completed (14 bikes)
- **Card Details:** Date/time, Job ID, Bike make/model, Customer name, Service type, Price
- **Features:** Search, Filter by mechanic, Show empty columns, Sort

### Jobs - List View:
- **Table columns:** Id, Created, First Name, Last Name, Email, Phone, Bikes, Collection/Drop-off
- **Features:** Export, Filters, Column selection, Pagination (179 jobs total)

### Jobs - Calendar View:
- Calendar-based job scheduling

### Customers:
- **Total:** 802 customers
- **Table columns:** Avatar, First Name, Last Name, Email, Mobile, Landline, Bikes, Jobs, Address
- **Features:** Import customers, Export customers, New customer, Search, Filters

### Public Profile:
- Business name & description
- Location with Google Maps integration
- Services offered (show/hide)
- Collections & returns toggle
- Contact details (email, phone, website)
- Opening hours (configurable per day)
- Live on Bikebook directory: https://bikebook.co.uk/mechanic/bike-clinique-ltd
- Qualifications management

### Configuration:
- Business Account (team management)
- Notifications
- Reviews
- Membership
- POS & Accounting Integrations
- Payments Integration

---

## BikeClinique Platform - Current State

### Pages Built (22 routes):

**Public:**
- `/` - Landing page
- `/profile` - Shop public profile
- `/widget` - Embeddable booking widget

**Auth:**
- `/login` - User login

**Customer Portal:**
- `/portal` - Customer dashboard
- `/book` - Book appointment
- `/checkout` - Payment

**Admin Dashboard:**
- `/dashboard` - Main dashboard
- `/dashboard/jobs` - Job management
- `/dashboard/jobs/[id]` - Job detail
- `/dashboard/bookings` - Booking management
- `/dashboard/calendar` - Calendar view
- `/dashboard/customers` - Customer management
- `/dashboard/technicians` - Staff management
- `/dashboard/services` - Service pricing
- `/dashboard/stock` - Inventory
- `/dashboard/collections` - Collection/delivery
- `/dashboard/reports` - Analytics
- `/dashboard/messages` - Messaging
- `/dashboard/content` - CMS
- `/dashboard/settings` - Settings

### Tech Stack:
- Next.js 14
- Supabase (auth + DB)
- Tailwind CSS

---

## Gap Analysis

| Feature | HubTiger | BikeBook | BikeClinique |
|---------|----------|----------|--------------|
| Job cards (kanban) | ✅ | ✅ (Board view) | ❌ Need to build |
| Collection/Delivery | ✅ | ✅ | Page exists |
| Calendar | ✅ | ✅ | Page exists |
| Customer portal | ✅ | ✅ (Public profile) | Page exists |
| Booking widget | ✅ | ✅ | Page exists |
| Reports | ✅ | Dashboard stats | Page exists |
| POS/Payments | ✅ | ✅ (integrations) | Not integrated |
| SMS/WhatsApp | ✅ | Live Chat | Not integrated |
| Shopify | ✅ | ❌ | Not integrated |
| Customer reviews | ❌ | ✅ | ❌ |

---

## Priority Features to Build

### Phase 1: Kanban Board (CRITICAL)
- Replicate BikeBook's Board view columns
- Drag-and-drop job status changes
- Job card details (bike, customer, service, price)
- Total value per column

### Phase 2: Job List Enhancements
- Full table with all columns
- Export functionality
- Advanced filters

### Phase 3: Customer Reviews
- Review collection from public profile
- Response capability
- Display on dashboard

### Phase 4: Integrations
- Stripe payments
- Twilio SMS/WhatsApp
- Live Chat widget

---

*Analysis date: 2026-03-10*
