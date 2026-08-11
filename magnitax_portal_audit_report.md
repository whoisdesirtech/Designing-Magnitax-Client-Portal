# MagniTax Portal — Existing Application Audit & MVP Gap Analysis

> Full audit report, ready to paste into ChatGPT.
> App: vanilla HTML/CSS/JS SPA on Firebase Hosting (taxagentai062026.web.app)
> Repo: ~/Desktop/vibe-coding/Vibe Coding Mastery/magnitax-portal-prototype

Audit complete. No code changes made. Here is the full report.

---

# PART 1 — INVENTORY OF WHAT EXISTS

## Architecture at a glance
Vanilla **HTML/CSS/JS single-page app** on Firebase Hosting (`taxagentai062026.web.app`). No build step, no framework, no backend server, no Cloud Functions, no email service. All "backend" is direct client-side Firebase SDK calls.

| Layer | Tech | Present? |
|---|---|---|
| Frontend | Vanilla HTML5/CSS3/ES6 (SPA, `data-view`/`data-page` routing) | ✅ |
| Hosting | Firebase Hosting (site `taxagentai062026`) | ✅ |
| Auth | Firebase Auth (email/password, compat SDK 10.8.0) | ✅ |
| Database | Cloud Firestore | ✅ |
| Storage | Firebase Storage | ✅ |
| Backend server / Cloud Functions | — | ❌ none |
| Email / SMS / notifications service | — | ❌ none |

## Frontend inventory (`public/index.html`)

**Views (routed by `body[data-view]` in app.js:221):**
- `login` — email/password + quick-fill buttons + dead "Forgot Password?" link
- `2fa` — 6-digit TOTP-style input gate
- `app` — main shell (sidebar + header + page viewport)

**Sub-pages (`main[data-page]`):**
- `dashboard` — welcome banner, stat cards (doc count, deadline, 2FA status), audit-trail panel, "Your Tax Preparer" card, secure-message button (a `prompt()` stub)
- `documents` — search, year filter, type tabs (All/W-2/1099/Summary), card gallery with Preview/Download
- `intake` — 3-step wizard (Personal Info → Tax Profile → Documents) + confirmation step
- `settings` — notification toggles, 2FA status card, GDPR export/erasure buttons
- `admin-intakes` — Firestore intakes table w/ status filter + inspector modal (shows SSN/DOB)
- `admin-leads` — leads pipeline table w/ "Convert to Client"
- `admin-vault` — upload form (client select, year, type, title, payer, file)
- `admin-training` / `admin-developer-training` — iframes to `training.html`/`developer-training.html`

**Components/modals:** doc card gallery, filter bar, preview modal, admin intake detail modal, notification dropdown, role switcher, sidebar, stat cards, toast alerts, intake stepper, drag-drop zones.

## Backend inventory
There is **no server**. Firestore is the "API". Client-side logic in `public/app.js`:

| Concern | Implementation | Location |
|---|---|---|
| Login | `auth.signInWithEmailAndPassword` + **auto-registration fallback** | app.js:265-307 |
| Session | `auth.onAuthStateChanged` | app.js:325-400 |
| Role detection | Firestore `users/{uid}` → fallback: email heuristic (`admin`/`kaelen`/`cpa` ⇒ admin) | app.js:330-361 |
| Role switch | client-side toggle of `activeUserRole` (no check) | app.js:1534-1546 |
| Upload | `storage.ref(path).put(file)`, 25 MB client check | app.js:2013-2103 |
| Download | cached `downloadURL` from Firestore, else `storage.getDownloadURL()` | app.js:1024-1068 |
| Intake persist | `db.collection('intakes').doc(refNum).set(payload)` (SSN in plaintext) | app.js:1434 |
| Leads persist | `coffee.html` → `leads` collection | coffee.html:405-441 |
| Admin status update | `db.collection('intakes').doc(ref).update({status})` | app.js:1755 |
| Lead→client | creates `users/{uid}` + updates lead | app.js:1903-1954 |
| Audit logging | in-memory `AUDIT_LOGS` array only — **not persisted** | app.js:145, 469-505 |
| Notifications | in-memory `NOTIFICATIONS` array only | app.js:152-156, 515-573 |

## Database (Cloud Firestore)
Collections and fields (from code + `product_brief.md`):

- **`users`** (docId = Firebase uid): `{email, role: 'client'|'admin', firstName, lastName, createdAt}`. No license status, no preparer/adviser/CPA distinction, no invitation/activation fields.
- **`documents`** (docId = autoId): `{clientUid, fileName, type: 'w2'|'1099'|'summary'|'other', taxYear, storagePath, downloadURL, fileSize, payer, uploadedBy, uploadedAt, status: 'ready'}`. **Only status value that exists is `ready`** — no draft/published lifecycle.
- **`intakes`** (docId = `MTX-YYYY-NNNNNN`): `{referenceNumber, status: 'pending_review'|'in_progress'|'completed', personalInfo{firstName,lastName,email,phone,ssn,dob,address,company,spouse}, taxProfile{...}, documents{uploadedFiles:[{name,size,type}]}, submittedAtIso, assignedPreparer}`. SSN stored as plaintext string.
- **`leads`** (autoId): lead-magnet form data + `status: 'new'|'contacted'|'proposal_sent'|'converted'`.

**Firestore security rules** (`firestore.rules`) — the critical finding:

```
match /{document=**} { allow read, write: if request.auth != null; }
```

Every authenticated user can read/write **every** collection and document. No ownership scoping, no role checks, no per-collection rules.

## Storage (Firebase Storage)
- Path pattern: `documents/{clientUid}/{taxYear}/{type}/{timestamp}_{fileName}` (app.js:2046)
- **No `storage.rules` file exists in the repo** (managed in Firebase Console, unversioned, contents UNKNOWN).
- Download URLs come from `getDownloadURL()` (app.js:2065, 1038). These are **permanent** URLs carrying a download token — they do not expire and require no auth to fetch.
- The permanent `downloadURL` is also **persisted inside each `documents` doc**, which any authenticated user can read under current rules.
- File validation: client-side only — `<input accept>` list + 25 MB size check (app.js:2037). No server/PDF validation, no MIME check on upload.

## Authentication
- **Provider:** Firebase Auth, email/password.
- **Login:** `signInWithEmailAndPassword`; **any unrecognized email+password auto-creates an account** (app.js:283-289) — there is no invitation/allow-list gate.
- **2FA:** **Simulated.** Any 6 digits are accepted (app.js:436-453); comment admits real 2FA requires Blaze/phone auth. On page reload it is skipped entirely (app.js:389-392).
- **Password reset:** link exists in HTML (`#forgot-password-trigger`) but **has no handler**.
- **Email verification:** none. **Invitation/activation:** none. **Sessions:** Firebase-managed; no JWT/cookie handling in app code.

## Security
- **RBAC:** 2 roles (`client`/`admin`), enforced **only in the UI** (menu visibility via `data-role`, app.js:1504-1528). Nothing server-side.
- **Authorization middleware:** none (no server).
- **Rate limiting:** none.
- **Encryption:** TLS at Firebase edge; Firebase at-rest default. No app-level field encryption (SSN plaintext).
- **Secure cookies / CSRF:** N/A (Firebase SDK model), but no protection on admin actions either.
- **Audit logging:** in-memory only, cleared on refresh.
- **Access controls:** client document query filters by `clientUid` **client-side only** (app.js:592-595); rules do not enforce it.

---

# PART 2 — EXISTING USER TYPES vs. TARGET MODEL

The app has exactly **two** roles: `client` and `admin`. Everything else is conceptual.

| User Type | Exists? | Database Role | License Status | Current Permissions | Missing |
|---|---|---|---|---|---|
| Newsletter Free | ❌ | — | — | — | Entire user segment; newsletter model |
| Newsletter Paid | ❌ | — | — | — | Entire user segment; payments |
| Client Free | ❌ | `client` (only 1 client type) | n/a | Own-doc UI filter (unenforced), intake, settings, mock 2FA | Tier distinction, invite/activation |
| Client Paid | ❌ | `client` | n/a | same as above | Tier distinction, payments, published docs |
| Tax Preparer Free/Unlicensed | ❌ | — | — | — | Preparer role; license flag; client assignment |
| Tax Preparer Paid/Licensed | ❌ | — | — | — | Preparer role; license flag; assignment |
| Advisor Free/Unlicensed | ❌ | — | — | — | Whole role |
| Advisor Paid/Licensed | ❌ | — | — | — | Whole role |
| CPA Free/Unlicensed | ❌ | `admin` (subsumes all staff) | none | Everything: all intakes (incl. SSNs), all docs, uploads, leads | Real staff model |
| CPA Paid/Licensed | ❌ | `admin` | none | same as above | License flag |
| Admin | ⚠️ Partial | `admin` | none | All data; no separation from CPA | True super-admin separation |

**How the current app maps to the target:** `admin` is being overloaded as "any staff member + super admin". To support the MVP you need at minimum a **tax-preparer** actor distinct from clients and from super-admin. The recommendation is: keep `admin` as-is for today's single preparer; model `role` values as `client` / `preparer` / `admin` and add `licenseStatus` + `assignedClients` (or a `clientPreparers` join collection). Do **not** build the 11-type matrix now — that's the post-MVP business model, not MVP #1. (Follows your instruction: don't create new roles unless necessary.)

---

# PART 3 — MVP REQUIREMENT MATRIX

| # | MVP Requirement | Already Exists | Partially Exists | Missing | Location in Code | Recommended Change |
|---|---|---|---|---|---|---|
| 1 | Tax Preparer login | ✅ | | | app.js:265-307; index.html:40 | Keep; remove auto-registration fallback; real email verification |
| 2 | Tax Preparer dashboard | ⚠️ | | | `admin-intakes`, `admin-leads`, `admin-vault` pages | Consolidate into a preparer home w/ client list + docs |
| 3 | Client list | ⚠️ | | | app.js:1965-1994 (dropdown only), intakes table | Real client list page from `users`/`clients` collection |
| 4 | Add Client | ⚠️ | | | app.js:1903-1954 (convert lead→client) | Dedicated "Add Client" form |
| 5 | Client profile | ⚠️ | | | `users/{uid}` doc, intake `personalInfo` | Consolidate into a `clients` record |
| 6 | Client invitation | ❌ | | | none | Email link via Cloud Function |
| 7 | Client account activation | ❌ | | | none | Tokenized activation page |
| 8 | Password creation | ⚠️ | | | auto-register path only (app.js:286) | Real set-password during activation |
| 9 | 2FA | ⚠️ | | | app.js:436-453 (any 6 digits) | Real TOTP (via Identity Platform or a function issuing TOTP secret) |
| 10 | Client dashboard | ✅ | | | index.html:330; app.js:385-410 | Reuse as-is |
| 11 | Client documents | ✅ | | | app.js:585-698 | Reuse; fix rules |
| 12 | Upload document | ✅ | | | app.js:2013-2103 | Reuse; add server validation |
| 13 | Tax year selection | ✅ | | | index.html:1058-1064 | Reuse |
| 14 | Document type selection | ✅ | | | index.html:1067-1074 | Reuse |
| 15 | PDF validation | ⚠️ | | | `<input accept>` + 25MB only (app.js:2037) | Server-side MIME/magic-byte + size check |
| 16 | Draft document status | ❌ | | | status hardcoded `'ready'` (app.js:2079) | Add `status: draft/published`, filter client query |
| 17 | Document preview | ⚠️ | | | app.js:715-1007 renders a **mock** IRS form, not the real file | Replace with real PDF preview of the stored blob |
| 18 | Replace document | ❌ | | | none | Re-upload overwrite + versioning |
| 19 | Publish to client | ❌ | | | upload publishes immediately | Draft→publish action + status gate |
| 20 | Client notification | ⚠️ | | | in-memory `NOTIFICATIONS` only | Firestore `notifications` doc + email |
| 21 | Published/Available status | ❌ | | | none | `status` field on document |
| 22 | Secure download | ⚠️ | | | app.js:1024-1068 (permanent URL) | Signed/expiring URLs via function, rules-gated |
| 23 | Client ownership authorization | ❌ | | | rules are open; clientUid filter is client-side | Enforce `clientUid == uid` in Firestore rules |
| 24 | Preparer→Client authorization | ❌ | | | no assignment model | `assignedClients`/join collection + rules |
| 25 | Audit logging | ⚠️ | | | in-memory only (app.js:145,469) | Persist to `auditLogs` via rules/function |

---

# PART 4 — WORKFLOW TRACES

### A. User logs in
```
Login form (index.html:40, app.js:265)
  ↓ auth.signInWithEmailAndPassword — on failure: createUserWithEmailAndPassword (auto-register)
  ↓ onAuthStateChanged (app.js:325) → reads users/{uid}
  ↓ Role detection: users/{uid}.role, fallback email-heuristic (app.js:337)
  ↓ applyRoleUI() → data-role=admin|client (app.js:1504)
  ↓ 2FA gate — accepts any 6 digits (app.js:436) → enterApp()
  ↓ navigatePage('dashboard') (app.js:229)
```
Actual functions: `loginForm submit handler` (265), `auth.onAuthStateChanged` (325), `enterApp` (403), `applyRoleUI` (1504).

### B. A client is created
There is **no "Add Client" flow**. The closest paths:
```
Lead (coffee.html → leads) ─→ convertLeadToClient (app.js:1903)
  ↓ creates users/{uid} with role='client', marks lead converted
  ↓ loadAdminClientDropdown (app.js:1965) reloads client <select>
  ✗ NO invitation, NO email, NO activation, NO password for the client
```
Or anyone can register themselves at login (app.js:286). The intake wizard is **client-initiated**, not preparer-initiated.

### C. A document is uploaded
```
Admin vault form (index.html:1049; app.js:2013)
  ↓ client-side: size ≤25MB (app.js:2037), file existence
  ↓ storage.ref(`documents/{clientUid}/{year}/{type}/{ts}_{name}`).put(file) (app.js:2046-2048)
  ↓ on complete: getDownloadURL() (permanent token URL)
  ↓ db.collection('documents').add({... , status:'ready'}) (app.js:2068)
  ↓ loadClientDocuments() refreshes the admin's own list
  ✗ No draft state — document is immediately visible/ready
  ✗ No PDF validation beyond accept-list
  ✗ No notification to client
```

### D. A document is downloaded
```
Client doc card → triggerDocDownload (app.js:1024)
  ↓ uses doc.downloadURL (persisted) OR storage.getDownloadURL()
  ↓ <a href=url target=_blank download> — browser fetches directly
  ↓ Audit log entry appended to in-memory AUDIT_LOGS (not persisted)
```
**Security verdict for this flow: NOT SECURE.** The URL is a permanent, unauthenticated Firebase download-token URL; it is stored in a Firestore record any authenticated user can read; there is no server check of ownership; download events are never persisted.

---

# PART 5 — SECURITY AUDIT

> Method note: this is a **static code audit**. The rules file (`firestore.rules`) and code make each outcome deterministic without needing a live exploit, and I did not modify or probe the production Firebase project. Several checks (permanent-URL expiry, live token validity) are flagged UNKNOWN because `storage.rules` is not in the repo and I have no Console access.

| Question | Verdict | Why |
|---|---|---|
| Client access another client's document? | **FAIL** | `firestore.rules:5` allows any authenticated read of all docs. The `where('clientUid','==',uid)` filter is client-side only (app.js:592). A user can query without the filter or read a doc by ID. |
| Manipulate URL/doc ID to access another doc? | **FAIL** | Auto-ID doc reads are unguarded; permanent `downloadURL` is readable and directly fetchable. |
| Documents publicly accessible? | **FAIL (effectively)** | `getDownloadURL()` yields a permanent unauthenticated URL (app.js:2065) persisted in Firestore readable by any auth'd user. Bucket rules themselves UNKNOWN (no `storage.rules` in repo). |
| Download URLs permanent? | **PARTIAL** | They are Firebase download-token URLs — permanent until the token is manually revoked. README calls them "pre-signed"; they are not expiring. |
| Server verify ownership? | **FAIL** | No server exists; all checks are client-side; rules do not verify ownership. |
| Preparer access only to assigned clients? | **NOT IMPLEMENTED** | No assignment model. Every `admin` sees every intake (incl. SSNs, app.js:1584) and every document (app.js:596). |
| Draft doc accessible by client? | **NOT IMPLEMENTED** | No draft concept; all docs written `status:'ready'` (app.js:2079) and shown to clients. |
| Download logged? | **FAIL** | Log entry only appended to in-memory `AUDIT_LOGS` (app.js:1056); lost on refresh; never persisted. |
| Publication logged? | **NOT IMPLEMENTED** | No publication event exists. |

Additional critical findings (not in your list but material):
1. **Self-service privilege escalation:** any visitor can type an email containing "admin", "kaelen", or "cpa" and auto-register with `role='admin'` (app.js:283-289, 337).
2. **Client can open the admin console:** the role switcher toggles `activeUserRole` with zero authorization (app.js:1534-1546), exposing SSNs, DOB, all intakes, all documents.
3. **Open Firestore writes:** rules allow any authenticated user to write any doc — including overwriting `users/{uid}` (set own role to `admin`) or mutating other users' docs.
4. **2FA bypass:** any 6 digits pass (app.js:439), and reload skips 2FA entirely (app.js:389-392).
5. **SSN stored in plaintext** in `intakes` (app.js:1388) and rendered in the admin modal (app.js:1695).
6. **Intake "document upload" stores only metadata** `{name,size,type}` — files are never actually uploaded (app.js:1414-1418).
7. **Document preview does not show the real file** — it renders a hardcoded mock IRS form with `details` fields (app.js:756-993).

---

# PART 6 — NO CODE CHANGES MADE
Confirmed. This was read-only analysis.

---

# PART 7 — FINAL REPORT

## 1. Executive Summary
**What already exists (and is genuinely reusable):** a polished, branded SPA (client dashboard, document gallery with search/filter, multi-step intake wizard, admin intakes queue, admin upload→Storage→Firestore pipeline, leads pipeline with one-click client creation), real Firebase Auth email/password, real Firestore + Storage wiring, and a live Hosting deployment.

**What is missing for MVP #1 (the 10-step flow):** invitation/activation (none), real 2FA (simulated), draft→publish lifecycle (none; everything is instantly `ready`), client notification (in-memory only, no email), secure ownership (Firestore rules are wide open), preparer→client assignment (none), secure downloads (permanent unauthenticated URLs), and persistent audit logging (in-memory only).

**How close to MVP:** Functionally about **40–50%** of the screen real-estate exists (dashboards, lists, upload UI, document UI). Operationally the workflow is **0% secure** and the publish/notify/activation chain does not exist — the current app is a polished **demo prototype**, not yet a production MVP. The gap is less about building new screens than about building the secure backend logic (rules, functions, email, status lifecycle) that everything currently lacks.

## 2. MVP Readiness Score: **35 / 100**
- **UI/frontend infrastructure (reusable):** ~40% present.
- **Auth:** partial (login exists) but activation, invite, real 2FA, verification missing → effectively blocks the flow.
- **Backend security:** 0% — open rules, no server, no ownership enforcement; must be built from scratch.
- **Workflow state machine (draft→review→publish→notify):** 0% — the single most important missing layer.
- Each of the 10 MVP steps must be able to complete **securely**; today only a few complete at all, and those insecurely.

## 3. Critical Blockers
1. **Firestore rules are open** — clients can read/write every document, every user, every intake. Blocks security + makes ownership unenforceable. (Blocking for steps 5, 22, 23, 24.)
2. **No invitation/activation flow** — Tax Preparer cannot create/invite a client; no activation token, no email. (Blocking for steps 1–8.)
3. **No document status lifecycle** — no draft/published; client sees everything the moment it's uploaded. (Blocking for steps 16, 19, 21.)
4. **Permanent, unauthenticated download URLs** persisted in readable Firestore — cannot ship 1040 downloads securely as-is. (Blocking for step 22.)
5. **No real 2FA** — simulated only; blocked on Firebase plan/function work. (Blocking for step 9.)
6. **No email/notification service** — no invite, no activation, no publish notification. (Blocking for steps 6, 7, 20.)
7. **No persistence for audit logs** — compliance/auditability absent. (Blocking for step 25.)
8. **Auto-registration + email-heuristic role assignment** — anyone can become admin. (Blocking for steps 1–2, 24.)

## 4. Recommended Implementation Order (smallest sequence, maximize reuse)
```
Task 1  Harden firestore.rules: read/write scoped to ownership + roles (users, documents, intakes, leads, auditLogs). Deny-all default.
Task 2  Add storage.rules file; keep bucket private; restrict writes to preparer/admin paths.
Task 3  Add Cloud Functions (Node): sendInvite, activateAccount, setPassword, generateDownloadUrl (short expiry), recordAudit, notifyClient. Add email via a provider.
Task 4  Add client invitation UI (preparer) → writes pending invite + sends email link.
Task 5  Add activation page: token validation → create Firebase user → set password → enable 2FA (TOTP).
Task 6  Add document status lifecycle: draft | published on documents; hide non-published from client query; add "Publish" action + email/notification.
Task 7  Replace download logic with expiring signed URL from the function; remove persisted downloadURL.
Task 8  Persist audit log writes (function or rules-audited) for login, 2FA, upload, publish, download.
Task 9  Add preparer→client assignment (assignedClients array on users/{preparerUid} or clientPreparers); scope admin queries by it.
Task 10 Remove auto-registration + email-heuristic admin; enforce role from Firestore/claims only. Client sees own docs only; prepare list page.
Task 11 Reuse existing UI: prep dashboard links to existing admin-vault uploader; client dashboard/document gallery reused as-is once rules land.
```
Reuse-first rule: **Tasks 1–3 are new backend; Tasks 4–11 are thin UI/glue over the existing components.**

## 5. Files Likely to Modify
- **Frontend:** `public/index.html` (add invite/activation views, publish buttons, status badges), `public/app.js` (call new functions, status filters, remove auto-register), `public/style.css` (new states), possibly `public/activate.html` (separate activation page).
- **Backend:** new `functions/index.js` + `functions/package.json` (Cloud Functions: invite, activate, sign, publish, audit, notify), `firebase.json` (add `"functions"`).
- **Database:** `firestore.rules` (ownership/role scoping), new collections: `invites`, `auditLogs`, `notifications`; extend `documents` with `status`, `version`, `publishedAt`.
- **Authentication:** Firebase project config (enable TOTP/Identity Platform), remove auto-registration path, activation flow, `sendPasswordResetEmail` wiring for the dead "Forgot Password?" link.
- **Storage:** new `storage.rules` (private bucket, preparer-only write), path layout stays `documents/{clientUid}/{year}/{type}/…`.
- **Email/Notifications:** new provider integration (in Cloud Function) for invite/activation/publish emails; Firestore `notifications` docs for in-app bell.
- **Security:** Cloud Function signing (expiring URLs), audit log writes, rate limiting (or App Check + Firebase Security Rules).

## 6. Files That Should NOT Be Modified (reuse as-is)
- `public/app.js` **document gallery + filters** (585-698) — once rules enforce ownership, this works.
- `public/app.js` **upload pipeline** (2013-2103) — Storage→Firestore flow is sound; only add server validation/status.
- `public/index.html` **client dashboard** (330-429), **intake wizard** (578-915), **admin intakes table** (920-972), **upload form** (1039-1115).
- `public/style.css` — the whole Emerald design system.
- `public/coffee.html` leads writer, `public/landing.html`, `flyer.html`, `pitch_deck.html`, `training.html`, `developer-training.html` — marketing/docs, out of MVP scope.

## 7. Architecture Diagram
**Current architecture (as-built):**
```
Browser (index.html/app.js — all logic & security client-side)
  ├── Firebase Auth ──────────────► email/password, onAuthStateChanged, mock 2FA
  ├── Firestore (rules = OPEN) ────► users, intakes (plaintext SSN), documents (persisted downloadURL), leads
  ├── Firebase Storage (no rules in repo) ──► documents/{clientUid}/{year}/{type}/…
  └── Firebase Hosting ───────────► taxagentai062026.web.app
        ▲ NO server / NO Cloud Functions / NO email / NO persistent audit
```

**Proposed MVP workflow on the existing architecture:**
```
Preparer (admin-vault page) ─────────────────────► add client → invite (fn) → email link
Client opens link ──► activation (fn) ──► set password ──► real 2FA (TOTP)
Preparer uploads 1040 (reuse admin-vault) ──► Storage ──► documents{draft} + audit
Preparer reviews ──► Publish (fn) ──► status=published ──► notify (fn) → email + in-app bell
Client logs in (2FA) ──► dashboard (reuse) ──► query documents where clientUid==uid AND status==published (rules-enforced)
Client downloads ──► function issues short-lived signed URL ──► 1040 delivered ──► audit log persisted
```

## 8. Questions / Unknowns (not guessed)
1. **`storage.rules`** — not in the repo; current bucket access is UNKNOWN. Must be pulled from the Firebase Console.
2. **Live data** — whether the production Firestore already holds real client PII/SSNs, and whether those intakes/leads records must be migrated.
3. **Firebase plan** — code comments say real 2FA requires the Blaze plan; need confirmation of billing tier to know which features (TOTP via Identity Platform, Cloud Functions) are usable.
4. **Email provider** — none exists; Gmail SMTP vs. Resend/SendGrid/Postmark is a product decision.
5. **Preparer model** — is there a single preparer (Marcus) or multiple? Determines whether `assignedClients` lives on the user doc or a join collection.
6. **"Form 1040" definition** — the app models `type: summary` for the 1040 summary; is the MVP's "2025 Form 1040" that summary, or the full 1040 PDF?
7. **GitHub repo** — `origin` is `whoisdesirtech/Designing-Magnitax-Client-Portal`; the working tree is 1 commit ahead of `origin/main` with uncommitted changes (firebase.json, app.js, index.html, style.css + untracked firestore.rules, training.html). Confirm the target branch/repo for the MVP branch before work begins.
8. **Admin test accounts** — `admin@magnitax.com` / `jane@example.com` are hardcoded with fixed passwords and exposed in the UI; are these safe to keep or must they be rotated?

No files were modified. When you're ready, we can turn Section 4 (implementation order) into a concrete plan.