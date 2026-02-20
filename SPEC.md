# BikeClinique Platform - FINAL Engineering Specification

## Best of Both Worlds

| From Bikebook (UI/Interface) | From Hubtiger (Features) |
|------------------------------|--------------------------|
| Clean, modern dashboard | Job card system |
| Customer portal look | Collection & Delivery system |
| Simple navigation | Calendar & technician management |
| Messaging inbox | Reports & analytics |
| Public profile/marketplace | Services/pricing management |

Plus: **Shopify + Stripe integration**

---

## Architecture

### Tech Stack
- **Frontend**: Next.js 14 (React) + Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Payments**: Stripe
- **E-commerce**: Shopify Storefront API
- **SMS**: Twilio
- **WhatsApp**: WhatsApp Business API
- **Email**: Resend

---

## Core Features

### 1. Job Management (Hubtiger-style)
- Job cards with unique IDs
- Status workflow: Booked In → Waiting for Work → Working On → Bike Ready → Collected
- Multi-service jobs, parts tracking, labor notes
- Photo attachments, technician assignment

### 2. Collection & Delivery (Hubtiger - KEY)
- Pick-up scheduling
- Drop-off scheduling  
- Time slots
- Address management
- Status tracking

### 3. Calendar (Hubtiger)
- Day/Week/Month views
- Technician assignment
- Availability management

### 4. Services/Pricing (Hubtiger)
- Service categories
- Pricing tiers
- Duration estimates

### 5. Customer Management
- Customer database
- Bike profiles per customer
- Service history

### 6. Online Booking Widget (Bikebook-style)
- Embeddable widget
- Service selection
- Date/time picker

### 7. Customer Portal (Bikebook)
- View jobs status
- Book appointments
- Leave reviews

### 8. Messaging (Bikebook)
- Inbox (multi-channel)
- WhatsApp + SMS

### 9. Reports & Analytics (Hubtiger)
- Revenue, jobs, technician performance

### 10. Invoicing (Hubtiger)
- Generate invoices, PDF export

### 11. Inventory (Hubtiger)
- Parts database, stock levels

### 12. Shopify Integration
- Sync products, pull orders

### 13. Stripe Integration
- Payment processing, invoicing

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)
- Next.js setup + Tailwind
- Supabase setup + schema
- Auth system
- Basic UI layout

### Phase 2: Jobs (Week 3)
- Job CRUD, status workflow

### Phase 3: Calendar (Week 4)
- Calendar UI, booking widget

### Phase 4: Collections/Deliveries (Week 5)
- Collection scheduling, delivery

### Phase 5: Customers/Portal (Week 6)
- Customer management, portal

### Phase 6: Commerce (Week 7)
- Shopify + Stripe

### Phase 7: Messaging/Reports (Week 8)
- Messaging, reports, polish

---

*Spec created: 2026-02-20*
