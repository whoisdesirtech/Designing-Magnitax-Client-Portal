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
  wpLinked: true,
  twoFactorActive: true
};

const DOCUMENTS_DB = [
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
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const pass = document.getElementById('login-password').value;
  
  // Mock check (allowing simple email formats and password)
  if (email.includes('@') && pass.length >= 6) {
    loginError.style.display = 'none';
    showToast("Credentials accepted. Awaiting Two-Factor verification.");
    
    // Jump to 2FA layout, trigger focus on first slot
    setView('2fa');
    setTimeout(() => {
      digitInputs[0].focus();
    }, 200);
  } else {
    loginErrorText.textContent = "Invalid email formatting or password length (must be at least 6 characters).";
    loginError.style.display = 'flex';
  }
});

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
  digitInputs.forEach(input => {
    code += input.value;
  });
  document.getElementById('full-2fa-code').value = code;
}

twoFactorForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const code = document.getElementById('full-2fa-code').value;
  
  // Mock validation: accept code "123456" or any 6 digits starting with '1' or '2' for demo
  if (code.length === 6 && (code === '123456' || code.startsWith('1') || code.startsWith('2') || code.startsWith('3'))) {
    twoFactorError.style.display = 'none';
    
    // Set user profile text
    profileUserFullname.textContent = `${CLIENT_USER.firstName} ${CLIENT_USER.lastName}`;
    profileAvatarLetters.textContent = `${CLIENT_USER.firstName[0]}${CLIENT_USER.lastName[0]}`;
    
    // Add success login to audit logs
    const now = new Date();
    AUDIT_LOGS.unshift({
      id: `log_login_${now.getTime()}`,
      action: "LOGIN_SUCCESS",
      details: "Two-Factor passcode verified. Dashboard session unlocked.",
      time: "Just now"
    });
    
    setView('app');
    showToast("Security authentication verified. Welcome back.");
  } else {
    twoFactorError.style.display = 'flex';
    digitInputs.forEach(input => input.value = '');
    digitInputs[0].focus();
  }
});

backLoginBtn.addEventListener('click', (e) => {
  e.preventDefault();
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

// 7. DOCUMENTS CATALOG LOGIC (SEARCH & FILTER)
let activeTypeFilter = 'all';

function renderDocumentsList() {
  documentsGalleryViewport.innerHTML = '';
  
  const searchVal = docSearchInput.value.toLowerCase();
  const yearVal = docYearFilter.value;
  
  const filtered = DOCUMENTS_DB.filter(doc => {
    // Search filter
    const matchesSearch = doc.fileName.toLowerCase().includes(searchVal);
    
    // Year filter
    const matchesYear = (yearVal === 'all') || (doc.taxYear.toString() === yearVal);
    
    // Type filter
    const matchesType = (activeTypeFilter === 'all') || (doc.type === activeTypeFilter);
    
    return matchesSearch && matchesYear && matchesType;
  });
  
  // Render Stats on Dashboard dynamically
  const userFilesCount = DOCUMENTS_DB.length;
  document.getElementById('dash-stat-taxfiles').textContent = `${userFilesCount} File${userFilesCount !== 1 ? 's' : ''}`;

  if (filtered.length === 0) {
    documentsGalleryViewport.appendChild(docsEmptyState);
    docsEmptyState.style.display = 'flex';
    return;
  }
  
  docsEmptyState.style.display = 'none';
  
  filtered.forEach(doc => {
    const docCard = document.createElement('div');
    docCard.className = `doc-card ${doc.type}`;
    
    // SVG icons based on category
    let typeIcon = '';
    let categoryText = '';
    
    if (doc.type === 'w2') {
      categoryText = 'W-2 Form';
      typeIcon = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="16" rx="2" ry="2"/>
          <line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/>
        </svg>
      `;
    } else if (doc.type === '1099') {
      categoryText = '1099 Form';
      typeIcon = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
        </svg>
      `;
    } else {
      categoryText = 'Form Summary';
      typeIcon = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
        </svg>
      `;
    }
    
    docCard.innerHTML = `
      <div class="doc-card-header">
        <div class="doc-badge-icon">${typeIcon}</div>
        <span class="doc-year-badge">${doc.taxYear}</span>
      </div>
      <h4 class="doc-title" title="${doc.fileName}">${doc.fileName}</h4>
      <div class="doc-meta">
        <div class="doc-meta-item">
          <span>${categoryText}</span>
        </div>
        <div class="doc-meta-item">
          <span>•</span>
          <span>${doc.fileSize}</span>
        </div>
      </div>
      <div class="doc-card-actions">
        <button class="btn-doc-action preview" data-id="${doc.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
          </svg>
          <span>Preview</span>
        </button>
        <button class="btn-doc-action download" data-id="${doc.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span>Download</span>
        </button>
      </div>
    `;
    
    // Bind click events
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
function triggerDocDownload(docId) {
  const doc = DOCUMENTS_DB.find(d => d.id === docId);
  if (!doc) return;
  
  // Create simulated binary document data to download
  const mockContent = `
    =========================================
    MAGNITAX SECURE DOCUMENT SERVER
    =========================================
    File: ${doc.fileName}
    Category: ${doc.type.toUpperCase()}
    Tax Year: ${doc.taxYear}
    Security Token: SHA256-${Math.random().toString(36).substring(2, 15)}
    
    This is a cryptographically secured mockup representing the tax document.
    Full PDF contents reside in secure S3 storage.
  `;
  
  const blob = new Blob([mockContent], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = doc.fileName.replace('.pdf', '_secured.pdf');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  
  // Log download action to audit log
  const now = new Date();
  AUDIT_LOGS.unshift({
    id: `log_down_${now.getTime()}`,
    action: "DOCUMENT_DOWNLOADED",
    details: `Successfully downloaded ${doc.fileName} via secure endpoint redirect.`,
    time: "Just now"
  });
  renderAuditLogs();
  
  showToast(`Initiating download for ${doc.fileName}`);
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

// Secure Sign-Out Trigger
logoutBtn.addEventListener('click', () => {
  const confirmLogout = confirm("Confirm secure session termination?");
  if (confirmLogout) {
    setView('login');
    // Clear forms
    digitInputs.forEach(i => i.value = '');
    document.getElementById('full-2fa-code').value = '';
    showToast("Session disconnected. Cookies destroyed.");
  }
});

// Initialize on page load (starts with Login gate)
window.addEventListener('DOMContentLoaded', () => {
  setView('login');
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
      details: `Client intake package submitted. Reference: ${refNum}. Files: ${intakeUploadedFiles.length}.`,
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

