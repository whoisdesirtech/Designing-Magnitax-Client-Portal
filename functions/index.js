/* ==========================================================================
   Magnitax Secure Client Portal — Cloud Functions
   Scaffold: audit writes (replaces in-memory AUDIT_LOGS), upload finalize,
   and email (Resend wiring lands in task 8).
   ========================================================================== */

const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { onObjectFinalized } = require('firebase-functions/v2/storage');
const { onCall } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');

initializeApp();
const db = getFirestore();

/** Append a server-side audit log entry (trustworthy, not client-spoofable). */
async function writeAudit(entry) {
  await db.collection('auditLogs').add({
    ...entry,
    createdAt: Timestamp.now()
  });
}

/**
 * Audit log for document publish events.
 * Fires when the client admin UI adds a `documents/{docId}` record after a
 * Storage upload completes (app.js:2069). Server-side write keeps the trail
 * authoritative instead of relying on the in-memory AUDIT_LOGS array.
 */
exports.auditDocumentCreated = onDocumentCreated('documents/{docId}', async (event) => {
  const snap = event.data;
  if (!snap) return;
  const data = snap.data() || {};
  await writeAudit({
    action: 'DOCUMENT_PUBLISHED',
    details: `Document "${data.fileName || 'untitled'}" published for client ${data.clientUid || 'unknown'}.`,
    targetType: 'document',
    targetId: event.params.docId,
    actorUid: data.uploadedBy || 'server',
    clientUid: data.clientUid || null,
    storagePath: data.storagePath || null
  });
});

/**
 * Audit log for intake submissions.
 * Fires when a client creates an `intakes/{intakeId}` record (app.js:1434).
 * Note: SSN/DOB are NOT copied into the audit log.
 */
exports.auditIntakeCreated = onDocumentCreated('intakes/{intakeId}', async (event) => {
  const snap = event.data;
  if (!snap) return;
  const data = snap.data() || {};
  const personal = data.personalInfo || {};
  await writeAudit({
    action: 'INTAKE_SUBMITTED',
    details: `Intake ${event.params.intakeId} submitted by ${personal.email || 'unknown'}.`,
    targetType: 'intake',
    targetId: event.params.intakeId,
    clientUid: data.clientUid || null,
    status: data.status || 'pending_review'
  });
});

/**
 * Storage finalize: ensures a completed upload under documents/{clientUid}/...
 * is recorded even if the Firestore metadata write failed.
 */
exports.auditDocumentUploaded = onObjectFinalized(async (event) => {
  const { bucket, name } = event.data;
  if (!name || !name.startsWith('documents/')) return;

  // documents/{clientUid}/...
  const parts = name.split('/');
  const clientUid = parts[1] || null;

  await writeAudit({
    action: 'STORAGE_UPLOAD_FINALIZED',
    details: `File uploaded to gs://${bucket}/${name}.`,
    targetType: 'storageObject',
    targetId: name,
    clientUid,
    storagePath: name
  });
});

/**
 * Email notification stub.
 * Placeholder for task 8 (Resend integration). Returns not-configured so the
 * client can detect it cleanly instead of failing hard.
 */
exports.sendNotificationEmail = onCall(() => {
  return {
    ok: false,
    error: 'email-not-configured',
    message: 'Email sending is not configured yet (task 8 / Resend).'
  };
});
