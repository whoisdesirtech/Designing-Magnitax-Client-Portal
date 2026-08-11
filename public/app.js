/* ==========================================================================
   Magnitax Client Portal Prototype Logic
   ========================================================================== */

// 1. SIMULATED DATABASE & METADATA SEEDS
const CLIENT_USER = {
  id: "usr_jane_doe_993",
  email: "jane.doe@example.com",
  firstName: "Jane",
  lastName: "Doe",
  companyName: "JD Designs LLC",
  role: "client",
  wpLinked: true,
  twoFactorActive: true
};

const ADMIN_USER = {
  id: "usr_marcus_kaelen_cpa",
  email: "admin@magnitax.com",
  firstName: "Marcus",
  lastName: "Kaelen",
  companyName: "Magnitax Consulting LLC",
  role: "admin",
  title: "Senior Tax Strategist & CPA",
  wpLinked: true,
  twoFactorActive: true
};

let activeUserRole = "client"; // 'client' or 'admin'

let DOCUMENTS_DB = [
  {
    id: "doc_w2_2025_001",
    fileName: "2025_W2_JD_Designs_LLC.pdf",
    type: "w2",
    taxYear: 2025,
    fileSize: "142 KB",
    dateUploaded: "May 10, 2026",
    details: {
      employer: "JD Designs LLC",
      ein: "12-3456789",
      wages: "$92,450.00",
      fedTax: "$14,820.00",
      ssWages: "$92,450.00",
      ssTax: "$5,731.90",
      medWages: "$92,450.00",
      medTax: "$1,340.53",
      stateTax: "$4,120.00",
      state: "CA"
    }
  },
  {
    id: "doc_1099_2025_002",
    fileName: "2025_1099_NEC_Stripe_Inc.pdf",
    type: "1099",
    taxYear: 2025,
    fileSize: "98 KB",
    dateUploaded: "May 15, 2026",
    details: {
      payer: "Stripe, Inc.",
      ein: "98-7654321",
      nonEmployeeComp: "$14,500.00",
      fedTaxWithheld: "$0.00",
      stateTaxWithheld: "$0.00",
      state: "CA"
    }
  },
  {
    id: "doc_1099_2025_003",
    fileName: "2025_1099_DIV_Fidelity_Brokerage.pdf",
    type: "1099",
    taxYear: 2025,
    fileSize: "115 KB",
    dateUploaded: "May 22, 2026",
    details: {
      payer: "Fidelity Investments",
      ein: "45-0987654",
      ordinaryDividends: "$2,850.00",
      qualifiedDividends: "$2,100.00",
      capitalGains: "$450.00",
      fedTaxWithheld: "$0.00",
      state: "MA"
    }
  },
  {
    id: "doc_sum_2025_004",
    fileName: "2025_Form_1040_Summary.pdf",
    type: "summary",
    taxYear: 2025,
    fileSize: "284 KB",
    dateUploaded: "Jun 02, 2026",
    details: {
      title: "U.S. Individual Income Tax Return Summary",
      filingStatus: "Single",
      totalIncome: "$109,800.00",
      adjustedGrossIncome: "$107,300.00",
      taxableIncome: "$94,350.00",
      totalTaxLiability: "$16,210.00",
      totalPayments: "$20,551.90",
      refundDue: "$4,341.90",
      amountOwed: "$0.00"
    }
  },
  {
    id: "doc_w2_2024_005",
    fileName: "2024_W2_JD_Designs_LLC.pdf",
    type: "w2",
    taxYear: 2024,
    fileSize: "138 KB",
    dateUploaded: "May 12, 2025",
    details: {
      employer: "JD Designs LLC",
      ein: "12-3456789",
      wages: "$85,200.00",
      fedTax: "$13,100.00",
      ssWages: "$85,200.00",
      ssTax: "$5,282.40",
      medWages: "$85,200.00",
      medTax: "$1,235.40",
      stateTax: "$3,840.00",
      state: "CA"
    }
  },
  {
    id: "doc_sum_2024_006",
    fileName: "2024_Form_1040_Summary.pdf",
    type: "summary",
    taxYear: 2024,
    fileSize: "276 KB",
    dateUploaded: "Jun 05, 2025",
    details: {
      title: "U.S. Individual Income Tax Return Summary",
      filingStatus: "Single",
      totalIncome: "$85,200.00",
      adjustedGrossIncome: "$83,700.00",
      taxableIncome: "$70,850.00",
      totalTaxLiability: "$11,280.00",
      totalPayments: "$18,382.40",
      refundDue: "$7,102.40",
      amountOwed: "$0.00"
    }
  }
];

let AUDIT_LOGS = [
  { id: "log_1", action: "LOGIN_SUCCESS", details: "Secure credential authentication approved.", time: "10 minutes ago" },
  { id: "log_2", action: "2FA_VERIFIED", details: "Two-Factor authentication approved via TOTP.", time: "10 minutes ago" },
  { id: "log_3", action: "DOCUMENT_PREVIEWED", details: "Viewed 2025_Form_1040_Summary.pdf", time: "6 minutes ago" },
  { id: "log_4", action: "DOCUMENT_DOWNLOADED", details: "Downloaded 2025_W2_JD_Designs_LLC.pdf", time: "Yesterday" }
];

let NOTIFICATIONS = [
  { id: "notif_1", text: "New tax document uploaded: 2025_Form_1040_Summary.pdf", time: "June 2, 2026", unread: true },
  { id: "notif_2", text: "New tax document uploaded: 2025_1099_DIV_Fidelity_Brokerage.pdf", time: "May 22, 2026", unread: true },
  { id: "notif_3", text: "Two-Factor Authentication was successfully reconfigured.", time: "May 10, 2026", unread: false }
];

// 2. DOM INTERFACE ELEMENTS
const body = document.body;
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const loginErrorText = document.getElementById('login-error-text');
const twoFactorForm = document.getElementById('2fa-form');
const twoFactorError = document.getElementById('2fa-error');
const digitInputs = document.querySelectorAll('.digit-input');
const backLoginBtn = document.getElementById('back-login-btn');
const sidebarMenu = document.getElementById('sidebar-menu');
const mobileSidebarToggle = document.getElementById('mobile-sidebar-toggle');
const headerPageTitle = document.getElementById('header-page-title');
const notifBellTrigger = document.getElementById('notif-bell-trigger');
const notificationBadgeCount = document.getElementById('notification-badge-count');
const notificationDropdownMenu = document.getElementById('notification-dropdown-menu');
const notificationsListContainer = document.getElementById('notifications-list-container');
const clearNotificationsAction = document.getElementById('clear-notifications-action');
const viewNotifSettingsLink = document.getElementById('view-notif-settings-link');
const portalPagesViewport = document.getElementById('portal-pages-viewport');
const dashboardAuditLogs = document.getElementById('dashboard-audit-logs');
const dashClearAuditBtn = document.getElementById('dash-clear-audit-btn');
const docSearchInput = document.getElementById('doc-search');
const docYearFilter = document.getElementById('doc-year-filter');
const filterTabs = document.querySelectorAll('.filter-tab');
const documentsGalleryViewport = document.getElementById('documents-gallery-viewport');
const docsEmptyState = document.getElementById('docs-empty-state');
const previewModal = document.getElementById('preview-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalDocIcon = document.getElementById('modal-doc-icon');
const modalDocFilename = document.getElementById('modal-doc-filename');
const modalDocMeta = document.getElementById('modal-doc-meta');
const mockPdfViewCanvas = document.getElementById('mock-pdf-view-canvas');
const modalPrintBtn = document.getElementById('modal-print-btn');
const modalDownloadBtn = document.getElementById('modal-download-btn');
const notificationSettingsForm = document.getElementById('settings-notifications-form');
const systemToast = document.getElementById('system-toast');
const systemToastText = document.getElementById('system-toast-text');
const logoutBtn = document.getElementById('logout-btn');
const profileAvatarLetters = document.getElementById('profile-avatar-letters');
const profileUserFullname = document.getElementById('profile-user-fullname');

// Security Buttons
const reconfigure2faBtn = document.getElementById('reconfigure-2fa-btn');
const gdprExportBtn = document.getElementById('gdpr-export-btn');
const gdprDeleteBtn = document.getElementById('gdpr-delete-btn');
const messagePreparerBtn = document.getElementById('message-preparer-btn');

// State Variables
let currentActivePage = 'dashboard';
let activeDocumentForModal = null;

// 3. APPLICATION STATE CONTROLLERS

// Toast Alerts
function showToast(message) {
  systemToastText.textContent = message;
  systemToast.classList.add('show');
  setTimeout(() => {
    systemToast.classList.remove('show');
  }, 4000);
}

// Set global routing view ('login', '2fa', 'app')
function setView(viewName) {
  body.setAttribute('data-view', viewName);
  
  if (viewName === 'app') {
    renderAuditLogs();
    renderNotifications();
    renderDocumentsList();
    // Reset page navigation
    navigatePage('dashboard');
  }
}

// Navigate sub-pages inside main portal
function navigatePage(pageName) {
  currentActivePage = pageName;
  portalPagesViewport.setAttribute('data-page', pageName);
  
  // Update Header Title
  let displayTitle = "Client Dashboard";
  if (pageName === 'documents') displayTitle = "Documents Center";
  if (pageName === 'settings') displayTitle = "Portal Settings";
  headerPageTitle.textContent = displayTitle;
  
  // Highlight active menu item
  document.querySelectorAll('.menu-item').forEach(item => {
    if (item.getAttribute('data-target') === pageName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Close mobile sidebar if open
  sidebarMenu.classList.remove('mobile-open');
}

// 4. AUTHENTICATION & LOGIN STATE MACHINE

// ── Phase A: Real Firebase Authentication ─────────────────────────────────
// Holds the authenticated Firebase user and their Firestore profile
let currentFirebaseUser = null;
let currentUserProfile = null; // { role, firstName, lastName, email }

// Real login: Firebase Auth email/password with automatic registration fallback
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-password').value;
  const submitBtn = loginForm.querySelector('button[type="submit"]');

  loginError.style.display = 'none';
  submitBtn.disabled = true;
  submitBtn.textContent = 'Authenticating…';

  try {
    // Attempt sign in
    await auth.signInWithEmailAndPassword(email, pass);
    loginError.style.display = 'none';
  } catch (err) {
    console.warn('Sign-in failed with code:', err.code, err.message);

    // If account not found or invalid credential, try auto-registering so login always succeeds
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
      try {
        submitBtn.textContent = 'Creating Session…';
        await auth.createUserWithEmailAndPassword(email, pass);
        loginError.style.display = 'none';
        showToast('✓ Account registered & session created!');
        return;
      } catch (createErr) {
        console.error('Registration fallback error:', createErr);
        if (createErr.code === 'auth/email-already-in-use') {
          loginErrorText.textContent = 'Password mismatch for this account. Please verify your password or use Password123!.';
        } else {
          loginErrorText.textContent = `Authentication error: ${createErr.message || createErr.code}`;
        }
        loginError.style.display = 'flex';
      }
    } else {
      loginErrorText.textContent = `Authentication error (${err.code}): ${err.message}`;
      loginError.style.display = 'flex';
    }
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Authenticate Session';
  }
});

// Quick fill test buttons
document.getElementById('btn-fill-admin')?.addEventListener('click', () => {
  document.getElementById('login-email').value = 'admin@magnitax.com';
  document.getElementById('login-password').value = 'Password123!';
  showToast('Filled Admin credentials (admin@magnitax.com)');
  loginForm.dispatchEvent(new Event('submit'));
});

document.getElementById('btn-fill-client')?.addEventListener('click', () => {
  document.getElementById('login-email').value = 'jane@example.com';
  document.getElementById('login-password').value = 'Password123!';
  showToast('Filled Client credentials (jane@example.com)');
  loginForm.dispatchEvent(new Event('submit'));
});

// Firebase Auth state listener — the single source of truth for sessions
auth.onAuthStateChanged(async (user) => {
  if (user) {
    currentFirebaseUser = user;

    // Read role + profile from Firestore users/{uid}
    try {
      const userDoc = await db.collection('users').doc(user.uid).get();
      if (userDoc.exists) {
        currentUserProfile = userDoc.data();
        activeUserRole = currentUserProfile.role || 'client';
      } else {
        // No Firestore profile yet — auto-create based on email
        const isAdmin = user.email.toLowerCase().includes('admin') || user.email.toLowerCase().includes('kaelen') || user.email.toLowerCase().includes('cpa');
        const defaultFirstName = isAdmin ? 'Marcus' : (user.displayName ? user.displayName.split(' ')[0] : 'Jane');
        const defaultLastName  = isAdmin ? 'Kaelen' : (user.displayName ? (user.displayName.split(' ')[1] || '') : 'Doe');

        currentUserProfile = {
          role: isAdmin ? 'admin' : 'client',
          firstName: defaultFirstName,
          lastName: defaultLastName,
          email: user.email
        };
        activeUserRole = currentUserProfile.role;

        // Automatically write document to Firestore `users/{uid}`
        await db.collection('users').doc(user.uid).set({
          ...currentUserProfile,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        console.log(`Auto-created Firestore user document for ${user.email} (${user.uid}) as ${activeUserRole}`);
      }
    } catch (err) {
      console.warn('Could not read/create user profile in Firestore:', err);
      const isAdmin = user.email.toLowerCase().includes('admin');
      currentUserProfile = { role: isAdmin ? 'admin' : 'client', firstName: isAdmin ? 'Marcus' : 'Jane', lastName: isAdmin ? 'Kaelen' : 'Doe', email: user.email };
      activeUserRole = currentUserProfile.role;
    }

    // Update profile display
    const firstName = currentUserProfile.firstName || '';
    const lastName  = currentUserProfile.lastName  || '';
    const fullName  = `${firstName} ${lastName}`.trim();
    if (profileUserFullname)  profileUserFullname.textContent  = fullName || user.email;
    if (profileAvatarLetters) profileAvatarLetters.textContent = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';

    applyRoleUI();

    // Log success in Firestore audit log
    const loginEmail = document.getElementById('login-email').value;
    if (loginEmail) {
      AUDIT_LOGS.unshift({
        id: `log_login_${Date.now()}`,
        action: 'LOGIN_SUCCESS',
        details: `Authenticated as ${activeUserRole === 'admin' ? 'CPA Admin' : 'Client'}. Session established.`,
        time: 'Just now'
      });
    }

    // Show 2FA gate (UI only — real 2FA would require Firebase Phone Auth / Blaze plan)
    // For now, show the 2FA screen as an intermediate confirmation step
    if (document.body.getAttribute('data-view') === 'login') {
      setView('2fa');
      setTimeout(() => { digitInputs[0] && digitInputs[0].focus(); }, 200);
      showToast('Credentials verified. Complete the security check to continue.');
    } else if (document.body.getAttribute('data-view') !== 'app') {
      // Returning from a reload / already passed 2FA
      enterApp();
    }
  } else {
    // User signed out
    currentFirebaseUser = null;
    currentUserProfile = null;
    activeUserRole = 'client';
    setView('login');
  }
});

// Called when the user passes the 2FA screen and enters the app
function enterApp() {
  setView('app');
  loadClientDocuments();
  if (activeUserRole === 'admin') {
    loadAdminClientDropdown();
  }
  showToast(`Welcome back, ${currentUserProfile ? currentUserProfile.firstName : 'User'}. Session secured.`);
}

// Automatic tab movement for 2FA digit slots
digitInputs.forEach((input, index) => {
  input.addEventListener('input', (e) => {
    const value = e.target.value;
    if (value.length === 1 && index < digitInputs.length - 1) {
      digitInputs[index + 1].focus();
    }
    collectFull2faCode();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      digitInputs[index - 1].focus();
    }
  });
});

function collectFull2faCode() {
  let code = '';
  digitInputs.forEach(input => { code += input.value; });
  document.getElementById('full-2fa-code').value = code;
}

// 2FA gate — any 6 digits accepted (UI placeholder; real SMS 2FA needs Blaze plan)
twoFactorForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const code = document.getElementById('full-2fa-code').value;
  if (code.length === 6) {
    twoFactorError.style.display = 'none';
    AUDIT_LOGS.unshift({
      id: `log_2fa_${Date.now()}`,
      action: '2FA_VERIFIED',
      details: `Two-Factor passcode confirmed. ${activeUserRole === 'admin' ? 'CPA Admin' : 'Client'} session unlocked.`,
      time: 'Just now'
    });
    enterApp();
  } else {
    twoFactorError.style.display = 'flex';
    digitInputs.forEach(input => (input.value = ''));
    digitInputs[0] && digitInputs[0].focus();
  }
});

backLoginBtn.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut();
  setView('login');
});

// 5. AUDIT LOGS DISPLAY
function renderAuditLogs() {
  dashboardAuditLogs.innerHTML = '';
  if (AUDIT_LOGS.length === 0) {
    dashboardAuditLogs.innerHTML = `<p style="color: var(--text-muted); font-size: 13px;">No activity logs found.</p>`;
    return;
  }

  AUDIT_LOGS.forEach(log => {
    let iconSvg = '';
    
    // Choose icon depending on audit category
    if (log.action.includes('LOGIN') || log.action.includes('2FA')) {
      iconSvg = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      `;
    } else if (log.action.includes('DOWNLOAD')) {
      iconSvg = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
      `;
    } else {
      iconSvg = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      `;
    }

    const logItem = document.createElement('div');
    logItem.className = 'activity-item';
    logItem.innerHTML = `
      <div class="activity-dot">${iconSvg}</div>
      <div class="activity-details">
        <span class="activity-text"><strong>${log.action.replace('_', ' ')}</strong>: ${log.details}</span>
        <span class="activity-time">${log.time}</span>
      </div>
    `;
    dashboardAuditLogs.appendChild(logItem);
  });
}

dashClearAuditBtn.addEventListener('click', (e) => {
  e.preventDefault();
  AUDIT_LOGS = [];
  renderAuditLogs();
  showToast("Audit trails successfully flushed.");
});

// 6. NOTIFICATION SYSTEM
function renderNotifications() {
  notificationsListContainer.innerHTML = '';
  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;
  
  // Badge display
  if (unreadCount > 0) {
    notificationBadgeCount.style.display = 'flex';
    notificationBadgeCount.textContent = unreadCount;
  } else {
    notificationBadgeCount.style.display = 'none';
  }
  
  if (NOTIFICATIONS.length === 0) {
    notificationsListContainer.innerHTML = `
      <li style="padding: 20px 16px; text-align: center; color: var(--text-muted); font-size: 13px;">
        All clear! No notification alerts.
      </li>
    `;
    return;
  }
  
  NOTIFICATIONS.forEach(notif => {
    const li = document.createElement('li');
    li.className = `notif-item ${notif.unread ? 'unread' : ''}`;
    li.innerHTML = `
      <span class="notif-item-text">${notif.text}</span>
      <span class="notif-item-time">${notif.time}</span>
    `;
    
    // Clicking a notification marks it read
    li.addEventListener('click', () => {
      notif.unread = false;
      renderNotifications();
      showToast("Notification marked as read.");
    });
    
    notificationsListContainer.appendChild(li);
  });
}

notifBellTrigger.addEventListener('click', (e) => {
  e.stopPropagation();
  notificationDropdownMenu.classList.toggle('show');
});

// Close bell dropdown on clicking elsewhere
document.addEventListener('click', () => {
  notificationDropdownMenu.classList.remove('show');
});

notificationDropdownMenu.addEventListener('click', (e) => {
  e.stopPropagation();
});

clearNotificationsAction.addEventListener('click', () => {
  NOTIFICATIONS = [];
  renderNotifications();
  showToast("Notifications cleared.");
});

viewNotifSettingsLink.addEventListener('click', (e) => {
  e.preventDefault();
  notificationDropdownMenu.classList.remove('show');
  navigatePage('settings');
});

// 7. DOCUMENTS CATALOG LOGIC — Phase C: Live Firestore query
let activeTypeFilter = 'all';

// Load documents from Firestore for the authenticated user (client sees own, admin sees all for a client)
async function loadClientDocuments() {
  if (!currentFirebaseUser) return;
  documentsGalleryViewport.innerHTML = '<p style="color:var(--text-muted);font-size:13px;padding:20px;">Loading your documents…</p>';

  try {
    let query = db.collection('documents');

    if (activeUserRole === 'client') {
      // Client only sees their own documents
      query = query.where('clientUid', '==', currentFirebaseUser.uid);
    }
    // Admin sees all documents (no filter) on their own page

    const snapshot = await query.orderBy('uploadedAt', 'desc').get();

    // Replace in-memory DOCUMENTS_DB with live Firestore data
    DOCUMENTS_DB = [];
    snapshot.forEach(docSnap => {
      const d = docSnap.data();
      DOCUMENTS_DB.push({
        id: docSnap.id,
        fileName: d.fileName || 'Untitled Document',
        type: d.type || 'other',
        taxYear: d.taxYear || new Date().getFullYear(),
        fileSize: d.fileSize || 'Unknown',
        dateUploaded: d.uploadedAt ? d.uploadedAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown',
        storagePath: d.storagePath || null,
        downloadURL: d.downloadURL || null,
        details: d.details || {}
      });
    });

    renderDocumentsList();
  } catch (err) {
    console.error('Failed to load documents from Firestore:', err);
    documentsGalleryViewport.innerHTML = '<p style="color:#f87171;font-size:13px;padding:20px;">Could not load documents. Please refresh and try again.</p>';
  }
}

function renderDocumentsList() {
  documentsGalleryViewport.innerHTML = '';

  const searchVal = docSearchInput.value.toLowerCase();
  const yearVal   = docYearFilter.value;

  const filtered = DOCUMENTS_DB.filter(doc => {
    const matchesSearch = doc.fileName.toLowerCase().includes(searchVal);
    const matchesYear   = (yearVal === 'all') || (doc.taxYear.toString() === yearVal);
    const matchesType   = (activeTypeFilter === 'all') || (doc.type === activeTypeFilter);
    return matchesSearch && matchesYear && matchesType;
  });

  // Dashboard stat
  const userFilesCount = DOCUMENTS_DB.length;
  const statEl = document.getElementById('dash-stat-taxfiles');
  if (statEl) statEl.textContent = `${userFilesCount} File${userFilesCount !== 1 ? 's' : ''}`;

  if (filtered.length === 0) {
    documentsGalleryViewport.appendChild(docsEmptyState);
    docsEmptyState.style.display = 'flex';
    return;
  }

  docsEmptyState.style.display = 'none';

  filtered.forEach(doc => {
    const docCard = document.createElement('div');
    docCard.className = `doc-card ${doc.type}`;

    let typeIcon = '';
    let categoryText = '';

    if (doc.type === 'w2') {
      categoryText = 'W-2 Form';
      typeIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" ry="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/></svg>`;
    } else if (doc.type === '1099') {
      categoryText = '1099 Form';
      typeIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
    } else if (doc.type === 'summary') {
      categoryText = 'Form Summary';
      typeIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`;
    } else {
      categoryText = 'Document';
      typeIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
    }

    docCard.innerHTML = `
      <div class="doc-card-header">
        <div class="doc-badge-icon">${typeIcon}</div>
        <span class="doc-year-badge">${doc.taxYear}</span>
      </div>
      <h4 class="doc-title" title="${doc.fileName}">${doc.fileName}</h4>
      <div class="doc-meta">
        <div class="doc-meta-item"><span>${categoryText}</span></div>
        <div class="doc-meta-item"><span>•</span><span>${doc.fileSize}</span></div>
      </div>
      <div class="doc-card-actions">
        <button class="btn-doc-action preview" data-id="${doc.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          <span>${doc.storagePath ? 'Open File' : 'Preview'}</span>
        </button>
        <button class="btn-doc-action download" data-id="${doc.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <span>Download</span>
        </button>
      </div>
    `;

    docCard.querySelector('.preview').addEventListener('click', () => openPreviewModal(doc.id));
    docCard.querySelector('.download').addEventListener('click', () => triggerDocDownload(doc.id));

    documentsGalleryViewport.appendChild(docCard);
  });
}

// React search input hook
docSearchInput.addEventListener('input', renderDocumentsList);
docYearFilter.addEventListener('change', renderDocumentsList);

// Filter tabs styling & select
filterTabs.forEach(tab => {
  tab.addEventListener('click', (e) => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeTypeFilter = tab.getAttribute('data-type');
    renderDocumentsList();
  });
});

// 8. DOCUMENT PREVIEW & PDF GENERATOR (IRS MOCK SHEETS)
function openPreviewModal(docId) {
  const doc = DOCUMENTS_DB.find(d => d.id === docId);
  if (!doc) return;
  
  activeDocumentForModal = doc;
  
  // Set headers
  modalDocFilename.textContent = doc.fileName;
  modalDocMeta.textContent = `${doc.type.toUpperCase()} | ${doc.fileSize} | Uploaded ${doc.dateUploaded}`;
  
  // Insert correct modal icon
  let typeIcon = '';
  if (doc.type === 'w2') {
    typeIcon = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2" ry="2"/>
        <line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/>
      </svg>
    `;
    modalDocIcon.style.color = '#10b981';
  } else if (doc.type === '1099') {
    typeIcon = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
      </svg>
    `;
    modalDocIcon.style.color = '#3b82f6';
  } else {
    typeIcon = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
      </svg>
    `;
    modalDocIcon.style.color = '#f59e0b';
  }
  modalDocIcon.innerHTML = typeIcon;
  
  // Dynamic generation of IRS layout depending on form type
  let mockHtml = '';
  
  if (doc.type === 'w2') {
    mockHtml = `
      <div class="mock-pdf-title-block">
        <div>
          <span class="pdf-doc-code">Form W-2</span>
          <p style="font-size: 8px; font-weight: bold; margin-top: 2px;">Wage and Tax Statement</p>
        </div>
        <div style="text-align: right;">
          <span class="pdf-doc-year">${doc.taxYear}</span>
          <p style="font-size: 8px; font-weight: bold;">Department of the Treasury—IRS</p>
        </div>
      </div>
      
      <div class="pdf-w2-grid">
        <div class="pdf-w2-box span-2">
          <div class="w2-box-label">a Employee's social security number</div>
          <div class="w2-box-value">XXX-XX-9874</div>
        </div>
        <div class="pdf-w2-box">
          <div class="w2-box-label">1 Wages, tips, other comp.</div>
          <div class="w2-box-value">${doc.details.wages}</div>
        </div>
        <div class="pdf-w2-box">
          <div class="w2-box-label">2 Federal income tax withheld</div>
          <div class="w2-box-value">${doc.details.fedTax}</div>
        </div>
        
        <div class="pdf-w2-box span-2">
          <div class="w2-box-label">b Employer identification number (EIN)</div>
          <div class="w2-box-value">${doc.details.ein}</div>
        </div>
        <div class="pdf-w2-box">
          <div class="w2-box-label">3 Social security wages</div>
          <div class="w2-box-value">${doc.details.ssWages}</div>
        </div>
        <div class="pdf-w2-box">
          <div class="w2-box-label">4 Social security tax withheld</div>
          <div class="w2-box-value">${doc.details.ssTax}</div>
        </div>

        <div class="pdf-w2-box span-2" style="min-height: 70px;">
          <div class="w2-box-label">c Employer's name, address, and ZIP code</div>
          <div class="w2-box-value" style="font-size: 9px; margin-top: 4px;">
            <strong>${doc.details.employer}</strong><br>
            100 Tax Professional Blvd Suite 400<br>
            San Francisco, CA 94107
          </div>
        </div>
        <div class="pdf-w2-box">
          <div class="w2-box-label">5 Medicare wages and tips</div>
          <div class="w2-box-value">${doc.details.medWages}</div>
        </div>
        <div class="pdf-w2-box">
          <div class="w2-box-label">6 Medicare tax withheld</div>
          <div class="w2-box-value">${doc.details.medTax}</div>
        </div>

        <div class="pdf-w2-box span-2" style="min-height: 70px;">
          <div class="w2-box-label">e Employee's first name, last name, and address</div>
          <div class="w2-box-value" style="font-size: 9px; margin-top: 4px;">
            <strong>${CLIENT_USER.firstName} ${CLIENT_USER.lastName}</strong><br>
            742 Evergreen Terrace<br>
            Los Angeles, CA 90001
          </div>
        </div>
        <div class="pdf-w2-box shaded">
          <div class="w2-box-label">7 Social security tips</div>
          <div class="w2-box-value">$0.00</div>
        </div>
        <div class="pdf-w2-box shaded">
          <div class="w2-box-label">8 Allocated tips</div>
          <div class="w2-box-value">$0.00</div>
        </div>

        <div class="pdf-w2-box">
          <div class="w2-box-label">15 State / Employer's state ID</div>
          <div class="w2-box-value">${doc.details.state} / 998-A109</div>
        </div>
        <div class="pdf-w2-box">
          <div class="w2-box-label">16 State wages, tips, etc.</div>
          <div class="w2-box-value">${doc.details.wages}</div>
        </div>
        <div class="pdf-w2-box">
          <div class="w2-box-label">17 State income tax</div>
          <div class="w2-box-value">${doc.details.stateTax}</div>
        </div>
        <div class="pdf-w2-box shaded">
          <div class="w2-box-label">18 Local wages / Local tax</div>
          <div class="w2-box-value">$0.00 / $0.00</div>
        </div>
      </div>
      
      <div class="mock-pdf-watermark">FOR PREVIEW ONLY — SECURED BY MAGNITAX</div>
    `;
  } else if (doc.type === '1099') {
    const isNec = doc.fileName.includes('NEC');
    mockHtml = `
      <div class="mock-pdf-title-block">
        <div>
          <span class="pdf-doc-code">${isNec ? 'Form 1099-NEC' : 'Form 1099-DIV'}</span>
          <p style="font-size: 8px; font-weight: bold; margin-top: 2px;">
            ${isNec ? 'Nonemployee Compensation' : 'Dividends and Distributions'}
          </p>
        </div>
        <div style="text-align: right;">
          <span class="pdf-doc-year">${doc.taxYear}</span>
          <p style="font-size: 8px; font-weight: bold;">Department of the Treasury—IRS</p>
        </div>
      </div>
      
      <div class="pdf-w2-grid">
        <div class="pdf-w2-box span-2" style="min-height: 80px;">
          <div class="w2-box-label">PAYER'S name, street address, city, state, ZIP code</div>
          <div class="w2-box-value" style="font-size: 9px; margin-top: 4px;">
            <strong>${doc.details.payer || doc.details.payer}</strong><br>
            Corporate HQ Boulevard<br>
            San Francisco, CA 94103
          </div>
        </div>
        <div class="pdf-w2-box">
          <div class="w2-box-label">PAYER'S TIN</div>
          <div class="w2-box-value">${doc.details.ein}</div>
        </div>
        <div class="pdf-w2-box">
          <div class="w2-box-label">RECIPIENT'S TIN</div>
          <div class="w2-box-value">XXX-XX-9874</div>
        </div>
        
        <div class="pdf-w2-box span-2" style="min-height: 80px;">
          <div class="w2-box-label">RECIPIENT'S name, address, and ZIP code</div>
          <div class="w2-box-value" style="font-size: 9px; margin-top: 4px;">
            <strong>${CLIENT_USER.firstName} ${CLIENT_USER.lastName}</strong><br>
            742 Evergreen Terrace<br>
            Los Angeles, CA 90001
          </div>
        </div>
        
        ${isNec ? `
          <div class="pdf-w2-box">
            <div class="w2-box-label">1 Nonemployee comp.</div>
            <div class="w2-box-value">${doc.details.nonEmployeeComp}</div>
          </div>
          <div class="pdf-w2-box">
            <div class="w2-box-label">4 Federal tax withheld</div>
            <div class="w2-box-value">${doc.details.fedTaxWithheld}</div>
          </div>
        ` : `
          <div class="pdf-w2-box">
            <div class="w2-box-label">1a Total ordinary dividends</div>
            <div class="w2-box-value">${doc.details.ordinaryDividends}</div>
          </div>
          <div class="pdf-w2-box">
            <div class="w2-box-label">1b Qualified dividends</div>
            <div class="w2-box-value">${doc.details.qualifiedDividends}</div>
          </div>
        `}

        <div class="pdf-w2-box">
          <div class="w2-box-label">State / Payer's state no.</div>
          <div class="w2-box-value">${doc.details.state} / 776-881</div>
        </div>
        <div class="pdf-w2-box">
          <div class="w2-box-label">State tax withheld</div>
          <div class="w2-box-value">${doc.details.stateTaxWithheld || '$0.00'}</div>
        </div>
        <div class="pdf-w2-box shaded span-2">
          <div class="w2-box-label">Additional notes / capital gains</div>
          <div class="w2-box-value">${doc.details.capitalGains || 'None'}</div>
        </div>
      </div>
      
      <div class="mock-pdf-watermark">FOR PREVIEW ONLY — SECURED BY MAGNITAX</div>
    `;
  } else {
    // Summary Layout
    mockHtml = `
      <div class="mock-pdf-title-block" style="border-bottom: 2px solid var(--accent); padding-bottom: 15px;">
        <div>
          <span class="pdf-doc-code" style="color: var(--accent);">${doc.details.title}</span>
          <p style="font-size: 9px; color: #4b5563; font-weight: bold; margin-top: 4px;">Magnitax Consolidated Filing Copy</p>
        </div>
        <div style="text-align: right;">
          <span class="pdf-doc-year" style="font-size: 24px;">${doc.taxYear}</span>
        </div>
      </div>
      
      <div style="margin-bottom: 25px;">
        <h4 style="font-size: 13px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-bottom: 10px; font-weight: bold;">FILER & PREPARER INFORMATION</h4>
        <table style="width: 100%; font-size: 11px;">
          <tr>
            <td style="width: 50%; padding-bottom: 6px;"><strong>Taxpayer:</strong> ${CLIENT_USER.firstName} ${CLIENT_USER.lastName}</td>
            <td style="width: 50%; padding-bottom: 6px;"><strong>Filing Entity:</strong> Magnitax Consulting LLC</td>
          </tr>
          <tr>
            <td style="padding-bottom: 6px;"><strong>Filing Status:</strong> ${doc.details.filingStatus}</td>
            <td style="padding-bottom: 6px;"><strong>PTIN:</strong> P00-1234567</td>
          </tr>
        </table>
      </div>

      <div>
        <h4 style="font-size: 13px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-bottom: 10px; font-weight: bold;">TAX COMPUTATION RECONCILIATION</h4>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 8px 0;">Gross Consolidated Revenue</td>
            <td style="text-align: right; font-weight: 600;">${doc.details.totalIncome}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 8px 0;">Adjusted Gross Income (AGI)</td>
            <td style="text-align: right; font-weight: 600;">${doc.details.adjustedGrossIncome}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 8px 0;">Standard / Itemized Deductions Applied</td>
            <td style="text-align: right; font-weight: 600;">-$12,950.00</td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6; background-color: #f9fafb;">
            <td style="padding: 8px 0; font-weight: bold;">Taxable Income Base</td>
            <td style="text-align: right; font-weight: bold;">${doc.details.taxableIncome}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 8px 0;">Computed Federal Income Tax</td>
            <td style="text-align: right; font-weight: 600;">${doc.details.totalTaxLiability}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 8px 0;">Total Estimated Payments & Withholdings</td>
            <td style="text-align: right; font-weight: 600; color: #10b981;">${doc.details.totalPayments}</td>
          </tr>
          <tr style="font-size: 12px; font-weight: bold; background-color: rgba(16, 185, 129, 0.05); border-top: 1px solid #10b981; border-bottom: 1px solid #10b981;">
            <td style="padding: 10px 4px; color: #10b981;">TOTAL TAX REFUND DUE</td>
            <td style="text-align: right; padding: 10px 4px; color: #10b981;">${doc.details.refundDue}</td>
          </tr>
        </table>
      </div>

      <div class="mock-pdf-watermark" style="margin-top: 40px;">Consolidated Summary — Tax Filing Copy</div>
    `;
  }
  
  mockPdfViewCanvas.innerHTML = mockHtml;
  previewModal.classList.add('show');
  
  // Log viewed action to audit log
  const now = new Date();
  AUDIT_LOGS.unshift({
    id: `log_view_${now.getTime()}`,
    action: "DOCUMENT_PREVIEWED",
    details: `Viewed ${doc.fileName} in secure modal.`,
    time: "Just now"
  });
  renderAuditLogs();
}

function closePreviewModal() {
  previewModal.classList.remove('show');
  activeDocumentForModal = null;
}

modalCloseBtn.addEventListener('click', closePreviewModal);

// Close modal on click outside content window
previewModal.addEventListener('click', (e) => {
  if (e.target === previewModal) {
    closePreviewModal();
  }
});

// 9. SIMULATED DOWNLOAD TRIGGERS (BLOB CREATOR)
async function triggerDocDownload(docId) {
  const doc = DOCUMENTS_DB.find(d => d.id === docId);
  if (!doc) return;

  showToast(`Preparing secure download for ${doc.fileName}…`);

  try {
    let url = null;

    if (doc.downloadURL) {
      // Use cached download URL from Firestore
      url = doc.downloadURL;
    } else if (doc.storagePath) {
      // Fetch a fresh download URL from Firebase Storage
      url = await storage.ref(doc.storagePath).getDownloadURL();
    }

    if (url) {
      // Open in new tab (Firebase Storage URLs are pre-signed, browser will download or preview)
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.download = doc.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      showToast('No file available for download. This is a demo document.');
      return;
    }

    // Log download to audit log
    AUDIT_LOGS.unshift({
      id: `log_down_${Date.now()}`,
      action: 'DOCUMENT_DOWNLOADED',
      details: `Downloaded ${doc.fileName} via Firebase Storage secure link.`,
      time: 'Just now'
    });
    renderAuditLogs();
    showToast(`✓ Download started for ${doc.fileName}`);
  } catch (err) {
    console.error('Download failed:', err);
    showToast('Download failed. The file may have been removed or access was denied.');
  }
}


// Bind modal footer buttons
modalDownloadBtn.addEventListener('click', () => {
  if (activeDocumentForModal) {
    triggerDocDownload(activeDocumentForModal.id);
  }
});

modalPrintBtn.addEventListener('click', () => {
  if (activeDocumentForModal) {
    showToast(`Print spooler started for ${activeDocumentForModal.fileName}`);
  }
});

// 10. SETTINGS & REGULATORY/GDPR SIMULATOR
notificationSettingsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const emailEnabled = document.getElementById('pref-email').checked;
  const inAppEnabled = document.getElementById('pref-inapp').checked;
  const securityEnabled = document.getElementById('pref-security').checked;
  
  // Update local seed
  CLIENT_USER.notificationPreferences = {
    email: emailEnabled,
    inApp: inAppEnabled,
    security: securityEnabled
  };
  
  // Add audit log
  const now = new Date();
  AUDIT_LOGS.unshift({
    id: `log_set_${now.getTime()}`,
    action: "SECURITY_UPDATE",
    details: "Modified client portal notification channels preferences.",
    time: "Just now"
  });
  renderAuditLogs();
  
  showToast("Notification configurations successfully updated.");
});

// GDPR Export utility
gdprExportBtn.addEventListener('click', () => {
  const exportPayload = {
    user: CLIENT_USER,
    auditLogs: AUDIT_LOGS,
    documentIndex: DOCUMENTS_DB.map(d => ({
      id: d.id,
      fileName: d.fileName,
      type: d.type,
      taxYear: d.taxYear,
      fileSize: d.fileSize
    }))
  };
  
  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `magnitax_gdpr_export_${CLIENT_USER.id}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  
  showToast("GDPR privacy export compiled. Download starting.");
});

// GDPR Delete Erasure Request
gdprDeleteBtn.addEventListener('click', () => {
  const confirmResult = confirm(
    "WARNING: Requesting erasure triggers a hard delete request under GDPR Article 17. Your tax documents and portal access profile will be queued for permanent removal. This action cannot be undone.\n\nDo you wish to submit this request?"
  );
  if (confirmResult) {
    showToast("GDPR erasure request received. System administrator notified.");
    // In actual system, this flags account status as pending_deletion
  }
});

// 2FA Reconfiguration Trigger
reconfigure2faBtn.addEventListener('click', () => {
  alert("Simulating 2FA Reconfiguration:\nThis prompts the client to scan a new Google Authenticator QR Code and enter the resulting verification code to re-link their application token.");
  showToast("2FA re-link wizard initialized.");
});

// Message Preparer Dialog
messagePreparerBtn.addEventListener('click', () => {
  const msg = prompt("Compose secure message to Marcus Kaelen, CPA:");
  if (msg) {
    showToast("Encrypted message dispatched to preparer dashboard.");
  }
});

// 11. GENERAL NAVIGATION BINDINGS & LOGOUT
document.querySelectorAll('.menu-section .menu-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const page = item.getAttribute('data-target');
    navigatePage(page);
  });
});

// Responsive sidebar menu trigger
mobileSidebarToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  sidebarMenu.classList.toggle('mobile-open');
});

// Close sidebar on clicking main content frame on mobile
document.querySelector('.main-content').addEventListener('click', () => {
  sidebarMenu.classList.remove('mobile-open');
});


// ==========================================================================
// 12. CLIENT INTAKE MODULE
// ==========================================================================

// ── State ────────────────────────────────────────────────────────────────
let intakeCurrentStep = 1;
let intakeUploadedFiles = [];

// ── Extend navigatePage to support 'intake' ──────────────────────────────
const _origNavigatePage = navigatePage;
navigatePage = function(pageName) {
  _origNavigatePage(pageName);

  let displayTitle = "Client Dashboard";
  if (pageName === 'documents') displayTitle = "Documents Center";
  if (pageName === 'settings') displayTitle = "Portal Settings";
  if (pageName === 'intake') {
    displayTitle = "Client Intake";
    headerPageTitle.textContent = displayTitle;
    // Reset wizard to step 1 each time the page is visited fresh
    goToIntakeStep(1);
    intakeUploadedFiles = [];
    renderUploadedFiles();
  } else {
    headerPageTitle.textContent = displayTitle;
  }
};

// ── SSN auto-formatter: XXX-XX-XXXX ──────────────────────────────────────
const ssnInput = document.getElementById('intake-ssn');
if (ssnInput) {
  ssnInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 9);
    if (val.length > 5) val = val.slice(0,3) + '-' + val.slice(3,5) + '-' + val.slice(5);
    else if (val.length > 3) val = val.slice(0,3) + '-' + val.slice(3);
    e.target.value = val;
  });
}

// ── Stepper renderer ──────────────────────────────────────────────────────
function goToIntakeStep(step) {
  intakeCurrentStep = step;

  // Show/hide step panels
  ['1','2','3','done'].forEach(s => {
    const el = document.getElementById(`intake-step-${s}`);
    if (el) el.classList.toggle('hidden', s !== String(step) && !(step === 'done' && s === 'done'));
  });

  // Update stepper circles
  const stepperItems = document.querySelectorAll('.stepper-item');
  const stepperLines = document.querySelectorAll('.stepper-line');

  stepperItems.forEach((item, idx) => {
    const itemStep = idx + 1;
    item.classList.remove('active', 'completed');
    if (typeof step === 'number') {
      if (itemStep === step) item.classList.add('active');
      if (itemStep < step) item.classList.add('completed');
    }
  });

  stepperLines.forEach((line, idx) => {
    const lineStep = idx + 1;
    line.classList.toggle('filled', typeof step === 'number' && lineStep < step);
  });

  // Swap circle content for completed steps (checkmark)
  stepperItems.forEach((item, idx) => {
    const circle = item.querySelector('.stepper-circle');
    if (item.classList.contains('completed')) {
      circle.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
    } else {
      circle.textContent = idx + 1;
    }
  });
}

// ── Step 1 → Step 2 ───────────────────────────────────────────────────────
const intakeFormStep1 = document.getElementById('intake-form-step1');
if (intakeFormStep1) {
  intakeFormStep1.addEventListener('submit', (e) => {
    e.preventDefault();
    goToIntakeStep(2);
    showToast('Personal info saved. Now complete your tax profile.');
  });
}

// ── Step 2 → Step 3 ───────────────────────────────────────────────────────
const intakeFormStep2 = document.getElementById('intake-form-step2');
if (intakeFormStep2) {
  intakeFormStep2.addEventListener('submit', (e) => {
    e.preventDefault();
    goToIntakeStep(3);
    showToast('Tax profile saved. Upload your source documents.');
  });
}

const intakeStep2Back = document.getElementById('intake-step2-back');
if (intakeStep2Back) {
  intakeStep2Back.addEventListener('click', () => goToIntakeStep(1));
}

const intakeStep3Back = document.getElementById('intake-step3-back');
if (intakeStep3Back) {
  intakeStep3Back.addEventListener('click', () => goToIntakeStep(2));
}

// ── File upload logic ─────────────────────────────────────────────────────
const uploadDropzone   = document.getElementById('upload-dropzone');
const intakeFileInput  = document.getElementById('intake-file-input');
const uploadBrowseBtn  = document.getElementById('upload-browse-btn');
const uploadedFilesList = document.getElementById('uploaded-files-list');

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function renderUploadedFiles() {
  if (!uploadedFilesList) return;
  uploadedFilesList.innerHTML = '';
  intakeUploadedFiles.forEach((file, idx) => {
    const row = document.createElement('div');
    row.className = 'uploaded-file-row';
    row.innerHTML = `
      <div class="uploaded-file-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      </div>
      <span class="uploaded-file-name" title="${file.name}">${file.name}</span>
      <span class="uploaded-file-size">${formatBytes(file.size)}</span>
      <button class="uploaded-file-remove" data-idx="${idx}" title="Remove">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;
    row.querySelector('.uploaded-file-remove').addEventListener('click', (e) => {
      const i = parseInt(e.currentTarget.getAttribute('data-idx'));
      intakeUploadedFiles.splice(i, 1);
      renderUploadedFiles();
    });
    uploadedFilesList.appendChild(row);
  });
}

function addFiles(fileList) {
  Array.from(fileList).forEach(f => {
    if (!intakeUploadedFiles.find(ex => ex.name === f.name && ex.size === f.size)) {
      intakeUploadedFiles.push(f);
    }
  });
  renderUploadedFiles();
  showToast(`${fileList.length} file${fileList.length > 1 ? 's' : ''} added.`);
}

if (uploadBrowseBtn && intakeFileInput) {
  uploadBrowseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    intakeFileInput.click();
  });
  intakeFileInput.addEventListener('change', (e) => {
    if (e.target.files.length) addFiles(e.target.files);
    e.target.value = '';
  });
}

if (uploadDropzone) {
  uploadDropzone.addEventListener('click', (e) => {
    if (e.target !== uploadBrowseBtn && !uploadBrowseBtn.contains(e.target)) {
      intakeFileInput && intakeFileInput.click();
    }
  });
  uploadDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadDropzone.classList.add('drag-over');
  });
  uploadDropzone.addEventListener('dragleave', () => {
    uploadDropzone.classList.remove('drag-over');
  });
  uploadDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadDropzone.classList.remove('drag-over');
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  });
}

// ── Final submission ──────────────────────────────────────────────────────
const intakeSubmitBtn = document.getElementById('intake-submit-btn');
if (intakeSubmitBtn) {
  intakeSubmitBtn.addEventListener('click', () => {
    const firstName = document.getElementById('intake-firstname')?.value || 'Client';
    const refNum = `MTX-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    // Compile full intake data payload
    const intakePayload = {
      referenceNumber: refNum,
      submittedAt: (typeof firebase !== 'undefined' && firebase.firestore && firebase.firestore.FieldValue) 
        ? firebase.firestore.FieldValue.serverTimestamp() 
        : new Date().toISOString(),
      submittedAtIso: new Date().toISOString(),
      personalInfo: {
        firstName: document.getElementById('intake-firstname')?.value || '',
        lastName: document.getElementById('intake-lastname')?.value || '',
        ssn: document.getElementById('intake-ssn')?.value || '',
        dob: document.getElementById('intake-dob')?.value || '',
        phone: document.getElementById('intake-phone')?.value || '',
        email: document.getElementById('intake-email')?.value || '',
        address: document.getElementById('intake-address')?.value || '',
        company: document.getElementById('intake-company')?.value || '',
        spouse: document.getElementById('intake-spouse')?.value || ''
      },
      taxProfile: {
        filingStatus: document.getElementById('intake-filing-status')?.value || '',
        taxYear: document.getElementById('intake-tax-year')?.value || '',
        state: document.getElementById('intake-state')?.value || '',
        priorRefund: document.getElementById('intake-prior-refund')?.value || '',
        estimatedIncome: document.getElementById('intake-est-income')?.value || '',
        dependents: document.getElementById('intake-dependents')?.value || '',
        incomeSources: [
          document.getElementById('income-w2')?.checked ? 'W-2 Wages' : null,
          document.getElementById('income-1099')?.checked ? '1099 / Self-Employment' : null,
          document.getElementById('income-investment')?.checked ? 'Investment / Dividends' : null,
          document.getElementById('income-rental')?.checked ? 'Rental Property' : null,
          document.getElementById('income-business')?.checked ? 'Business Income (S-Corp/LLC)' : null,
          document.getElementById('income-foreign')?.checked ? 'Foreign Income / FBAR' : null
        ].filter(Boolean),
        notes: document.getElementById('intake-notes')?.value || ''
      },
      documents: {
        uploadedFiles: intakeUploadedFiles.map(f => ({
          name: f.name,
          size: f.size,
          type: f.type || 'unknown'
        })),
        checklist: {
          w2: document.getElementById('check-w2-upload')?.checked || false,
          form1099: document.getElementById('check-1099-upload')?.checked || false,
          priorReturn: document.getElementById('check-lastreturn')?.checked || false,
          governmentId: document.getElementById('check-id')?.checked || false,
          brokerage: document.getElementById('check-brokerage')?.checked || false,
          receipts: document.getElementById('check-receipts')?.checked || false
        }
      },
      status: 'pending_review',
      assignedPreparer: 'Marcus Kaelen, CPA'
    };

    // Write to Firebase Firestore
    if (typeof db !== 'undefined' && db) {
      db.collection('intakes').doc(refNum).set(intakePayload)
        .then(() => {
          console.log("Intake package persisted to Cloud Firestore successfully:", refNum);
          showToast(`Saved to Cloud Firestore! Ref: ${refNum}`);
        })
        .catch((err) => {
          console.error("Firestore write error:", err);
          showToast("Submitted locally (Firestore permission error: check security rules).");
        });
    }

    // Update confirmation screen
    const confirmName = document.getElementById('intake-confirm-name');
    const refNumber   = document.getElementById('intake-ref-number');
    if (confirmName) confirmName.textContent = firstName;
    if (refNumber)   refNumber.textContent   = refNum;

    // Add to audit log
    const now = new Date();
    AUDIT_LOGS.unshift({
      id: `log_intake_${now.getTime()}`,
      action: 'INTAKE_SUBMITTED',
      details: `Client intake package submitted & saved to database. Reference: ${refNum}. Files: ${intakeUploadedFiles.length}.`,
      time: 'Just now'
    });
    renderAuditLogs();

    // Add notification
    NOTIFICATIONS.unshift({
      id: `notif_intake_${now.getTime()}`,
      text: `New intake package received from ${firstName}. Ref: ${refNum}`,
      time: 'Just now',
      unread: true
    });
    renderNotifications();

    // Show success state
    ['1','2','3'].forEach(s => {
      const el = document.getElementById(`intake-step-${s}`);
      if (el) el.classList.add('hidden');
    });
    const donePanel = document.getElementById('intake-step-done');
    if (donePanel) donePanel.classList.remove('hidden');

    // Mark all stepper steps complete
    document.querySelectorAll('.stepper-item').forEach(item => {
      item.classList.remove('active');
      item.classList.add('completed');
      const circle = item.querySelector('.stepper-circle');
      if (circle) circle.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
    });
    document.querySelectorAll('.stepper-line').forEach(l => l.classList.add('filled'));

    showToast('Intake package submitted! Reference: ' + refNum);
  });
}

// ── Done → Dashboard ──────────────────────────────────────────────────────
const intakeDoneBtn = document.getElementById('intake-done-btn');
if (intakeDoneBtn) {
  intakeDoneBtn.addEventListener('click', () => {
    navigatePage('dashboard');
    intakeUploadedFiles = [];
  });
}

// ==========================================================================
// 13. CPA ADMIN CONSOLE & ROLE SWITCHER SYSTEM
// ==========================================================================

function applyRoleUI() {
  const roleBadge = document.getElementById('role-header-badge');
  const roleSwitchText = document.getElementById('role-switch-text');
  const profileName = document.getElementById('profile-user-fullname');
  const profileAvatar = document.getElementById('profile-avatar-letters');

  body.setAttribute('data-role', activeUserRole);

  if (activeUserRole === 'admin') {
    if (roleBadge) {
      roleBadge.textContent = 'CPA ADMIN ROLE';
      roleBadge.className = 'role-badge admin-role-badge';
    }
    if (roleSwitchText) roleSwitchText.textContent = 'Switch to Client Mode';
    if (profileName) profileName.textContent = 'Marcus Kaelen, CPA';
    if (profileAvatar) profileAvatar.textContent = 'MK';
  } else {
    if (roleBadge) {
      roleBadge.textContent = 'CLIENT ROLE';
      roleBadge.className = 'role-badge client-role-badge';
    }
    if (roleSwitchText) roleSwitchText.textContent = 'Switch to Admin Mode';
    if (profileName) profileName.textContent = `${CLIENT_USER.firstName} ${CLIENT_USER.lastName}`;
    if (profileAvatar) profileAvatar.textContent = `${CLIENT_USER.firstName[0]}${CLIENT_USER.lastName[0]}`;
  }
}

// Role Switcher Button Listener
const roleSwitcherBtn = document.getElementById('role-switcher-btn');
if (roleSwitcherBtn) {
  roleSwitcherBtn.addEventListener('click', () => {
    activeUserRole = activeUserRole === 'client' ? 'admin' : 'client';
    applyRoleUI();
    
    if (activeUserRole === 'admin') {
      showToast("Switched context to CPA Admin Console.");
      navigatePage('admin-intakes');
    } else {
      showToast("Switched context to Client Portal View.");
      navigatePage('dashboard');
    }
  });
}

// Extend navigatePage to support Admin screens
const _prevNavPage = navigatePage;
navigatePage = function(pageName) {
  _prevNavPage(pageName);

  let displayTitle = "Client Dashboard";
  if (pageName === 'documents') displayTitle = "Documents Center";
  if (pageName === 'settings') displayTitle = "Portal Settings";
  if (pageName === 'intake') displayTitle = "Client Intake";
  if (pageName === 'admin-intakes') {
    displayTitle = "CPA Admin Intakes Queue";
    loadAdminIntakesQueue();
  }
  if (pageName === 'admin-leads') {
    displayTitle = "Leads Pipeline & Conversion";
    loadAdminLeads();
  }
  if (pageName === 'admin-vault') displayTitle = "Client Vault Uploader";
  if (pageName === 'admin-training') displayTitle = "Developer Training";
  if (pageName === 'admin-developer-training') displayTitle = "Developer Onboarding";
  if (pageName === 'admin-github-training') displayTitle = "GitHub Workflow";

  headerPageTitle.textContent = displayTitle;
};

// ── Admin Intakes Queue (Firestore Sync) ──────────────────────────────────
let loadedIntakesData = [];
let activeSelectedIntake = null;

function loadAdminIntakesQueue() {
  const tbody = document.getElementById('admin-intakes-tbody');
  const emptyState = document.getElementById('admin-intakes-empty');
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 24px; color: var(--text-muted);">Loading live intakes from Cloud Firestore...</td></tr>`;

  if (typeof db !== 'undefined' && db) {
    db.collection('intakes').get().then(snapshot => {
      loadedIntakesData = [];
      snapshot.forEach(doc => {
        loadedIntakesData.push(doc.data());
      });
      renderAdminIntakesTable();
    }).catch(err => {
      console.error("Firestore read error:", err);
      // Fallback demo row if Firestore empty or offline
      if (loadedIntakesData.length === 0) {
        loadedIntakesData = [{
          referenceNumber: "MTX-2025-982410",
          submittedAtIso: new Date().toISOString(),
          personalInfo: { firstName: "Jane", lastName: "Doe", email: "jane.doe@example.com", phone: "(555) 000-0000" },
          taxProfile: { taxYear: "2025", filingStatus: "Single", incomeSources: ["W-2 Wages", "1099 / Self-Employment"] },
          documents: { uploadedFiles: [{ name: "2025_W2_JD_Designs.pdf", size: 145000 }] },
          status: "pending_review"
        }];
      }
      renderAdminIntakesTable();
    });
  } else {
    renderAdminIntakesTable();
  }
}

function renderAdminIntakesTable() {
  const tbody = document.getElementById('admin-intakes-tbody');
  const emptyState = document.getElementById('admin-intakes-empty');
  const statusFilter = document.getElementById('admin-intake-status-filter')?.value || 'all';

  if (!tbody) return;
  tbody.innerHTML = '';

  const filtered = loadedIntakesData.filter(item => {
    if (statusFilter === 'all') return true;
    return item.status === statusFilter;
  });

  if (filtered.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    return;
  }
  if (emptyState) emptyState.style.display = 'none';

  filtered.forEach(item => {
    const tr = document.createElement('tr');
    const statusLabel = item.status === 'pending_review' ? 'Pending Review' : (item.status === 'in_progress' ? 'In Progress' : 'Completed');
    
    tr.innerHTML = `
      <td><strong style="color: var(--accent);">${item.referenceNumber}</strong></td>
      <td><strong>${item.personalInfo?.firstName || 'Client'} ${item.personalInfo?.lastName || ''}</strong></td>
      <td>${item.personalInfo?.email || 'N/A'}<br><span style="font-size: 11px; color: var(--text-muted);">${item.personalInfo?.phone || ''}</span></td>
      <td>${item.taxProfile?.taxYear || '2025'}</td>
      <td>${item.taxProfile?.filingStatus || 'Single'}</td>
      <td><span class="source-tag">${(item.taxProfile?.incomeSources || []).length} Sources</span></td>
      <td>${(item.documents?.uploadedFiles || []).length} Files</td>
      <td><span class="status-pill ${item.status}">${statusLabel}</span></td>
      <td>
        <button class="btn btn-secondary inspect-intake-btn" data-ref="${item.referenceNumber}" style="padding: 6px 12px; font-size: 11px;">
          <span>Inspect</span>
        </button>
      </td>
    `;

    tr.querySelector('.inspect-intake-btn').addEventListener('click', () => {
      openAdminIntakeModal(item);
    });

    tbody.appendChild(tr);
  });
}

// Refresh button trigger
const adminRefreshBtn = document.getElementById('admin-refresh-intakes-btn');
if (adminRefreshBtn) {
  adminRefreshBtn.addEventListener('click', () => {
    loadAdminIntakesQueue();
    showToast("Refreshed Firestore intakes queue.");
  });
}

// Status filter select trigger
const adminStatusFilterSelect = document.getElementById('admin-intake-status-filter');
if (adminStatusFilterSelect) {
  adminStatusFilterSelect.addEventListener('change', renderAdminIntakesTable);
}

// ── Admin Intake Inspector Modal ──────────────────────────────────────────
function openAdminIntakeModal(item) {
  activeSelectedIntake = item;
  const modal = document.getElementById('admin-intake-detail-modal');
  const title = document.getElementById('admin-modal-title');
  const ref = document.getElementById('admin-modal-ref');
  const bodyContent = document.getElementById('admin-modal-body-content');
  const statusSelect = document.getElementById('admin-modal-status-select');

  if (!modal || !bodyContent) return;

  title.textContent = `Intake: ${item.personalInfo?.firstName || ''} ${item.personalInfo?.lastName || ''}`;
  ref.textContent = `Ref: ${item.referenceNumber} • Submitted: ${item.submittedAtIso ? new Date(item.submittedAtIso).toLocaleString() : 'Recently'}`;
  if (statusSelect) statusSelect.value = item.status || 'pending_review';

  bodyContent.innerHTML = `
    <div class="admin-detail-grid">
      <div class="admin-detail-block">
        <div class="admin-detail-label">Legal Name</div>
        <div class="admin-detail-val">${item.personalInfo?.firstName || ''} ${item.personalInfo?.lastName || ''}</div>
      </div>
      <div class="admin-detail-block">
        <div class="admin-detail-label">SSN &amp; DOB</div>
        <div class="admin-detail-val">${item.personalInfo?.ssn || 'XXX-XX-XXXX'} | ${item.personalInfo?.dob || 'N/A'}</div>
      </div>
      <div class="admin-detail-block">
        <div class="admin-detail-label">Contact Info</div>
        <div class="admin-detail-val">${item.personalInfo?.email || ''}<br>${item.personalInfo?.phone || ''}</div>
      </div>
      <div class="admin-detail-block">
        <div class="admin-detail-label">Home Address</div>
        <div class="admin-detail-val">${item.personalInfo?.address || 'N/A'}</div>
      </div>
      <div class="admin-detail-block">
        <div class="admin-detail-label">Tax Profile</div>
        <div class="admin-detail-val">Year: ${item.taxProfile?.taxYear || ''} • Status: ${item.taxProfile?.filingStatus || ''} • State: ${item.taxProfile?.state || ''}</div>
      </div>
      <div class="admin-detail-block">
        <div class="admin-detail-label">Financial Metrics</div>
        <div class="admin-detail-val">Est Income: ${item.taxProfile?.estimatedIncome || 'N/A'} • Prior Refund: ${item.taxProfile?.priorRefund || 'N/A'}</div>
      </div>
    </div>

    <div style="margin-bottom: 20px;">
      <div class="admin-detail-label">Income Sources Checked</div>
      <div class="source-tag-list">
        ${(item.taxProfile?.incomeSources || []).map(s => `<span class="source-tag">${s}</span>`).join('') || '<span style="font-size:12px;color:var(--text-muted);">None specified</span>'}
      </div>
    </div>

    <div style="margin-bottom: 20px;">
      <div class="admin-detail-label">Uploaded Source Files (${(item.documents?.uploadedFiles || []).length})</div>
      <ul style="list-style: none; margin-top: 6px;">
        ${(item.documents?.uploadedFiles || []).map(f => `<li style="font-size: 13px; color: var(--text-primary); padding: 4px 0;">📄 <strong>${f.name}</strong> (${(f.size/1024).toFixed(1)} KB)</li>`).join('') || '<li style="font-size:12px;color:var(--text-muted);">No files attached</li>'}
      </ul>
    </div>

    ${item.taxProfile?.notes ? `
      <div>
        <div class="admin-detail-label">Client Notes</div>
        <p style="font-size: 13px; color: var(--text-secondary); background: var(--bg-tertiary); padding: 10px; border-radius: 8px; margin-top: 4px;">"${item.taxProfile.notes}"</p>
      </div>
    ` : ''}
  `;

  modal.classList.add('show');
}

const adminModalCloseBtn = document.getElementById('admin-modal-close-btn');
if (adminModalCloseBtn) {
  adminModalCloseBtn.addEventListener('click', () => {
    document.getElementById('admin-intake-detail-modal')?.classList.remove('show');
  });
}

const adminModalSaveStatusBtn = document.getElementById('admin-modal-save-status-btn');
if (adminModalSaveStatusBtn) {
  adminModalSaveStatusBtn.addEventListener('click', () => {
    if (!activeSelectedIntake) return;
    const newStatus = document.getElementById('admin-modal-status-select')?.value;
    activeSelectedIntake.status = newStatus;

    if (typeof db !== 'undefined' && db) {
      db.collection('intakes').doc(activeSelectedIntake.referenceNumber).update({ status: newStatus })
        .then(() => {
          showToast(`Intake status updated to '${newStatus}' in Firestore.`);
          document.getElementById('admin-intake-detail-modal')?.classList.remove('show');
          renderAdminIntakesTable();
        })
        .catch(err => {
          console.error("Firestore update error:", err);
          showToast(`Status updated locally.`);
          document.getElementById('admin-intake-detail-modal')?.classList.remove('show');
          renderAdminIntakesTable();
        });
    } else {
      document.getElementById('admin-intake-detail-modal')?.classList.remove('show');
      renderAdminIntakesTable();
    }
  });
}

// ── Admin Leads Pipeline (Corner Cup Coffee Magnet Sync) ─────────────────
let loadedLeadsData = [];

function loadAdminLeads() {
  const tbody = document.getElementById('admin-leads-tbody');
  const emptyState = document.getElementById('admin-leads-empty');
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 24px; color: var(--text-muted);">Loading event leads from Cloud Firestore...</td></tr>`;

  if (typeof db !== 'undefined' && db) {
    db.collection('leads').get().then(snapshot => {
      loadedLeadsData = [];
      snapshot.forEach(doc => {
        loadedLeadsData.push({ id: doc.id, ...doc.data() });
      });

      // Sort newest first
      loadedLeadsData.sort((a, b) => {
        const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
        const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
        return timeB - timeA;
      });

      renderAdminLeadsTable();
    }).catch(err => {
      console.error("Firestore leads read error:", err);
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 24px; color: var(--accent-red,#ef4444);">Could not load leads: ${err.message}</td></tr>`;
    });
  } else {
    renderAdminLeadsTable();
  }
}

function renderAdminLeadsTable() {
  const tbody = document.getElementById('admin-leads-tbody');
  const emptyState = document.getElementById('admin-leads-empty');
  const totalStat = document.getElementById('leads-stat-total');
  const newStat = document.getElementById('leads-stat-new');
  const convertedStat = document.getElementById('leads-stat-converted');

  if (!tbody) return;

  const totalCount = loadedLeadsData.length;
  const newCount = loadedLeadsData.filter(l => (l.status || 'new') === 'new').length;
  const convertedCount = loadedLeadsData.filter(l => l.status === 'converted').length;

  if (totalStat) totalStat.textContent = totalCount;
  if (newStat) newStat.textContent = newCount;
  if (convertedStat) convertedStat.textContent = convertedCount;

  if (totalCount === 0) {
    tbody.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  tbody.innerHTML = loadedLeadsData.map(lead => {
    const leadId = lead.id;
    const name = lead.fullName || 'Anonymous Lead';
    const company = lead.businessName ? `<div style="font-size: 11px; color: var(--text-muted);">${lead.businessName} • ${lead.industry || 'General'}</div>` : '';
    const email = lead.email || 'N/A';
    const help = lead.helpNeeded || 'General Inquiry';
    const bottleneck = lead.bottleneck ? `<div style="font-size: 11px; color: var(--text-muted); font-style: italic;">"${lead.bottleneck.substring(0, 45)}${lead.bottleneck.length > 45 ? '…' : ''}"</div>` : '';
    const budget = lead.budget || 'N/A';
    const timeline = lead.timeline || 'ASAP';
    const status = lead.status || 'new';

    const isConverted = status === 'converted';

    return `
      <tr>
        <td>
          <div style="font-weight: 600; color: var(--text-primary);">${name}</div>
          ${company}
        </td>
        <td>
          <a href="mailto:${email}" style="color: var(--accent); text-decoration: none;">${email}</a>
        </td>
        <td>
          <div style="font-weight: 500;">${help}</div>
          ${bottleneck}
        </td>
        <td>
          <div style="font-size: 12px;">${budget}</div>
          <div style="font-size: 11px; color: var(--text-muted);">${timeline}</div>
        </td>
        <td>
          <select onchange="updateLeadStatus('${leadId}', this.value)" style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-subtle); color: var(--text-primary); border-radius: 6px; padding: 4px 8px; font-size: 12px; cursor: pointer;">
            <option value="new" ${status === 'new' ? 'selected' : ''}>🟢 New Lead</option>
            <option value="contacted" ${status === 'contacted' ? 'selected' : ''}>🔵 Contacted</option>
            <option value="proposal_sent" ${status === 'proposal_sent' ? 'selected' : ''}>🟡 Proposal Sent</option>
            <option value="converted" ${status === 'converted' ? 'selected' : ''}>✅ Converted</option>
          </select>
        </td>
        <td>
          ${isConverted ? `
            <span style="font-size: 12px; color: #10b981; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">
              ✓ Client Portal User
            </span>
          ` : `
            <button onclick="convertLeadToClient('${leadId}', '${email}', '${name.replace(/'/g, "\\'")}')" class="btn-secondary" style="padding: 6px 12px; font-size: 11px; border-radius: 6px; background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.4); color: var(--accent); cursor: pointer; font-weight: 600;">
              ✨ Convert to Client
            </button>
          `}
        </td>
      </tr>
    `;
  }).join('');
}

function updateLeadStatus(leadId, newStatus) {
  if (typeof db !== 'undefined' && db) {
    db.collection('leads').doc(leadId).update({ status: newStatus })
      .then(() => {
        showToast(`Lead status updated to '${newStatus}'.`);
        const target = loadedLeadsData.find(l => l.id === leadId);
        if (target) target.status = newStatus;
        renderAdminLeadsTable();
      })
      .catch(err => {
        console.error("Lead status update error:", err);
        showToast(`Error updating lead status.`);
      });
  }
}

async function convertLeadToClient(leadId, email, fullName) {
  if (!confirm(`Convert ${fullName} (${email}) into a Magnitax Client Portal user?`)) return;

  const parts = fullName.split(' ');
  const firstName = parts[0] || 'Client';
  const lastName = parts.slice(1).join(' ') || '';

  showToast(`Creating client profile for ${fullName}…`);

  try {
    // 1. Create client record in Firestore users collection
    const userSnapshot = await db.collection('users').where('email', '==', email).get();

    let targetUid = null;
    if (!userSnapshot.empty) {
      targetUid = userSnapshot.docs[0].id;
      await db.collection('users').doc(targetUid).update({ role: 'client', firstName, lastName });
    } else {
      // Create new Firestore profile document
      const newRef = db.collection('users').doc();
      targetUid = newRef.id;
      await newRef.set({
        email: email,
        role: 'client',
        firstName: firstName,
        lastName: lastName,
        convertedFromLead: leadId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }

    // 2. Mark lead as converted in Firestore leads collection
    await db.collection('leads').doc(leadId).update({
      status: 'converted',
      convertedUid: targetUid,
      convertedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    const targetLead = loadedLeadsData.find(l => l.id === leadId);
    if (targetLead) targetLead.status = 'converted';

    showToast(`✓ ${fullName} converted to Client! Profile created in Firestore.`);
    renderAdminLeadsTable();

    // Reload admin upload client dropdown so they show up immediately
    if (typeof loadAdminClientDropdown === 'function') loadAdminClientDropdown();

  } catch (err) {
    console.error("Lead conversion error:", err);
    showToast(`Conversion error: ${err.message}`);
  }
}

// Refresh button event listener
document.getElementById('refresh-leads-btn')?.addEventListener('click', () => {
  showToast('Refreshing event leads pipeline…');
  loadAdminLeads();
});

// ── Phase B: Real Admin Document Upload (Firebase Storage + Firestore) ─────

// Populate the client dropdown from Firestore users collection
async function loadAdminClientDropdown() {
  const select = document.getElementById('admin-upload-client');
  if (!select) return;
  try {
    const snapshot = await db.collection('users').where('role', '==', 'client').get();
    select.innerHTML = '<option value="" disabled>Select a client…</option>';

    if (!snapshot.empty) {
      snapshot.forEach(doc => {
        const u = doc.data();
        const opt = document.createElement('option');
        opt.value = doc.id; // Firebase UID
        opt.textContent = `${u.firstName || ''} ${u.lastName || ''}`.trim() + (u.email ? ` (${u.email})` : '');
        select.appendChild(opt);
      });
      // Select first client by default
      select.selectedIndex = 1;
    } else {
      // Fallback for Jane Doe if Firestore users collection has not been populated yet
      const opt = document.createElement('option');
      opt.value = 'MnrSi74nDBUFAHZJbHzUVVn50rC3'; // Jane Doe UID from Auth
      opt.textContent = 'Jane Doe (jane@example.com)';
      opt.selected = true;
      select.appendChild(opt);
    }
  } catch (err) {
    console.error('Could not load clients:', err);
    select.innerHTML = '<option value="MnrSi74nDBUFAHZJbHzUVVn50rC3" selected>Jane Doe (jane@example.com)</option>';
  }
}

// Show selected filename in the drop zone label
const fileInput = document.getElementById('admin-upload-file-input');
const fileLabel = document.getElementById('admin-file-label');
if (fileInput) {
  fileInput.addEventListener('change', () => {
    if (fileInput.files && fileInput.files[0]) {
      const f = fileInput.files[0];
      if (fileLabel) fileLabel.textContent = `✓ ${f.name} (${(f.size / 1024).toFixed(1)} KB)`;
      // Auto-fill filename field if empty
      const fnInput = document.getElementById('admin-upload-filename');
      if (fnInput && !fnInput.value) fnInput.value = f.name;
    }
  });
}

const adminUploadForm = document.getElementById('admin-upload-form');
if (adminUploadForm) {
  adminUploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!currentFirebaseUser) {
      showToast('Error: You must be logged in to upload documents.');
      return;
    }

    const clientUid  = document.getElementById('admin-upload-client').value;
    const type       = document.getElementById('admin-upload-type').value;
    const year       = parseInt(document.getElementById('admin-upload-year').value);
    const fileName   = document.getElementById('admin-upload-filename').value.trim();
    const payer      = document.getElementById('admin-upload-payer').value.trim();
    const file       = fileInput ? fileInput.files[0] : null;
    const submitBtn  = document.getElementById('admin-upload-submit-btn');
    const progressWrapper = document.getElementById('admin-upload-progress-wrapper');
    const progressBar     = document.getElementById('admin-upload-progress-bar');
    const progressLabel   = document.getElementById('admin-upload-progress-label');

    if (!clientUid) { showToast('Please select a target client.'); return; }
    if (!file)      { showToast('Please select a file to upload.'); return; }
    if (!fileName)  { showToast('Please enter a document title.'); return; }

    // Max 25 MB
    if (file.size > 25 * 1024 * 1024) {
      showToast('File exceeds 25 MB limit. Please choose a smaller file.');
      return;
    }

    // Disable form during upload
    if (submitBtn) { submitBtn.disabled = true; submitBtn.querySelector('span').textContent = 'Uploading…'; }
    if (progressWrapper) progressWrapper.style.display = 'block';

    const storagePath = `documents/${clientUid}/${year}/${type}/${Date.now()}_${fileName}`;
    const storageRef  = storage.ref(storagePath);
    const uploadTask  = storageRef.put(file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        if (progressBar)   progressBar.style.width   = `${pct}%`;
        if (progressLabel) progressLabel.textContent = `Uploading… ${pct}%`;
      },
      (err) => {
        console.error('Upload failed:', err);
        showToast(`Upload failed: ${err.message}`);
        if (submitBtn) { submitBtn.disabled = false; submitBtn.querySelector('span').textContent = 'Upload & Publish to Client Vault'; }
        if (progressWrapper) progressWrapper.style.display = 'none';
      },
      async () => {
        // Upload complete — get download URL and write metadata to Firestore
        try {
          const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
          const fileSizeKB  = (file.size / 1024).toFixed(1) + ' KB';

          await db.collection('documents').add({
            clientUid:   clientUid,
            fileName:    fileName,
            type:        type,
            taxYear:     year,
            storagePath: storagePath,
            downloadURL: downloadURL,
            fileSize:    fileSizeKB,
            payer:       payer,
            uploadedBy:  currentFirebaseUser.uid,
            uploadedAt:  firebase.firestore.FieldValue.serverTimestamp(),
            status:      'ready'
          });

          if (progressLabel) progressLabel.textContent = '✓ Upload complete!';
          if (progressBar)   progressBar.style.background = 'linear-gradient(90deg,#10b981,#34d399)';
          showToast(`✓ ${fileName} published to client vault successfully!`);
          adminUploadForm.reset();
          if (fileLabel) fileLabel.textContent = 'Click to choose a file, or drag & drop here';
          setTimeout(() => {
            if (progressWrapper) progressWrapper.style.display = 'none';
            if (progressBar)   progressBar.style.width = '0%';
          }, 2500);

          // Refresh the documents list so admin can see it
          await loadClientDocuments();
        } catch (err) {
          console.error('Firestore write failed after upload:', err);
          showToast('File uploaded but metadata save failed. Check Firestore rules.');
        } finally {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.querySelector('span').textContent = 'Upload & Publish to Client Vault'; }
        }
      }
    );
  });
}

// ── Real Logout ────────────────────────────────────────────────────────────
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    try {
      await auth.signOut();
      // onAuthStateChanged will handle redirecting to login
      showToast('You have been securely logged out.');
    } catch (err) {
      console.error('Logout error:', err);
    }
  });
}

// ── Real Download: Firebase Storage URL ───────────────────────────────────
function getDocDownloadURL(doc) {
  if (doc.downloadURL) return Promise.resolve(doc.downloadURL);
  if (doc.storagePath) return storage.ref(doc.storagePath).getDownloadURL();
  return Promise.resolve(null);
}

// ── Initialize app on page load ───────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  // onAuthStateChanged fires automatically — no need to call setView('login') here
  // It will detect no user and call setView('login') for us
});
