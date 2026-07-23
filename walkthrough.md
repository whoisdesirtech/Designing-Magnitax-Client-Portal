# Walkthrough: Magnitax Client Portal & Marketing Platform

We have completed the major enhancements for **Magnitax.com**:
1. **[Product Brief](file:///Users/jeanfils/.gemini/antigravity/brain/4617c157-235a-40b2-bc54-6910a503c8fc/product_brief.md)**: Development specification matching the RISEN framework.
2. **Dual-Role Portal Architecture (Client Portal vs. CPA Admin Console)**: Seamless switching between Filer Client view and CPA Admin view with live Firestore sync.
3. **Public Marketing Landing Page ([landing.html](file:///Users/jeanfils/Desktop/vibe-coding/Vibe%20Coding%20Mastery/magnitax-portal-prototype/public/landing.html))**: High-converting glassmorphic landing page showcasing portal capabilities to prospective firm clients.
4. **3-Step Guided Client Intake Wizard**: Personal info, tax profile checkboxes, drag-and-drop document uploads, and live persistence to Cloud Firestore.
5. **Interactive Pitch Deck ([pitch_deck.html](file:///Users/jeanfils/Desktop/vibe-coding/Vibe%20Coding%20Mastery/magnitax-portal-prototype/public/pitch_deck.html))**: Reveal.js presentation with live portal iframe.
6. **Client Flyer ([flyer.html](file:///Users/jeanfils/Desktop/vibe-coding/Vibe%20Coding%20Mastery/magnitax-portal-prototype/public/flyer.html))**: Print-ready U.S. Letter marketing one-pager flyer.

Project Directory Files (`/public` for Firebase Hosting):
- [landing.html](file:///Users/jeanfils/Desktop/vibe-coding/Vibe%20Coding%20Mastery/magnitax-portal-prototype/public/landing.html) (Public Marketing Landing Page)
- [index.html](file:///Users/jeanfils/Desktop/vibe-coding/Vibe%20Coding%20Mastery/magnitax-portal-prototype/public/index.html) (Client Portal & Admin Console)
- [pitch_deck.html](file:///Users/jeanfils/Desktop/vibe-coding/Vibe%20Coding%20Mastery/magnitax-portal-prototype/public/pitch_deck.html) (Interactive Slides)
- [flyer.html](file:///Users/jeanfils/Desktop/vibe-coding/Vibe%20Coding%20Mastery/magnitax-portal-prototype/public/flyer.html) (Marketing One-Pager)
- [style.css](file:///Users/jeanfils/Desktop/vibe-coding/Vibe%20Coding%20Mastery/magnitax-portal-prototype/public/style.css) (CSS Design System Tokens)
- [app.js](file:///Users/jeanfils/Desktop/vibe-coding/Vibe%20Coding%20Mastery/magnitax-portal-prototype/public/app.js) (Frontend & Firestore Logic)

---

## 1. Dual-Role System: Client vs. CPA Admin

### Authentication & Role Switcher
- **Client Login**: `jane.doe@example.com` / `password123` (2FA: `123456`) → Role: **CLIENT ROLE**
- **Admin Login**: `admin@magnitax.com` or `marcus.kaelen@magnitax.com` / `admin123` (2FA: `123456`) → Role: **CPA ADMIN ROLE**
- **Instant Role Switcher**: Click the **Switch Role** button in the header toolbar to immediately toggle between Client and Admin perspectives for demonstration testing.

### CPA Admin Console Capabilities
- 📥 **Intakes Queue (Firestore Sync)**: View real-time intake submissions saved to Cloud Firestore (`intakes` collection), filter by status (`Pending Review`, `In Progress`, `Completed`), and inspect full client details, SSN, DOB, tax profile, and uploaded source files.
- 📁 **Client Vault Uploader**: Admin tool for CPA preparers to upload and publish W-2s, 1099s, or Form 1040 summaries directly into client account vaults.

---

## 2. Public Marketing Landing Page (`landing.html`)

- **Hero Section**: High-converting glassmorphic design featuring firm value metrics, SOC2/256-bit security badges, and CTA buttons.
- **Client Portal Showcase**: Highlights 2FA security, 3-step intake wizard, IRS form viewer, and end-to-end CPA advisory messaging.
- **Magnitax vs. Gig Marketplaces (Taxfyle)**: Comparison table demonstrating 100% firm client ownership and margin retention vs. gig networks.
- **Interactive Firm ROI Calculator**: Calculates annual CPA billable hours saved based on active client count.
- **Lead Generation Form**: Captures firm onboarding & private demo requests.

---

## 3. How to View & Test

```bash
# Option A: Open directly in macOS
open "/Users/jeanfils/Desktop/vibe-coding/Vibe Coding Mastery/magnitax-portal-prototype/public/landing.html"
open "/Users/jeanfils/Desktop/vibe-coding/Vibe Coding Mastery/magnitax-portal-prototype/public/index.html"

# Live Firebase Hosting URL
https://taxagentai062026.web.app
```

