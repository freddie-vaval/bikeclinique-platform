# BikeClinique Design System v2.0

## Overview
**Target:** BikeClinique - Bike Workshop Management SaaS  
**Vibe:** Industrial Workshop meets Modern Tech - bold, functional, distinctive

---

## Design Philosophy
- **NOT generic SaaS** - Avoid the blue/purple gradient AI slop
- **Workshop authenticity** - Reflects the hands-on nature of bike mechanics
- **Bold & confident** - Strong typography, high contrast
- **Functional beauty** - Design serves usability, not just aesthetics

---

## Pattern: "Hero-Centric + Trust"

### Layout Structure
1. **Hero** - Bold headline, clear value prop, dual CTAs
2. **Social Proof** - Testimonials with real photos
3. **How It Works** - 3-step visual process
4. **Features** - Grid with icons + descriptions
5. **Stats** - Key numbers (social proof)
6. **CTA** - Final call to action
7. **Footer** - Links + copyright

### Sections to Keep
- ✅ Online booking flow
- ✅ Job management dashboard concept
- ✅ Reports/analytics
- ✅ Inventory alerts
- ✅ Messages/notifications

---

## Color Palette

### Primary Colors
| Role | Color | Usage |
|------|-------|-------|
| **Background** | `#0D0D0D` | Main background (near black) |
| **Surface** | `#1A1A1A` | Cards, panels |
| **Surface Elevated** | `#262626` | Hover states, modals |
| **Border** | `#333333` | Subtle dividers |

### Accent Colors
| Role | Color | Usage |
|------|-------|-------|
| **Primary Action** | `#FF6B35` | CTAs, links, highlights (keep brand orange!) |
| **Primary Hover** | `#FF8255` | Button hover |
| **Success** | `#22C55E` | Completed jobs, confirmations |
| **Warning** | `#FBBF24` | Low stock, pending |
| **Error** | `#EF4444` | Errors, urgent |

### Text Colors
| Role | Color | Usage |
|------|-------|-------|
| **Heading** | `#FFFFFF` | All headings |
| **Body** | `#A3A3A3` | Body text (not pure white - softer) |
| **Muted** | `#737373` | Secondary text, captions |

### NEW: Text Gradient (use sparingly)
```css
background: linear-gradient(135deg, #FF6B35 0%, #FFB800 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```
**Use for:** Key headlines, hero emphasis (sparingly!)

---

## Typography

### Font Stack
```css
/* Headings - Bold & Industrial */
font-family: 'Archivo Black', 'Impact', sans-serif;

/* Body - Clean & Readable */
font-family: 'DM Sans', 'Inter', sans-serif;

/* Mono - For prices/numbers */
font-family: 'JetBrains Mono', monospace;
```

### Scale
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 (Hero) | 64px / 3.5rem | 900 | 1.1 |
| H2 (Section) | 40px / 2.5rem | 700 | 1.2 |
| H3 (Card) | 24px / 1.5rem | 600 | 1.3 |
| Body | 16px / 1rem | 400 | 1.6 |
| Small | 14px / 0.875rem | 400 | 1.5 |
| Caption | 12px / 0.75rem | 500 | 1.4 |

### Font Import
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

## UI Elements

### Buttons
```css
/* Primary CTA */
.btn-primary {
  background: #FF6B35;
  color: #FFFFFF;
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  padding: 16px 32px;
  border-radius: 4px; /* NOT rounded - industrial feel */
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-primary:hover {
  background: #FF8255;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 107, 53, 0.3);
}

/* Secondary */
.btn-secondary {
  background: transparent;
  color: #FFFFFF;
  font-weight: 600;
  padding: 16px 32px;
  border-radius: 4px;
  border: 2px solid #333333;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  border-color: #FF6B35;
  color: #FF6B35;
}
```

### Cards
```css
.card {
  background: #1A1A1A;
  border: 1px solid #333333;
  border-radius: 8px;
  padding: 24px;
  transition: all 0.2s ease;
}

.card:hover {
  border-color: #FF6B35;
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
}
```

### Input Fields
```css
.input {
  background: #1A1A1A;
  border: 1px solid #333333;
  border-radius: 4px;
  padding: 12px 16px;
  color: #FFFFFF;
  font-family: 'DM Sans', sans-serif;
  font-size: 16px;
  width: 100%;
  transition: border-color 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: #FF6B35;
}

.input::placeholder {
  color: #737373;
}
```

---

## Visual Effects

### Subtle Noise Texture (adds depth)
```css
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.03;
  pointer-events: none;
  z-index: 9999;
}
```

### Glow Effect (use sparingly)
```css
.glow {
  box-shadow: 0 0 60px rgba(255, 107, 53, 0.15);
}
```

### Border Accent
```css
.border-accent {
  border-left: 3px solid #FF6B35;
}
```

---

## Iconography

### Style
- **NOT emoji** - Use SVG icons
- **Line icons** (1.5px stroke) - Clean, modern
- **Suggested sets:**
  - Lucide Icons (free, MIT)
  - Heroicons (free)
  - Phosphor Icons (free)

### Sizing
- Small: 16px
- Medium: 24px  
- Large: 32px
- Feature: 48px

### Color
- Default: `#A3A3A3`
- Hover: `#FFFFFF`
- Active: `#FF6B35`

---

## Responsive Breakpoints

```css
/* Mobile First */
--mobile: 375px;
--tablet: 768px;
--desktop: 1024px;
--wide: 1440px;
```

### Layout Adjustments
| Breakpoint | Hero Text | Grid Columns | Padding |
|------------|-----------|--------------|---------|
| Mobile (<768px) | 32px | 1 | 16px |
| Tablet (768-1024px) | 48px | 2 | 24px |
| Desktop (>1024px) | 64px | 3 | 48px |

---

## Anti-Patterns (What to AVOID)

❌ **No gradients on backgrounds** - Keep it flat/solid  
❌ **No AI purple/pink** - This is the generic AI look  
❌ **No rounded corners > 8px** - Keep it industrial  
❌ **No glassmorphism/glass effects** - Can feel overused  
❌ **No emoji as icons** - Use SVG line icons  
❌ **No excessive animations** - Subtle only  
❌ **No thin/light fonts for headings** - Go bold  

---

## Pre-Delivery Checklist

Before shipping, verify:

- [ ] No emojis as icons (use SVG: Lucide/Heroicons)
- [ ] cursor-pointer on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Text contrast 4.5:1 minimum (verify #A3A3A3 on #0D0D0D = 8.3:1 ✓)
- [ ] Focus states visible for keyboard nav
- [ ] prefers-reduced-motion respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px tested
- [ ] Fonts loaded (Archivo Black, DM Sans, JetBrains Mono)

---

## Quick Start CSS

Copy this to your globals.css:

```css
@import "tailwindcss";

/* Fonts */
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --bg: #0D0D0D;
  --surface: #1A1A1A;
  --surface-elevated: #262626;
  --border: #333333;
  --accent: #FF6B35;
  --accent-hover: #FF8255;
  --success: #22C55E;
  --warning: #FBBF24;
  --error: #EF4444;
  --text-heading: #FFFFFF;
  --text-body: #A3A3A3;
  --text-muted: #737373;
}

@theme inline {
  --color-background: var(--bg);
  --color-surface: var(--surface);
  --color-accent: var(--accent);
  --color-accent-hover: var(--accent-hover);
  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-error: var(--error);
}

body {
  background: var(--bg);
  color: var(--text-body);
  font-family: 'DM Sans', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Archivo Black', sans-serif;
  color: var(--text-heading);
}

.font-mono {
  font-family: 'JetBrains Mono', monospace;
}
```

---

*Generated with UI/UX Pro Max - Bike Workshop SaaS Edition*
