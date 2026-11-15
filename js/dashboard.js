/**
 * dashboard.js — Harmonix Music Academy
 * Dashboard logic: auth guard, populate UI, sidebar nav,
 * mobile sidebar toggle, panel switching, logout.
 */

'use strict';

/* ── Auth guard ───────────────────────────────────────────── */
Auth.requireAuth('login.html');

/* ── Session data ─────────────────────────────────────────── */
const session = Auth.getSession();

/* ── DOM refs ─────────────────────────────────────────────── */
const sidebarEl      = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarToggle  = document.getElementById('sidebarToggle');
const sidebarAvatar  = document.getElementById('sidebarAvatar');
const sidebarName    = document.getElementById('sidebarName');
const sidebarRole    = document.getElementById('sidebarRole');
const topbarAvatar   = document.getElementById('topbarAvatar');
const topbarTitle    = document.getElementById('topbarTitle');
const topbarGreeting = document.getElementById('topbarGreeting');
const welcomeName    = document.getElementById('welcomeName');
const logoutBtn      = document.getElementById('logoutBtn');
const allLinks       = document.querySelectorAll('.sidebar-link[data-panel]');
const allPanels      = document.querySelectorAll('.tab-panel');

/* ── Populate user info ───────────────────────────────────── */
function populateUserInfo() {
  const initials    = Auth.getInitials();
  const displayName = Auth.getDisplayName();
  const firstName   = session.firstName;
  const role        = session.role || 'student';

  // Sidebar
  sidebarAvatar.textContent = initials;
  sidebarName.textContent   = displayName;
  sidebarRole.textContent   = role;

  // Topbar
  topbarAvatar.textContent   = initials;
  topbarAvatar.setAttribute('aria-label', `${displayName} — avatar`);
  topbarGreeting.textContent = `Hi, ${firstName}!`;

  // Welcome banner
  if (welcomeName) welcomeName.textContent = firstName;

  // Profile panel
  const profileAvatar = document.getElementById('profileAvatar');
  const profileName   = document.getElementById('profileName');
  const profileEmail  = document.getElementById('profileEmail');
  const profileRole   = document.getElementById('profileRole');
  if (profileAvatar) profileAvatar.textContent = initials;
  if (profileName)   profileName.textContent   = displayName;
  if (profileEmail)  profileEmail.textContent  = session.email;
  if (profileRole)   profileRole.textContent   = role;
}

populateUserInfo();

/* ── Panel switching ──────────────────────────────────────── */
const PANEL_TITLES = {
  overview:  'Overview',
  courses:   'My Courses',
  schedule:  'Schedule',
  progress:  'My Progress',
  teachers:  'Teachers',
  messages:  'Messages',
  resources: 'Resources',
  profile:   'My Profile',
  settings:  'Settings',
};

function activatePanel(panelId) {
  // Update panels
  allPanels.forEach((panel) => {
    panel.classList.toggle('active', panel.id === `panel-${panelId}`);
  });

  // Update sidebar links
  allLinks.forEach((link) => {
    const isActive = link.dataset.panel === panelId;
    link.classList.toggle('active', isActive);
    link.setAttribute('aria-current', isActive ? 'page' : 'false');
  });

  // Update topbar title
  topbarTitle.textContent = PANEL_TITLES[panelId] || 'Dashboard';

  // Close sidebar on mobile after navigation
  if (window.innerWidth < 768) closeSidebar();
}

allLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    activatePanel(link.dataset.panel);
  });
});

// Welcome banner "View Schedule" and other inline data-panel links
document.addEventListener('click', (e) => {
  const link = e.target.closest('[data-panel]');
  if (!link || !link.dataset.panel) return;
  // Only intercept if not already handled by sidebar links
  if (!link.classList.contains('sidebar-link')) {
    e.preventDefault();
    activatePanel(link.dataset.panel);
  }
});

/* ── Mobile sidebar ───────────────────────────────────────── */
function openSidebar() {
  sidebarEl.classList.add('is-open');
  sidebarOverlay.classList.add('is-open');
  sidebarOverlay.removeAttribute('aria-hidden');
  sidebarToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  sidebarEl.classList.remove('is-open');
  sidebarOverlay.classList.remove('is-open');
  sidebarOverlay.setAttribute('aria-hidden', 'true');
  sidebarToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

sidebarToggle.addEventListener('click', () => {
  sidebarEl.classList.contains('is-open') ? closeSidebar() : openSidebar();
});

sidebarOverlay.addEventListener('click', closeSidebar);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && sidebarEl.classList.contains('is-open')) {
    closeSidebar();
    sidebarToggle.focus();
  }
});

/* ── Logout ───────────────────────────────────────────────── */
logoutBtn.addEventListener('click', () => {
  Auth.logout();
  window.location.replace('login.html');
});

/* ── Topbar avatar → profile panel ───────────────────────── */
document.getElementById('topbarAvatar').addEventListener('click', () => {
  activatePanel('profile');
});

/* ── Animate progress bars on load ───────────────────────── */
(function animateBars() {
  document.querySelectorAll('.progress-bar-fill').forEach((bar) => {
    const target = bar.style.width;
    bar.style.width = '0%';
    // Allow paint, then animate
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bar.style.width = target;
      });
    });
  });
})();

/* ── Live clock in topbar greeting ───────────────────────── */
function getTimeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

topbarGreeting.textContent = `${getTimeGreeting()}, ${session.firstName}!`;
