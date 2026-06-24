# Walkthrough: Magnitax Client Portal

I have completed the two primary deliverables for the secure client portal project for **Magnitax.com**:
1. **[Product Brief](file:///Users/jeanfils/.gemini/antigravity/brain/4617c157-235a-40b2-bc54-6910a503c8fc/product_brief.md)**: A detailed development specification matching the RISEN framework.
2. **Interactive UI/UX Prototype**: A premium, responsive, glassmorphic client portal demonstration built in the project directory:
   - [index.html](file:///Users/jeanfils/Desktop/vibe-coding/Vibe%20Coding%20Mastery/magnitax-portal-prototype/index.html)
   - [style.css](file:///Users/jeanfils/Desktop/vibe-coding/Vibe%20Coding%20Mastery/magnitax-portal-prototype/style.css)
   - [app.js](file:///Users/jeanfils/Desktop/vibe-coding/Vibe%20Coding%20Mastery/magnitax-portal-prototype/app.js)

---

## 1. Architectural Highlights (From the Product Brief)

The [product_brief.md](file:///Users/jeanfils/.gemini/antigravity/brain/4617c157-235a-40b2-bc54-6910a503c8fc/product_brief.md) document contains structural and secure development details for an engineering team:
- **[R] Requirements**: Functional parameters, administrative vs. client operations, and detailed authorization levels.
- **[I] Integration**: API design for secure CRM syncing, MongoDB collections schema structures, and a secure WordPress single sign-on (SSO) design utilizing a shared secret JWT verification handshake.
- **[S] Security**: Password hashing with `bcrypt` (12 rounds), Multi-factor TOTP secrets encrypted with AES-256 in MongoDB, short-lived AWS S3 pre-signed file URLs, cookie sessions flagged with `HttpOnly`, `Secure`, and `SameSite=Strict`, Express rate limiters, and GDPR compliance facilities (Right to Portability & Right to Erasure).
- **[E] Experience**: UX page map, design token variables (dark emerald, Outfit/Inter typography), state-switching workflows, and UI grids.
- **[N] Next Steps**: Detailed technical stacks, cloud VPS/Vercel/S3 deployment pipeline, timeline Gantt chart, and explicit QA verification guidelines.

---

## 2. Interactive Prototype Operations

The frontend prototype lets you click through the security login, dynamic document tables, and security controls:

### Secure Authentication & 2FA Flow
1. Load [index.html](file:///Users/jeanfils/Desktop/vibe-coding/Vibe%20Coding%20Mastery/magnitax-portal-prototype/index.html) in any web browser.
2. The login screen is pre-loaded with simulated credentials (`jane.doe@example.com` / `password123`). Click **Authenticate Session**.
3. You are presented with a secure **Two-Factor Authentication** prompt.
4. Input the 2FA passcode: **`123456`** (or any 6 digits starting with `1`, `2`, or `3`). The inputs automatically advance focus as you type. Click **Verify & Unlock Account**.

### Client Dashboard Console
- **Banner Info**: Displays tax filing status updates.
- **Stat Indicators**: Dynamic counts of document totals (W-2s, 1099s, summaries) and security status.
- **Audit Trails**: Live list of security actions. Click **Clear logs** to verify that state updates flush safely.
- **Tax Preparer Widget**: Contact info card representing Marcus Kaelen, CPA. Click **Send Secure Message** to trigger a simulated encrypted feedback popup.

### Document Center
- Navigate to the **Documents Center** using the sidebar.
- **Filtering System**:
  - Filter using the **Tax Year** selector dropdown (All, 2025, 2024, 2023).
  - Filter using the **Document Type** tabs (All, W-2, 1099, Form Summaries).
- **Search Engine**: Type in the search bar (e.g., "NEC", "Fidelity", "W2") to witness instant, real-time list filtering.
- **PDF Inline Viewer**: Click **Preview** on any document. A dark backdrop modal opens to display a high-fidelity rendering of an actual IRS document (styled Form W-2 boxes with wages/tax parameters, 1099 nonemployee compensation fields, or Form 1040 refund spreadsheets) with a security watermark.
- **Download Handler**: Click **Download** on a card or inside the preview modal. The prototype dynamically compiles a secured plain-text document wrapper representing the S3 stream and downloads it to your machine while appending a download marker to the security audit trail.

### Settings Panel
- Toggle email, in-app, or security alert settings, and save preferences.
- GDPR privacy features:
  - Click **Export All Data** to compile your current session details, audit logs, and document lists into a single downloadable JSON data payload (`magnitax_gdpr_export_usr_jane_doe_993.json`).
  - Click **Request Erasure** to trigger a GDPR Article 17 account removal request.

---

## 3. How to Set up the Active Workspace

To explore the code structure directly inside the editor, follow these steps:

1. Recommended: Set the prototype directory as your active workspace:
   ```
   /Users/jeanfils/Desktop/vibe-coding/Vibe Coding Mastery/magnitax-portal-prototype
   ```
2. Double-click the file [index.html](file:///Users/jeanfils/Desktop/vibe-coding/Vibe%20Coding%20Mastery/magnitax-portal-prototype/index.html) or run a simple local server to view the interface:
   ```bash
   # Option A: Open directly in macOS
   open "/Users/jeanfils/Desktop/vibe-coding/Vibe Coding Mastery/magnitax-portal-prototype/index.html"
   
   # Option B: Run a simple Python server to view via localhost
   python3 -m http.server 8000 --directory "/Users/jeanfils/Desktop/vibe-coding/Vibe Coding Mastery/magnitax-portal-prototype/"
   # Open browser to: http://localhost:8000
   ```

---

## 4. Visual Design Target (Gold Theme)

Here is the high-fidelity UI mockup illustrating how the gold accents (`#D4AF37`) integrate with the glassmorphic dark charcoal layout for a premium, secure presentation:

![Gold Theme Portal Mockup](/Users/jeanfils/.gemini/antigravity/brain/4617c157-235a-40b2-bc54-6910a503c8fc/portal_gold_theme_mockup_1782333295901.png)

