# BikeClinique Platform - Unbeatable Feature Specification

## Mission
Build the ultimate bike shop management platform that crushes BikeBook, HubTiger, and any competitor.

---

## Design System

### Aesthetic: Industrial Bold
- **Theme:** Dark mode primary (easy on eyes in workshop)
- **Primary Color:** Electric Orange `#FF4500` (energy, action)
- **Background:** Deep charcoal `#0D0D0D`
- **Surface:** Dark gray `#1A1A1A`
- **Text Primary:** White `#FFFFFF`
- **Text Secondary:** Gray `#888888`
- **Accent:** Teal `#00D4AA` (for success states)

### Typography
- **Headlines:** Archivo Black (bold, industrial)
- **Body:** DM Sans (clean, readable)

### Icons
- SVG icons only (no emojis)
- Lucide React icon library
- Custom bike-themed icons where needed

### UI Principles
- Bold typography, big numbers
- High contrast for workshop visibility
- Touch-friendly (mechanics on iPads)
- Offline-capable for mobile

---

## Unique Revenue Features (Our Moat)

### 1. Bike Health Score 🚴‍♂️

**What it is:**
- AI-powered 0-100 health score for every bike
- Visual dashboard showing bike condition

**How it works:**
1. Each time a bike is serviced, the system records:
   - Components checked (from job report)
   - Parts replaced
   - Mileage/usage data
   - Customer notes

2. AI calculates health score based on:
   - Component wear levels (chain, brake pads, tires, cables)
   - Time since last service
   - Age of bike
   - Usage frequency

3. **Predictive maintenance:**
   - "Brakes will need attention in ~300 miles"
   - "Chain replacement recommended within 2 months"

**UI Example:**
```
┌─────────────────────────────────────┐
│  GIANT DEFY - Health Score          │
│  ┌──────────────────────────────┐   │
│  │  ████████████████░░░░  78    │   │
│  └──────────────────────────────┘   │
│                                     │
│  ⚠️ Chain at 22% - replace soon     │
│  ⚠️ Brake pads at 35%               │
│  ✓ Tires - Good                     │
│  ✓ Gears - Good                     │
│                                     │
│  Next service: ~April 2026          │
└─────────────────────────────────────┘
```

**Customer Portal:**
- Customers log in and see ALL their bikes
- Health score visible to them
- Get notified when score drops

---

### 2. AI Video Diagnostics 📹 (NEW REVENUE)

**What it is:**
- Customers send video of their bike problem
- AI analyzes and provides diagnostic report
- Shop sends back video quote
- **Charge £15-25 for this service**

**How it works:**

**Customer Side (App/Web):**
1. Customer opens app → "Diagnose My Bike"
2. Records video (max 30 sec): "My gears are making a weird noise"
3. Optionally adds photos
4. Pays diagnostic fee (optional or free with booking)

**AI Processing:**
1. AI analyzes video using vision model
2. Generates diagnostic report:
   - "Likely issues: Derailleur misalignment, chain wear"
   - Confidence level: 85%
   - Recommended service: Full Service + Chain Replace
   - Estimated parts: £45

**Shop Side:**
1. Shop receives notification
2. Reviews AI diagnosis
3. Records response video (shop mechanic explains the issue)
4. Sends quote with one click

**Revenue Model:**
- £15-25 per diagnostic (upsells to actual service)
- Estimated 30% conversion to booked service
- Average: £60 service per diagnostic = £18 profit per lead

---

### 3. Auto-Social Content Generator 🎬

**What it is:**
- After every completed job, AI generates a social post
- One-click approve to post to TikTok/Instagram/Facebook
- **Free marketing on autopilot**

**How it works:**

**Trigger:** Job marked as "Completed"

**AI generates:**
1. Short video (from before/after photos)
2. Caption with bike details
3. Hashtags
4. Hook for engagement

**Example Output:**
```
📹 VIDEO: [Before/after photos animated with music]

Caption:
"Full transformation! 🚴‍♂️
This Giant Defy came in for a full service 
and left riding like new.

✨ New chain, brake pads, bar tape
✨ Gears indexed perfect
✨ Test ridden and ready to roll

Your bike deserve the same love? 
Book your service 👉 [link]

#BikeService #GiantBikes #LondonCycling"
```

**Features:**
- One-click approve/reject
- Schedule for optimal posting times
- Multi-platform (TikTok, IG, FB, LinkedIn)
- Customer tag (with permission)
- Batch approve at end of day

---

## Core Features

### 1. Job Management (Kanban)

**Board Columns:**
1. Booked In
2. Waiting for Work
3. Waiting - Client
4. Waiting - Parts
5. Working On
6. Bike Ready
7. Collected

**Features:**
- Drag-and-drop between columns
- Multi-mechanic view (see all workloads)
- Priority flags (Urgent/High/Normal/Low)
- Time tracking per job
- Job templates for common services
- Recurring jobs (subscription)

---

### 2. Job Report System (The Detailed One)

**Checklist Categories (from BikeBook):**
- Frame & Fork
- Wheels & Tyres
- Brakes
- Drivetrain
- Cockpit
- Saddle & Seatpost
- Hardware
- Accessories
- Final Check

**Each Item Has:**
- Status: Not Checked | Ok | Slight Wear | Recommended | Urgent | Replaced | Upgraded
- Photo upload
- Notes field

**Additional:**
- Video support (mechanic records notes)
- Before/after photo comparison
- Test ride checkbox
- M-Check certification
- Mechanic sign-off
- Customer signature (digital)

**AI Features:**
- Auto-generate report summary
- Suggest parts based on bike model + issues
- Generate PDF with branding

---

### 3. Customer Management

**Fields:**
- Name, phone, email
- Address
- Multiple bikes per customer
- Preferred mechanic
- Notes (coffee, music, etc.)

**Bike Profile:**
- Make, model, year
- Frame number
- All service history
- Parts used
- Total spend
- Health score

**Automation:**
- Service reminders
- Birthday messages
- Loyalty points

---

### 4. Pickup & Delivery

**HubTiger Features:**
- Route planning with map
- Mechanic/driver assignment
- Time slots
- Job status tracking

**We Add:**
- Delivery zone settings
- Distance-based pricing
- Live tracking (customer sees bike on map)
- Driver app (mobile interface)
- Multi-vehicle routes

---

### 5. Calendar & Scheduling

**Features:**
- Technician schedules
- iCal sync
- Availability management
- Buffer time between jobs
- Lunch/break blocking

**View Options:**
- Day
- Week
- 2 Weeks
- Month
- Technician split

---

### 6. Invoicing & Payments

**Features:**
- Auto-generate from job
- Multiple payment methods
- Payment links via WhatsApp/SMS
- Partial payments
- Deposits
- Subscriptions
- Receipts

---

### 7. Online Booking

**Customer Widget:**
- Select service
- Choose date/time
- Add bike details
- Pay deposit
- Get confirmation

**Shop:**
- Real-time availability
- Booking rules (min lead time, etc.)
- Confirmation templates

---

### 8. Messaging (WhatsApp First)

**HubTiger Has:**
- WhatsApp integration
- SMS integration
- Message templates
- Automated reminders

**We Add:**
- WhatsApp Business API (cheaper, more features)
- **Reply from within the platform**
- Message history per customer
- AI-generated responses

---

### 9. Inventory

**Features:**
- Parts database
- Stock levels
- Cost + RRP
- Barcode scanning
- Auto-reorder alerts

---

### 10. Reporting

**Dashboard:**
- Revenue (day/week/month)
- Jobs completed
- Average job value
- Mechanic performance

**AI Insights:**
- "80% of jobs this month needed brake work"
- "Predict: 15 jobs next week"
- Customer trends

---

## Technical Stack

- **Frontend:** Next.js 14 + Tailwind
- **Database:** Supabase
- **Auth:** Supabase Auth
- **Real-time:** Supabase Realtime
- **Storage:** Supabase Storage (photos/videos)
- **AI:** Claude API (report summaries, diagnostics)
- **Video:** CapCut API or AI video generation
- **Payments:** Stripe
- **Messaging:** WhatsApp Business API

---

## Pricing Strategy

**Target: Undercut HubTiger while offering more**

| Feature | HubTiger | Our Platform |
|---------|----------|--------------|
| Lite | £39/mo | £29/mo |
| Pro | £75/mo | £59/mo |
| Premium | £95/mo | £79/mo |
| AI Diagnostics | N/A | +£15/service |
| Auto-Social | N/A | Included |
| WhatsApp | Extra | Included |

---

## MVP Roadmap

### Phase 1: Core (Week 1-2)
- [x] Job Kanban board
- [x] Job Report system with checklist
- [x] Customer database
- [x] Basic invoicing
- [x] Design system applied

### Phase 2: Growth (Week 3-4)
- [ ] Online booking widget
- [ ] WhatsApp notifications
- [ ] Photo upload
- [ ] Pickup/Delivery scheduling
- [ ] Calendar view

### Phase 3: AI (Week 5-6)
- [ ] Bike Health Score
- [ ] AI Video Diagnostics
- [ ] Auto-Social Content
- [ ] Report summaries
- [ ] Customer portal

### Phase 4: Scale (Week 7+)
- [ ] Analytics dashboard
- [ ] Inventory management
- [ ] Multi-location support
- [ ] Driver app

---

## Design Mockup Examples

### Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│  BIKE CLINIQUE           [Search] [🔔] [Profile]          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │   247    │ │  £18,420 │ │   89%    │ │   4.8    │    │
│  │   Jobs   │ │  Revenue  │ │ Complete │ │  Rating  │    │
│  │ This Month│ │  This Month│ │  Rate    │ │          │    │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────┐          │
│  │  JOBS BY STATUS                             │          │
│  │  ████████░░░  12 Booked In                 │          │
│  │  ██████░░░░░   8 Waiting for Work          │          │
│  │  ███░░░░░░░░   4 Working On                │          │
│  └─────────────────────────────────────────────┘          │
│                                                             │
│  ┌─────────────────────────────────────────────┐          │
│  │  RECENT JOBS                     View All → │          │
│  │  ─────────────────────────────────────────── │          │
│  │  #2347 Giant Defy  - Advance Service       │          │
│  │     Andrew H.    Freddie    Ready           │          │
│  │  #2346 Canyon     - Full Service             │          │
│  │     Sarah M.     Lucio      Working On      │          │
│  └─────────────────────────────────────────────┘          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Job Card
```
┌─────────────────────────────────────────────────────────────┐
│  ← Back                      Job #2347                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  CUSTOMER              BIKE              PRIORITY          │
│  Andrew Henderson      Giant Defy        🔴 URGENT         │
│  +447977719170        2022 Model                           │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  SERVICE                   TECHNICIAN      STATUS           │
│  Advance Service          Freddie Vaval   🔵 Working On    │
│  Est. 2h                  [Assign]                          │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  PROGRESS                                                       │
│  ┌─────────────────────────────────────────────┐            │
│  │ Frame & Fork     ✓                          │            │
│  │ Wheels & Tyres   ⚠️  Slight Wear            │            │
│  │ Brakes           ✓                          │            │
│  │ Drivetrain       🔶  Recommended           │            │
│  │ ...                                          │            │
│  └─────────────────────────────────────────────┘            │
│                                                             │
│  [📷 Add Photo] [📹 Add Video] [✍️ Sign] [📄 PDF]           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

*Last updated: 2026-03-09*
*Mission: Build the best bike shop management system*
