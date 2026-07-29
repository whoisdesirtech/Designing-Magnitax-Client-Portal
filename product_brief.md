# Product Brief: Magnitax Secure Client Portal
**Document Version:** 2.0.0 (Production Live Release)  
**Target Audience:** Engineering, Product, Security, and Design Teams  
**System Relationship:** Portal Subdomain (`portal.magnitax.com` / `taxagentai062026.web.app`) connecting to WordPress Marketing Site (`magnitax.com`)

---

## 1. Executive Summary & Purpose

Magnitax Consulting LLC is a professional tax and accounting services firm. Its public marketing presence is hosted on WordPress (`magnitax.com`). To streamline client onboarding, document exchanges, and CPA workflows while maintaining enterprise-grade data security, Magnitax deployed a dedicated **Client Portal** integrated with **Firebase Authentication**, **Firebase Storage**, and **Cloud Firestore**.

The portal allows tax clients to:
- Complete a multi-step digital **Client Intake Wizard**.
- View, preview, and download tax filings (W-2s, 1099s, Form 1040 Summaries) stored securely in private cloud storage.
- Communicate with their assigned CPA tax professional.

Administrators (CPAs) can:
- Inspect and update client intake submissions in real time.
- Upload PDF filings directly to Firebase Storage and assign them to specific client vaults.

```
┌─────────────────────────────────┐      Subdomain Link      ┌────────────────────────────────┐
│      WordPress Website          │ ───────────────────────> │     Magnitax Client Portal     │
│     (magnitax.com - PHP)        │ <─────────────────────── │ (taxagentai062026.web.app)     │
│  Public Marketing, Info & Blog  │    WordPress JWT Auth    │  Firebase Auth & Storage Vault │
└─────────────────────────────────┘                          └────────────────────────────────┘
```

---

## 2. Live Application Endpoints & Deployments

| Component | Target URL | Technology |
|---|---|---|
| **Client Portal App** | [https://taxagentai062026.web.app](https://taxagentai062026.web.app) | Single-Page Application (SPA) + Firebase SDK |
| **Marketing Landing Page** | [https://taxagentai062026.web.app/landing.html](https://taxagentai062026.web.app/landing.html) | HTML5 / Vanilla CSS Design Tokens |
| **Services Flyer** | [https://taxagentai062026.web.app/flyer.html](https://taxagentai062026.web.app/flyer.html) | HTML5 / Print & Digital Flyer |
| **Investor Pitch Deck** | [https://taxagentai062026.web.app/pitch_deck.html](https://taxagentai062026.web.app/pitch_deck.html) | Reveal.js Interactive Presentation Engine |

---

## 3. User Roles & Permissions

1. **Client (`role: "client"`)**:
   - Access limited strictly to their own profile, intake forms, and uploaded tax documents.
   - Can search and filter their document gallery by tax year (2026, 2025, 2024, 2023) and category (W-2, 1099, Summary).
   - Can preview documents in an embedded modal and download them via pre-signed storage URLs.
2. **CPA Administrator (`role: "admin"`)**:
   - Full access to the **Intakes Queue** to view incoming client questionnaires and update review statuses (`Pending Review`, `In Progress`, `Completed`).
   - Drag-and-drop file uploader to select local files (max 25 MB), select a target client from Firestore, and upload directly to Firebase Storage.
   - Audit trail inspection.
3. **Service Account / System API**:
   - Programmatic access for CRM synchronization (Canopy, SharePoint, or WordPress webhooks).

---

## 4. Technical Architecture & Database Schemas

### 4.1 Firebase Services Stack
- **Firebase Authentication**: Manages user identity (`signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `signOut`, `onAuthStateChanged`).
- **Cloud Firestore**: Real-time NoSQL database storing user profiles (`users`), intake questionnaires (`intakes`), and document metadata (`documents`).
- **Firebase Storage**: Private binary blob storage structured at `documents/{clientUid}/{year}/{type}/{filename}`.
- **Firebase Hosting**: Global CDN edge hosting.

### 4.2 Firestore Collections Schema

#### `users` collection (`docId: firebaseUser.uid`)
```json
{
  "email": "string",
  "role": "client | admin",
  "firstName": "string",
  "lastName": "string",
  "createdAt": "timestamp"
}
```

#### `intakes` collection (`docId: referenceNumber`)
```json
{
  "referenceNumber": "string (e.g. MAG-2026-X892)",
  "status": "pending_review | in_progress | completed",
  "personalInfo": {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "ssn": "string",
    "dob": "string",
    "address": "string"
  },
  "taxProfile": {
    "taxYear": "number",
    "filingStatus": "string",
    "state": "string",
    "incomeSources": ["array"],
    "estimatedIncome": "string",
    "priorRefund": "string"
  },
  "submittedAtIso": "ISO date string"
}
```

#### `documents` collection (`docId: autoId`)
```json
{
  "clientUid": "string (references users/{uid})",
  "fileName": "string",
  "type": "w2 | 1099 | summary | other",
  "taxYear": "number",
  "storagePath": "string",
  "downloadURL": "string (pre-signed HTTPS URL)",
  "fileSize": "string",
  "payer": "string",
  "uploadedBy": "string (admin uid)",
  "uploadedAt": "timestamp",
  "status": "ready"
}
```

---

## 5. Security & Compliance Standards

1. **Role-Based Authorization**:
   - Clients only retrieve Firestore document records where `clientUid == currentUser.uid`.
2. **Pre-Signed Storage URLs**:
   - Files are stored in private Firebase Storage buckets. Access is granted through time-limited pre-signed download URLs.
3. **Automatic Profile Provisioning**:
   - If a newly authenticated user lacks a Firestore profile, the application automatically provisions a `users/{uid}` document based on email authorization.
4. **Audit Logging**:
   - Every login event, 2FA confirmation, preview, and download action is captured with timestamps and logged to memory/Firestore.
5. **GDPR Rights**:
   - Support for data portability exports and account deletion.

---

## 6. Design System & Brand Identity

The application strictly implements the **Magnitax Emerald** design system:

- **Primary Canvas**: `#090d16` (Deep Obsidian / Dark Mode)
- **Cards & Surfaces**: `#111827` and `#1f2937` with glassmorphism CSS backdrop filters
- **Primary Brand Accent**: `#10b981` (Magnitax Emerald)
- **Secondary Accent**: `#059669` (Deep Emerald hover state)
- **Typography**: Google Fonts — `Inter` (body text) and `Outfit` (headings)

---

## 7. Operational Status

- **Status**: Production Live Release v2.0.0
- **Live Portal**: [https://taxagentai062026.web.app](https://taxagentai062026.web.app)
- **Repository**: [https://github.com/whoisdesirtech/Designing-Magnitax-Client-Portal](https://github.com/whoisdesirtech/Designing-Magnitax-Client-Portal)
