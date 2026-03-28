# BikeClinique App - Development Kanban

## What BikeBook Has (that we need to replicate):

### ✅ DONE
- Dashboard with stats
- Jobs page (3 views: Board/Kanban, List, Calendar)
- Customers management (802 customers)
- Public profile
- Live Chat
- Payments/Stripe integration
- Reviews system
- Configuration settings

### 🚨 TO BUILD (Priority Order)

---

## 🔴 CRITICAL - Phase 1 (This Week)

### 1. Job Kanban Board
**Endpoint:** `/dashboard/jobs/board`
**参考:** BikeBook Board view

| Column | Description |
|--------|-------------|
| Booked In | New jobs waiting |
| Bike Arrived | Customer dropped off |
| Working On | Currently being serviced |
| Waiting for Parts | Needs parts |
| Waiting for Approval | Quote pending |
| Bike Ready | Completed, awaiting pickup |
| Collected | Job done |

**Card Content:**
- Date/time
- Job ID (#179)
- Bike make/model
- Customer name
- Service type
- Price (£470)

**Actions:**
- Drag-drop between columns
- Click to open job detail
- Search/filter by mechanic
- ✅ DONE: CSV Export added
- ✅ DONE: Filter by technician added

---

### 2. Jobs List View
**Endpoint:** `/dashboard/jobs`
**参考:** BikeBook List view

**Columns:**
- ID, Created, First Name, Last Name, Email, Phone, Bikes, Collection/Del-off
- Export to CSV
- Filters (date range, status, etc.)
- Pagination

---

### 3. Job Detail Modal/Page
**参考:** Click on job card in BikeBook

**Fields:**
- Job ID (auto-generated)
- Customer info (name, email, phone)
- Bike details (make, model, type)
- Service(s) selected
- Status workflow
- Notes
- Parts used
- Labor time
- Total price
- Collection/Delivery status

---

## 🟡 MEDIUM - Phase 2 (Next Week)

### 4. Customer Reviews Widget
- Pull from Google Reviews / Bikebook
- Display on dashboard
- Response capability

### 5. Public Profile Page
- Replicate BikeBook's public profile
- Shop info, location, hours
- Services list
- Contact form

### 6. Calendar View
**Endpoint:** `/dashboard/calendar`
- Day/Week/Month views
- Technician assignment
- Booking slots

---

## 🟢 NICE TO HAVE - Phase 3

### 7. Live Chat Integration
- Widget for website
- Chat with customers

### 8. Stripe Payments
- Payment processing
- Invoicing

### 9. SMS/WhatsApp Notifications
- Booking confirmations
- Job status updates

---

## 📋 Tools Needed

| Tool | Purpose | Status |
|------|---------|--------|
| Stripe | Payments | ❌ Need API keys |
| Twilio | SMS | ❌ Need API keys |
| Supabase | Database | ✅ Already configured |
| n8n | Automation | ✅ Running locally |

---

## 🔧 Immediate Next Steps

1. **Build Kanban Board** - React components + Supabase queries
2. **Create Job CRUD** - API routes for job operations
3. **Wire up Jobs List** - Connect to existing database schema
4. **Test with real data** - Import some sample jobs

---

*Kanban created: 2026-03-10*
