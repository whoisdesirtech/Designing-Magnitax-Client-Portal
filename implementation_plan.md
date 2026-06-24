# Implementation Plan: Magnitax Secure Client Portal

We will design and develop the secure client portal project for **Magnitax.com** by delivering:
1. A highly detailed, actionable **Product Brief** covering all RISEN requirements.
2. A premium, interactive **UI/UX Prototype** representing the client portal. This prototype will showcase a modern, secure dashboard, document list (W-2s, 1099s, summaries), notification settings, and mock 2FA authentication flow, matching the aesthetic quality of Canopy or Honeybook.

The prototype will be built inside the project directory: `/Users/jeanfils/Desktop/vibe-coding/Vibe Coding Mastery/magnitax-portal-prototype`.

---

## User Review Required

> [!IMPORTANT]
> The primary deliverable is a comprehensive Product Brief. To make the UI/UX specifications tangible, we will also implement a fully interactive, responsive frontend prototype (HTML, CSS, and JS) that runs locally. Please review the proposed outline for the Product Brief and the scope of the prototype.

---

## Proposed Changes

### [Product Brief Component]

#### [NEW] [product_brief.md](file:///Users/jeanfils/.gemini/antigravity/brain/4617c157-235a-40b2-bc54-6910a503c8fc/product_brief.md)
A comprehensive product brief covering:
- **[R] Requirements**: Functional and non-functional requirements, data mapping, and user roles.
- **[I] Integration**: API design (RESTful/GraphQL endpoints), data models (JSON schemas), CRM/document storage connectors (SharePoint, AWS S3, Salesforce), WordPress SSO and data exchange strategy.
- **[S] Security**: Client authentication, MFA/2FA, end-to-end encryption (TLS, AES-256), GDPR/compliance controls, session management, CSRF/XSS, and audit logs.
- **[E] Experience**: UX flows, responsive layouts, page-by-page specs, design token guidelines (color palette, typography, micro-interactions).
- **[N] Next Steps**: MERN stack components, cloud deployment (AWS/Heroku), testing strategy (unit, E2E, penetration), phases of development, and acceptance criteria.

---

### [Interactive Prototype Component]

We will build a responsive, single-page application prototype using modern web standards (vanilla HTML5, CSS3, and ES6 JavaScript) to ensure high performance and direct local execution without complex compilation.

#### [NEW] [index.html](file:///Users/jeanfils/Desktop/vibe-coding/Vibe%20Coding%20Mastery/magnitax-portal-prototype/index.html)
The main shell containing the routing logic and page layouts (login, 2FA prompt, client dashboard, documents view, document details modal, settings/notifications panel).

#### [NEW] [style.css](file:///Users/jeanfils/Desktop/vibe-coding/Vibe%20Coding%20Mastery/magnitax-portal-prototype/style.css)
Premium, responsive style system with custom CSS variables, dark/light styling (focused on a high-end dark theme matching Canopy/Honeybook aesthetics), glassmorphism, micro-animations, custom scrollbars, and sidebar/mobile layout adjustments.

#### [NEW] [app.js](file:///Users/jeanfils/Desktop/vibe-coding/Vibe%20Coding%20Mastery/magnitax-portal-prototype/app.js)
Client-side interactivity and state management, simulating:
- User login and 2FA code verification.
- Document loading, searching, filtering by year/type (W-2, 1099, Summary).
- Document downloading and previewing.
- In-app notification popups and notification settings management.
- Dynamic responsive sidebar toggles.

---

## Verification Plan

### Manual Verification
- We will instruct the user to open the prototype's [index.html](file:///Users/jeanfils/Desktop/vibe-coding/Vibe%20Coding%20Mastery/magnitax-portal-prototype/index.html) directly in any web browser.
- We will verify the interactive flows: logging in, entering 2FA code, navigating tabs (Dashboard, Documents, Notifications, Settings), filtering documents, triggering downloads/previews, and toggling dark/light settings if applicable.
- We will review the detailed Product Brief markdown document for completeness against all RISEN requirements.
