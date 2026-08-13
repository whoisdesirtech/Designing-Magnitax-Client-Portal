# Magnitax Portal — Current Architecture & MVP Audit

> Current state of the Magnitax Secure Client Portal as of this audit.
> Captures what exists, what is secured, what costs what, and the Spark-compatible MVP path agreed for development.
> This audit is the baseline **before further architectural changes**.

---

## 1. Current Environment

- **Repo:** `magnitax-portal-prototype`
- **Current branch:** `feature/harden-security-rules`
- **Hosting:** `taxagentai062026.web.app`
- **Firebase plan:** Spark
- **Billing:** No billing account

---

## 2. Completed Work

The following work is complete and **unmerged** (all on the current branch, tracked under `[Unreleased]` in `CHANGELOG.md`):

### `2371772` — Hardened security rules

- Replaced the permissive `allow read, write: if request.auth != null` catch-all in Firestore with **role- and path-scoped rules** (`firestore.rules`).
- Clients can now only read **their own** `documents`.
- Only admins write `documents`.
- Only admins read/update `intakes` (SSN/DOB live there).
- Only admins read/update/delete `leads`; public marketing forms may still create.
- Added `storage.rules` (private bucket): clients read only within their own `documents/{clientUid}/...` folder; only admins write.
- Registered `storage.rules` and `functions` in `firebase.json`.

### `22d5e5e` — Removed auto-register and email-heuristic admin

- Login now authenticates **existing accounts only** (`auth.signInWithEmailAndPassword`, no `createUserWithEmailAndPassword` fallback).
- Roles come **exclusively** from the Firestore `users/{uid}.role` document.
- Removed the `admin`/`kaelen`/`cpa` email-heuristic admin check and the client↔admin **role switcher**.
- New users without a profile default to `client` and get a client-role profile created.

### `0d1a61b` — Cloud Functions scaffold

- Added `functions/` (Node 20, firebase-functions v6):
  - `auditDocumentCreated` — Firestore trigger writes a trusted server-side `auditLogs` entry when a document is published.
  - `auditIntakeCreated` — Firestore trigger records intake submissions (SSN/DOB are **not** copied into the audit log).
  - `auditDocumentUploaded` — Storage finalize trigger records uploads under `documents/{clientUid}/...`.
  - `sendNotificationEmail` — callable **stub** for task 8 (Resend), returns `not-configured` so the client can detect it cleanly.
- Replaces the in-memory `AUDIT_LOGS` array with a server-written `auditLogs` trail.
- **Not deployed** (deployment requires Blaze — see §4 and §8).

---

## 3. Current Security Model

### In place

- **Firestore role/path-scoped rules** — deny-all default; reads/writes scoped to ownership and role.
- **Client own-document access** — a client may read `documents/{docId}` only when `resource.data.clientUid == request.auth.uid`.
- **Admin document/intake/lead access** — admins (identified by `users/{uid}.role == 'admin'`) may write `documents`, and read/update/delete `intakes` and `leads`.
- **Server-only `auditLogs`** — clients cannot write `auditLogs` (`allow write: if false`); writes are server-side only (Admin SDK bypasses rules); admins may read.
- **Private Storage bucket** — clients read only inside their own `documents/{clientUid}/...` folder; admins write.
- **Existing-user authentication** — login authenticates existing accounts only; no public auto-registration.
- **Roles sourced from `users/{uid}.role`** — no email heuristics, no client-side role switching.

### Remaining role-escalation issue

`firestore.rules:14` — the current `users/{userId}` rule allows a user to `update` their own document (`request.auth.uid == userId`), and the update is not constrained.

> Incoming self-write must not be allowed to change the user's existing role.

A client must not be able to set `users/{uid}.role = 'admin'` on their own profile. The rule must deny role changes on self-write (e.g., `request.resource.data.role == resource.data.role` for non-admin self-updates). See §7 task 1.

---

## 4. Firebase Cost/Capability Findings

### Spark-Compatible

- Firestore
- Storage
- Hosting
- Email/password Authentication
- Local Firebase emulators

### Requires Blaze

- **Cloud Functions deployment.** The Firebase CLI refuses to deploy functions on Spark (billing required to enable `cloudbuild.googleapis.com`). This is the only strict blocker found.

### Identity Platform

- **Real TOTP 2FA requires Firebase Authentication with Identity Platform.** TOTP MFA (`multiFactor()` / `TotpMultiFactorGenerator`) only exists in upgraded projects.
- The audit found Identity Platform **can be enabled on Spark** — it does not inherently require Blaze.
- The stated Spark limitation: **3,000 DAU/day** (daily active users) for Tier 1 providers (email/password included).
- On Blaze the free tier is 50,000 MAU, then pay-per-MAU. **No billing upgrade is being made** as part of this audit.

---

## 5. MVP Architecture Decision

**For now: KEEP FIREBASE ON SPARK.**

- **Do not deploy Cloud Functions.**
- Use the **Firebase Local Emulator Suite** for Functions development.
- Implement the MVP **without requiring deployed Cloud Functions**.

---

## 6. MVP Workflow

```
CPA / Lead Tax Preparer
  ↓
ProConnect
  ↓
Download actual completed 1040 PDF
  ↓
Magnitax Portal
  ↓
Assigned Client
  ↓
Upload 1040
  ↓
Draft
  ↓
Preview
  ↓
Publish
  ↓
Client Notification
  ↓
Client Login
  ↓
View 1040
  ↓
Secure Download
```

**Magnitax does NOT prepare or generate the 1040.**

The source document is the **actual PDF downloaded from ProConnect**.

---

## 7. Spark-Compatible MVP Tasks

The remaining MVP work is organized around:

1. **Close role escalation hole** — Firestore rule denying role changes on self-write.
2. **Client invitation** — Tax Preparer invites a client.
3. **Client activation** — invited client activates their account.
4. **Existing-user authentication** — activate/login existing accounts (no public auto-registration).
5. **2FA decision** — choose Option A or Option B (see §10).
6. **Actual 1040 upload** — Tax Preparer uploads the actual ProConnect 1040 PDF.
7. **Draft/publish workflow** — document status lifecycle (`draft` → `published`).
8. **Client notification** — client is notified/instructed when a document is published.
9. **Secure download** — client securely downloads the actual 1040.
10. **Audit logging** — persistent audit trail for login, upload, publish, download.
11. **End-to-end testing** — full MVP flow verified against §11.

All tasks must be implementable on Spark (no deployed Cloud Functions).

---

## 8. Cloud Functions

**Status: DEFERRED**

**Reason:** Deployment requires Blaze.

- The existing `functions/` scaffold **may remain** in the repository for development/testing with the **Local Emulator Suite**.
- **Do not delete it.**
- It will not be deployed while the project stays on Spark.

---

## 9. Email

**Current limitation:** The **Resend API key should not be exposed client-side.** Sending via Resend from the browser is not acceptable.

**For the Spark MVP**, the currently proposed alternatives from the audit are:

- **Hosted form API** — a form-backend service triggered from the client.
- **EmailJS / Web3Forms** — hosted email forwarding services usable without a backend.
- **Manual activation-link delivery** — the Tax Preparer delivers the activation link to the client directly.

**Do not implement a paid backend without approval** (see §12).

---

## 10. 2FA

Two explicit options are presented:

- **Option A:** Enable Firebase Authentication with Identity Platform **while remaining on Spark** and implement real TOTP.
  - Accepts the Spark limit of **3,000 DAU/day**.
  - No billing upgrade required.
- **Option B:** Keep the current 2FA **UI gate** for the prototype and defer real TOTP until production hardening.

**This decision will not be made silently.** It is flagged as an open decision (MVP task 5) and requires explicit approval.

---

## 11. Definition of MVP

The MVP is successful when **one test client** can complete:

```
Tax Preparer creates/invites client
  → Client activates account
  → Client logs in
  → Tax Preparer uploads actual ProConnect 1040 PDF
  → Document is Draft
  → Tax Preparer previews
  → Tax Preparer publishes
  → Client receives notification/instructions
  → Client logs in
  → Client views actual 1040
  → Client securely downloads actual 1040
```

---

## 12. Cost Constraint

**The project is pre-funded.**

**Target infrastructure cost during MVP development: $0/month.**

Do **not**:

- upgrade Firebase to Blaze
- deploy Cloud Functions
- add paid APIs
- add paid SaaS infrastructure

**without explicit approval.**

---

## 13. Production Readiness

Clearly distinguish:

**PROTOTYPE / MVP DEVELOPMENT**

from

**PRODUCTION USE WITH REAL TAX DOCUMENTS**

Do **not** represent the current Spark prototype as production-ready for real sensitive client tax documents until the security and authentication requirements have been validated.

---

## 14. Next Step

After creating the audit document, **STOP**.

- Do **not** modify application code yet.
- Wait for approval of the implementation path.
