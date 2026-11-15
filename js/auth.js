/**
 * auth.js — Harmonix Music Academy
 * Client-side authentication layer using localStorage.
 * No real backend yet; structured so it can be swapped for a real API later.
 */

'use strict';

/* ═══════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════ */
const AUTH_KEY    = 'harmonix_auth';     // current session
const USERS_KEY   = 'harmonix_users';    // registered users store
const SESSION_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

/* ═══════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════ */

/** Simple hash — NOT cryptographic, demo only */
function hashPassword(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash.toString(16);
}

/** Load all registered users from localStorage */
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

/** Persist users array */
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/** Load current session */
function getSession() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    // Expire check
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(AUTH_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

/** Persist a new session */
function saveSession(user) {
  const session = {
    userId:    user.id,
    firstName: user.firstName,
    lastName:  user.lastName,
    email:     user.email,
    role:      user.role,
    avatar:    user.avatar || null,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_TTL,
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  return session;
}

/* ═══════════════════════════════════════════════════════
   PUBLIC API  — Auth
═══════════════════════════════════════════════════════ */
const Auth = {

  /**
   * Register a new user.
   * Returns { ok: true, user } or { ok: false, error: string }
   */
  register({ firstName, lastName, email, password, role = 'student' }) {
    const users = getUsers();

    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'An account with this email already exists.' };
    }

    const user = {
      id:        crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      firstName: firstName.trim(),
      lastName:  lastName.trim(),
      email:     email.toLowerCase().trim(),
      password:  hashPassword(password),
      role,                               // 'student' | 'teacher' | 'admin'
      avatar:    null,
      joinedAt:  new Date().toISOString(),
    };

    users.push(user);
    saveUsers(users);

    const session = saveSession(user);
    return { ok: true, session };
  },

  /**
   * Log in an existing user.
   * Returns { ok: true, session } or { ok: false, error: string }
   */
  login({ email, password }) {
    const users = getUsers();
    const user  = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());

    if (!user || user.password !== hashPassword(password)) {
      return { ok: false, error: 'Invalid email or password.' };
    }

    const session = saveSession(user);
    return { ok: true, session };
  },

  /** Log out the current user */
  logout() {
    localStorage.removeItem(AUTH_KEY);
  },

  /** Returns the current session object, or null if not logged in */
  getSession,

  /** Returns true if a valid session exists */
  isLoggedIn() {
    return getSession() !== null;
  },

  /**
   * Guard: redirect to login if not authenticated.
   * Call at the top of any protected page.
   */
  requireAuth(redirectTo = '../pages/login.html') {
    if (!this.isLoggedIn()) {
      window.location.replace(redirectTo);
    }
  },

  /**
   * Guard: redirect to dashboard if already authenticated.
   * Call at the top of login/register pages.
   */
  redirectIfLoggedIn(redirectTo = '../pages/dashboard.html') {
    if (this.isLoggedIn()) {
      window.location.replace(redirectTo);
    }
  },

  /** Update avatar initials stored in session (UI convenience) */
  getInitials() {
    const s = getSession();
    if (!s) return '?';
    return (s.firstName[0] + s.lastName[0]).toUpperCase();
  },

  /** Return display name */
  getDisplayName() {
    const s = getSession();
    if (!s) return '';
    return `${s.firstName} ${s.lastName}`;
  },
};

/* expose globally */
window.Auth = Auth;
