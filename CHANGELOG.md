# Changelog

All notable changes to the **Magnitax Secure Client Portal** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Version numbers are recorded in [`VERSION`](./VERSION). Releases are tagged
`vX.Y.Z` in git. See [`AGENTS.md`](./AGENTS.md) for the versioning convention.

## [Unreleased]

### Added

- **Cloud Functions scaffold** — new `functions/` (Node 20, firebase-functions v6): `auditDocumentCreated` and `auditIntakeCreated` Firestore triggers write a trusted server-side `auditLogs` trail (replacing the in-memory `AUDIT_LOGS` array); `auditDocumentUploaded` records Storage uploads under `documents/{clientUid}/...`; `sendNotificationEmail` is a callable stub for task 8 (Resend). Registered in `firebase.json`.
- **`auditLogs` Firestore rule** — server-written only (Admin SDK bypasses rules), admins may read, client writes denied.
- `storage.rules` registered in `firebase.json`.

### Changed

- **Removed auto-registration and email-heuristic admin** — login now authenticates existing accounts only (`auth.signInWithEmailAndPassword`, no `createUserWithEmailAndPassword` fallback). Roles come exclusively from the Firestore `users/{uid}.role` document; the `admin`/`kaelen`/`cpa` email check is gone. New users without a profile default to `client` and get a client-role profile created.
- **Removed the role switcher** — the client↔admin toggle button and its listener are deleted; the role badge is now read-only, and profile display reads from the Firestore profile instead of hardcoded demo users.
- **Hardened Firestore security rules** — replaced the permissive `allow read, write: if request.auth != null` catch-all with role- and path-scoped rules. Clients can now only read their own `documents`; only admins write `documents`; only admins read/update `intakes` (SSN/DOB live there); only admins read/update/delete `leads` (public marketing forms may still create); admins are identified by `users/{uid}.role == 'admin'`.
- **Added Storage security rules** — new `storage.rules` enforcing that clients can only read `documents/{clientUid}/...` in their own folder and only admins can write, registered in `firebase.json`.

### Fixed

- Any authenticated user could read/write every Firestore document (SSN/DOB, intake, leads, documents). Now path-scoped.
- Firestore Storage bucket had no versioned rules in the repo. Now tracked and deployable.

## [1.0.0] - 2026-08-12

First versioned release. This release codifies the portal that is currently
live at `taxagentai062026.web.app` and captures its history from the initial
prototype through the Antigravity development workflow.

### Added

- **Client Portal prototype** — initial secure client portal prototype and specifications (`b7a1cec`).
- **Push automation** — secure `push_to_github.sh` automation script (`7717544`).
- **Investor pitch deck & flyer** — interactive Reveal.js pitch deck and printable client flyer, with interactive comparison-slide links and walkthrough docs (`653ae49`, `eaece44`, `bca3c76`).
- **Firebase Hosting structure** — relocated web assets to `public/`, configured Firebase Hosting, and initialized the Firebase SDK (`3fd7939`).
- **Client Intake wizard** — multi-step client intake form, persisted to Cloud Firestore (`e3d1497`, `11b308e`).
- **Dual-role system** — Admin vs Client roles with a public marketing landing page (`d35ba9b`).
- **Real Firebase stack** — Firebase Auth, Storage file upload, and a live Firestore client document vault, with auto-provisioning, client dropdown fallback, and one-click test login buttons (`400db5b`, `5306de2`, `0a657e2`).
- **Leads Pipeline module** — admin module with instant lead-to-client conversion (`7f7be83`).
- **Coffee lead magnet page** — Magnitax Emerald branded "Coffee with Desir" landing page (`ae36596`).
- **Training & docs** — admin GitHub workflow training, developer onboarding, admin onboarding, and CI Build workflow validating portal static files (`2946a42`, `7c9a5d5`, `448a397`).
- **AGENTS.md contribution workflow** — repo-root contribution workflow read by coding agents (`64dbb4d`).
- **Scaffold marker** — `scaffold.md` documenting the starting scaffold branch (`ed15236`).
- **Portal scaffold explanation** — pop-out modal in developer training explaining what a portal scaffold is (`75afefb`).
- **Version tracking** — this changelog, a `VERSION` file, and git tags.

### Changed

- Aligned pitch deck and flyer color schemes with the Magnitax Emerald portal branding (`0e57915`, `1c8eca1`).
- Updated Firebase hosting target and rewrites for `coffee.html` and `landing.html` (`02e7770`, `fe08e77`).
- Added a comprehensive README and updated `product_brief.md` to v2.0.0 (`e802fb1`).
- Restructured developer onboarding around the **Antigravity workflow** — reopen the existing project each session, never re-clone (`580451f`, `23790a9`).

### Removed

- Stopped tracking Firebase hosting cache file and `.DS_Store` (`58c49e2`, `88b0d50`).

### Fixed

- Firebase hosting rewrites for `coffee.html` and `landing.html` (`fe08e77`).
- CI smoke test now follows redirects (serve returns 301 for `index.html`) (`448a397`).
- Walkthrough image link uses a relative path for GitHub (`252000c`).

[Unreleased]: https://github.com/whoisdesirtech/Designing-Magnitax-Client-Portal/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/whoisdesirtech/Designing-Magnitax-Client-Portal/releases/tag/v1.0.0
