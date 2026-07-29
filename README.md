# 🛡️ Magnitax Secure Client Portal

[![Firebase Hosting](https://img.shields.io/badge/Firebase%20Hosting-Live-10b981?style=for-the-badge&logo=firebase)](https://taxagentai062026.web.app)
[![License](https://img.shields.io/badge/License-MIT-blue.style=for-the-badge)](LICENSE)
[![Branding](https://img.shields.io/badge/Brand-Magnitax%20Emerald-059669?style=for-the-badge)](#-brand--design-system)

The **Magnitax Secure Client Portal** is a high-security, professional web application designed for **Magnitax Consulting LLC**. It provides tax clients with a dedicated repository to complete multi-step tax intake onboarding, view, preview, and download sensitive financial tax filings (W-2, 1099, Form 1040 summaries), and communicate with their designated CPA preparer.

---

## 🌐 Live Applications & Marketing Touchpoints

| Application / Asset | Live Deployment URL | Description |
|---|---|---|
| **Client & Admin Portal** | [https://taxagentai062026.web.app](https://taxagentai062026.web.app) | Core single-page client portal app with live Firebase backend |
| **Landing Page** | [https://taxagentai062026.web.app/landing.html](https://taxagentai062026.web.app/landing.html) | Product promotion & onboarding hub for accounting clients |
| **Services Flyer** | [https://taxagentai062026.web.app/flyer.html](https://taxagentai062026.web.app/flyer.html) | Print & digital marketing flyer matching the Magnitax Emerald theme |
| **Investor Pitch Deck** | [https://taxagentai062026.web.app/pitch_deck.html](https://taxagentai062026.web.app/pitch_deck.html) | Interactive slide presentation powered by Reveal.js |

---

## ✨ Key Features

### 👤 Dual Role Architecture
- **Client Mode**:
  - Secure personal dashboard displaying total filed documents and filing status.
  - Multi-step Client Intake Wizard with state retention & Firestore persistence.
  - Document vault with real-time category filtering (W-2, 1099, Form Summaries, Tax Year).
  - One-click secure downloads via pre-signed Firebase Storage URLs.
- **CPA Admin Mode**:
  - Real-time **Intakes Queue** to inspect incoming submissions, change review status (`Pending Review`, `In Progress`, `Completed`), and view full client tax profiles.
  - **Client Vault Uploader**: Drag-and-drop file uploader with upload progress indicator, publishing directly to **Firebase Storage** and writing metadata to **Cloud Firestore**.

### 🔐 Security & Compliance
- **Firebase Authentication**: Email/Password authentication supported by session monitoring via `auth.onAuthStateChanged()`.
- **Automatic User Provisioning**: Automatic creation of Firestore profiles under `users/{uid}` with role assignment (`admin` vs `client`).
- **Two-Factor Access Gate**: Simulated 6-digit TOTP verification step.
- **Audit Trails**: Real-time action logging for logins, 2FA confirmations, document previews, and downloads.
- **GDPR Compliance Tools**: One-click data export and right-to-be-forgotten deletion workflows.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Core** | Vanilla HTML5, CSS3, ES6+ JavaScript | Zero-framework high performance single-page application |
| **Design System** | Custom CSS Variables, Glassmorphism UI | Magnitax Emerald theme (`#10b981`, `#059669`) with dark mode aesthetics |
| **Typography** | Google Fonts (`Inter` & `Outfit`) | Modern typography hierarchy |
| **Authentication** | Firebase Authentication (Compat SDK) | User login, registration fallback, and token management |
| **Database** | Cloud Firestore | Real-time persistence for user profiles, client intakes, and document metadata |
| **Cloud Storage** | Firebase Storage | Private binary storage for PDF/DOC tax filings with pre-signed download URLs |
| **Hosting** | Firebase Hosting | Global CDN deployment at `taxagentai062026.web.app` |
| **Investor Deck** | Reveal.js | Interactive slide engine with custom Magnitax CSS variables |

---

## 🎨 Brand & Design System

The application strictly adheres to the **Magnitax Emerald** design system:

```css
:root {
  --bg-primary: #090d16;
  --bg-secondary: #111827;
  --bg-tertiary: #1f2937;
  --accent: #10b981;        /* Magnitax Emerald */
  --accent-hover: #059669;  /* Deep Emerald */
  --accent-glow: rgba(16, 185, 129, 0.25);
  --text-primary: #f9fafb;
  --text-secondary: #9ca3af;
  --border-accent: rgba(16, 185, 129, 0.3);
}
```

---

## 🔑 Test Login Credentials

For quick testing on [https://taxagentai062026.web.app](https://taxagentai062026.web.app), click the **Quick Test Login Credentials** buttons on the login card:

| Role | Username / Email | Password | Pre-Provisioned Profile |
|---|---|---|---|
| 👑 **CPA Admin** | `admin@magnitax.com` | `Password123!` | Marcus Kaelen, Senior Tax Strategist |
| 👤 **Client** | `jane@example.com` | `Password123!` | Jane Doe, JD Designs LLC |

> 💡 *Note*: Typing any unregistered email and password will automatically register a new account on the fly.

---

## 📁 Repository Structure

```
.
├── firebase.json                 # Firebase Hosting deployment configuration
├── .firebaserc                   # Firebase project targets (taxagentai062026)
├── product_brief.md              # Detailed Product & Technical Architecture Specification
├── README.md                     # Project documentation & quick start guide
└── public/
    ├── index.html                # Main SPA portal layout (Dashboard, Vault, Admin, Intake)
    ├── app.js                    # SPA application logic, Firebase SDK integration & state
    ├── style.css                 # Master Magnitax Emerald design system stylesheet
    ├── landing.html              # Marketing & client onboarding portal promotion page
    ├── flyer.html                # Print & digital marketing flyer
    └── pitch_deck.html           # Reveal.js interactive investor pitch deck
```

---

## 🚀 Local Setup & Deployment

### 1. Clone & Run Locally
```bash
git clone https://github.com/whoisdesirtech/Designing-Magnitax-Client-Portal.git
cd Designing-Magnitax-Client-Portal/public
# Serve locally using any static web server (e.g. VS Code Live Server, python http.server, or npx serve)
npx serve .
```

### 2. Deploy to Firebase Hosting
```bash
# Deploy changes directly to live Firebase Hosting
npx -y firebase-tools@latest deploy --only hosting --project taxagentai062026
```

---

## 📄 License & Contact

Copyright © 2026 Magnitax Consulting LLC. All rights reserved.
