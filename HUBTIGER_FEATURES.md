# BikeClinique - HubTiger Features Gap Analysis

## What We Have (✅ Built)
From previous research & build:

### Core
- ✅ Job Kanban Board (7 columns, drag-drop)
- ✅ Jobs List View
- ✅ Job Detail Page with checklist, notes, photos
- ✅ Calendar (14-day view with bookings/collections)
- ✅ Customers management
- ✅ Services management
- ✅ Technicians management
- ✅ Collections/Deliveries tracking
- ✅ Public booking page (/book)
- ✅ Public profile page (/profile)
- ✅ Authentication (login/signup)

### Advanced
- ✅ Dashboard with stats
- ✅ CSV Export
- ✅ Filter by technician

---

## What HubTiger Has (📋 To Build)

### 🔴 CRITICAL (Need Now)

#### 1. Service Types with Time & Price
HubTiger has: Categories (One off repairs, Services, Wheel, Brakes, Suspension), each with time + price
- **Need:** Service configuration with duration estimates
- **Location:** `/dashboard/services`

#### 2. Pick-ups/Deliveries - Route Planning
HubTiger has: Route planning with address, time slots, collection tracking
- **We have:** Basic collections/deliveries
- **Need:** Route map view, driver assignment, status tracking
- **Location:** `/dashboard/collections` (upgrade)

#### 3. Checklist Configuration - Job Reports
HubTiger has: Component-based job reports (checklists for each job type)
- **Need:** Configurable service checklists (e.g., "Full Service" checklist)
- **Location:** `/dashboard/settings` or new `/dashboard/checklists`

#### 4. Messaging - WhatsApp/SMS Templates
HubTiger has: WhatsApp integration, SMS, message templates
- **Need:** Message templates, WhatsApp/SMS sending
- **Tech:** Twilio (need keys)

#### 5. POS Products / Inventory
HubTiger has: Product inventory management
- **Need:** Product catalog, stock tracking
- **Location:** `/dashboard/stock` (upgrade)

---

### 🟡 MEDIUM PRIORITY

#### 6. Online Payments - Deposits & Coupons
HubTiger has: Online payments, coupons, service deposits
- **We have:** Basic Stripe (need keys)
- **Need:** Deposit payments, discount codes

#### 7. Bike Fittings
HubTiger has: Fitting service types
- **Need:** Add fitting as service type

#### 8. Calendar Views
HubTiger has: Day/Week/2Weeks/Month views, technician schedules, iCal sync
- **We have:** 14-day view
- **Need:** Week/Month views, iCal export

---

### 🟢 NICE TO HAVE

#### 9. Live Chat Widget
HubTiger has: Customer chat
- **Need:** Embeddable chat widget

#### 10. Smart Reviews System
HubTiger has: Auto-request reviews after job completion
- **Need:** Post-job review automation

---

## Unique Features (Competitive Advantage)

### Already Planned
1. **Bike Health Score** - AI analyzes service history, predictive maintenance
2. **AI Video Diagnostics** - Customer uploads video → AI diagnosis → quote
3. **Auto-Social Content** - Auto-generate TikTok/IG post after job

---

## Priority Build Order

### Week 1: Core Operations
1. ✅ Job Kanban - DONE
2. ✅ Calendar - DONE  
3. **Service Types with Duration** - Add time estimate to services
4. **Collections Route View** - Map-based delivery tracking

### Week 2: Communication
5. **Message Templates** - Pre-written SMS/WhatsApp
6. **Checklists** - Configurable job checklists

### Week 3: Commerce
7. **POS/Products** - Inventory management
8. **Deposits** - Partial payment support

### Week 4: Polish
9. **iCal Sync** - Calendar export
10. **Review Automation** - Post-job review requests

---

*Last updated: 2026-03-12*
*Research source: HubTiger portal exploration March 2026*
