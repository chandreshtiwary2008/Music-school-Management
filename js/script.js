/**
 * Harmonix Music Academy — script.js
 * Vanilla JS: navigation, scroll effects, animations,
 * testimonial slider, counter, form validation.
 */

'use strict';

/* ═══════════════════════════════════════════════════════════
   1. DOM references
═══════════════════════════════════════════════════════════ */
const navbar        = document.getElementById('navbar');
const hamburger     = document.getElementById('hamburger');
const navMenu       = document.getElementById('navMenu');
const navLinks      = document.querySelectorAll('.nav-link');
const backToTop     = document.getElementById('backToTop');
const contactForm   = document.getElementById('contactForm');
const submitBtn     = document.getElementById('submitBtn');
const formSuccess   = document.getElementById('formSuccess');
const newsletterForm    = document.getElementById('newsletterForm');
const newsletterSuccess = document.getElementById('newsletterSuccess');
const copyrightYear = document.getElementById('copyrightYear');
const prevBtn       = document.getElementById('prevTestimonial');
const nextBtn       = document.getElementById('nextTestimonial');
const track         = document.getElementById('testimonialsTrack');
const dotsContainer = document.getElementById('testimonialDots');
const statNumbers   = document.querySelectorAll('.stat__number');
const revealEls     = document.querySelectorAll('.reveal');
const particlesWrap = document.getElementById('particles');

/* ═══════════════════════════════════════════════════════════
   2. Copyright year
═══════════════════════════════════════════════════════════ */
if (copyrightYear) {
  copyrightYear.textContent = new Date().getFullYear();
}

/* ═══════════════════════════════════════════════════════════
   3. Navbar — scroll state & active link tracking
═══════════════════════════════════════════════════════════ */
function updateNavbar() {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}

/** Determine which section is currently visible and highlight its nav link */
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id], header[id]');
  let currentId = '';

  sections.forEach((section) => {
    const top    = section.getBoundingClientRect().top;
    const height = section.offsetHeight;
    if (top <= 90 && top + height > 90) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute('href').replace('#', '');
    link.classList.toggle('active', href === currentId);
  });
}

window.addEventListener('scroll', () => {
  updateNavbar();
  updateActiveLink();
  toggleBackToTop();
}, { passive: true });

updateNavbar(); // Run once on load

/* ═══════════════════════════════════════════════════════════
   4. Mobile hamburger menu
═══════════════════════════════════════════════════════════ */
function openMenu() {
  hamburger.classList.add('is-open');
  navMenu.classList.add('is-open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden'; // prevent background scroll
}

function closeMenu() {
  hamburger.classList.remove('is-open');
  navMenu.classList.remove('is-open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.contains('is-open');
  isOpen ? closeMenu() : openMenu();
});

// Close when a nav link is clicked
navLinks.forEach((link) => {
  link.addEventListener('click', closeMenu);
});

// Close when user clicks outside the menu
document.addEventListener('click', (e) => {
  if (
    navMenu.classList.contains('is-open') &&
    !navMenu.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    closeMenu();
  }
});

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
    closeMenu();
    hamburger.focus();
  }
});

/* ═══════════════════════════════════════════════════════════
   5. Smooth scroll for anchor links
═══════════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#' || targetId === '#login-placeholder') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    const offset = navbar.offsetHeight + 8;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ═══════════════════════════════════════════════════════════
   6. Back-to-top button
═══════════════════════════════════════════════════════════ */
function toggleBackToTop() {
  backToTop.classList.toggle('visible', window.scrollY > 500);
}

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ═══════════════════════════════════════════════════════════
   7. Scroll-reveal (IntersectionObserver)
═══════════════════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger siblings inside the same grid
        const delay = getStaggerDelay(entry.target);
        entry.target.style.transitionDelay = `${delay}ms`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

function getStaggerDelay(el) {
  const parent   = el.parentElement;
  const siblings = [...parent.querySelectorAll('.reveal')];
  const index    = siblings.indexOf(el);
  return Math.min(index * 80, 400); // max 400 ms stagger
}

revealEls.forEach((el) => revealObserver.observe(el));

/* ═══════════════════════════════════════════════════════════
   8. Animated stat counters
═══════════════════════════════════════════════════════════ */
let countersStarted = false;

function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800; // ms
  const startTime = performance.now();

  function step(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    if (entries.some((e) => e.isIntersecting) && !countersStarted) {
      countersStarted = true;
      statNumbers.forEach(animateCounter);
    }
  },
  { threshold: 0.3 }
);

const heroStats = document.querySelector('.hero__stats');
if (heroStats) statsObserver.observe(heroStats);

/* ═══════════════════════════════════════════════════════════
   9. Floating particles in the hero
═══════════════════════════════════════════════════════════ */
function createParticles() {
  if (!particlesWrap) return;
  const count  = 22;
  const colors = ['rgba(212,175,55,0.5)', 'rgba(124,58,237,0.5)', 'rgba(255,255,255,0.3)'];

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');

    const size     = Math.random() * 4 + 1;
    const left     = Math.random() * 100;
    const delay    = Math.random() * 15;
    const duration = Math.random() * 15 + 10;
    const color    = colors[Math.floor(Math.random() * colors.length)];

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: -10px;
      background: ${color};
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
    `;
    particlesWrap.appendChild(p);
  }
}

createParticles();

/* ═══════════════════════════════════════════════════════════
   10. Testimonial slider
═══════════════════════════════════════════════════════════ */
(function initSlider() {
  if (!track) return;

  const cards       = track.querySelectorAll('.testimonial-card');
  const total       = cards.length;
  let   current     = 0;
  let   autoplay;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.setAttribute('role', 'listitem');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    cards[current].setAttribute('aria-hidden', 'true');
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;

    document.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
    cards[current].removeAttribute('aria-hidden');
  }

  prevBtn.addEventListener('click', () => {
    goTo(current - 1);
    resetAutoplay();
  });

  nextBtn.addEventListener('click', () => {
    goTo(current + 1);
    resetAutoplay();
  });

  // Keyboard navigation
  [prevBtn, nextBtn].forEach((btn) => {
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') btn.click();
    });
  });

  // Touch / swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goTo(current + 1) : goTo(current - 1);
      resetAutoplay();
    }
  }, { passive: true });

  // Autoplay
  function startAutoplay() {
    autoplay = setInterval(() => goTo(current + 1), 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplay);
    startAutoplay();
  }

  // Pause on hover / focus
  const sliderWrap = track.closest('.testimonials__track-wrap');
  if (sliderWrap) {
    sliderWrap.addEventListener('mouseenter', () => clearInterval(autoplay));
    sliderWrap.addEventListener('mouseleave', startAutoplay);
    sliderWrap.addEventListener('focusin',    () => clearInterval(autoplay));
    sliderWrap.addEventListener('focusout',   startAutoplay);
  }

  // Initialise aria-hidden on non-visible cards
  cards.forEach((card, i) => {
    if (i !== 0) card.setAttribute('aria-hidden', 'true');
  });

  startAutoplay();
})();

/* ═══════════════════════════════════════════════════════════
   11. Contact form validation & submission
═══════════════════════════════════════════════════════════ */
const validators = {
  firstName: (val) => {
    if (!val.trim())         return 'First name is required.';
    if (val.trim().length < 2) return 'Must be at least 2 characters.';
    return '';
  },
  lastName: (val) => {
    if (!val.trim())         return 'Last name is required.';
    if (val.trim().length < 2) return 'Must be at least 2 characters.';
    return '';
  },
  email: (val) => {
    if (!val.trim())         return 'Email address is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Enter a valid email address.';
    return '';
  },
  phone: (val) => {
    if (val && !/^[\d\s+\-().]{7,20}$/.test(val)) return 'Enter a valid phone number.';
    return '';
  },
  course: (val) => {
    if (!val) return 'Please select a course.';
    return '';
  },
  message: (val) => {
    if (!val.trim())          return 'Message is required.';
    if (val.trim().length < 10) return 'Message must be at least 10 characters.';
    return '';
  },
};

function showError(field, message) {
  const group = field.closest('.form-group');
  const errorEl = group.querySelector('.form-error');
  field.classList.add('is-invalid');
  field.classList.remove('is-valid');
  if (errorEl) errorEl.textContent = message;
}

function showValid(field) {
  const group = field.closest('.form-group');
  const errorEl = group.querySelector('.form-error');
  field.classList.remove('is-invalid');
  field.classList.add('is-valid');
  if (errorEl) errorEl.textContent = '';
}

function clearState(field) {
  field.classList.remove('is-invalid', 'is-valid');
  const group   = field.closest('.form-group');
  const errorEl = group && group.querySelector('.form-error');
  if (errorEl) errorEl.textContent = '';
}

// Live validation on blur
if (contactForm) {
  contactForm.querySelectorAll('input, select, textarea').forEach((field) => {
    field.addEventListener('blur', () => {
      const name   = field.name;
      const rule   = validators[name];
      if (!rule) return;
      const error  = rule(field.value);
      error ? showError(field, error) : showValid(field);
    });

    field.addEventListener('input', () => {
      if (field.classList.contains('is-invalid')) {
        const name  = field.name;
        const rule  = validators[name];
        if (!rule) return;
        const error = rule(field.value);
        error ? showError(field, error) : showValid(field);
      }
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    contactForm.querySelectorAll('input, select, textarea').forEach((field) => {
      const rule  = validators[field.name];
      if (!rule) return;
      const error = rule(field.value);
      if (error) {
        showError(field, error);
        isValid = false;
      } else {
        showValid(field);
      }
    });

    if (!isValid) {
      // Scroll to first error
      const firstInvalid = contactForm.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid.focus();
      }
      return;
    }

    // Simulate async submission
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;
      formSuccess.hidden = false;
      contactForm.reset();
      contactForm.querySelectorAll('input, select, textarea').forEach(clearState);
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1800);
  });
}

/* ═══════════════════════════════════════════════════════════
   12. Newsletter form
═══════════════════════════════════════════════════════════ */
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const val        = emailInput.value.trim();

    if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      emailInput.style.borderColor = '#ef4444';
      emailInput.focus();
      return;
    }

    emailInput.style.borderColor = '';
    newsletterSuccess.hidden = false;
    newsletterForm.reset();

    // Hide the success message after 5 s
    setTimeout(() => {
      newsletterSuccess.hidden = true;
    }, 5000);
  });
}

/* ═══════════════════════════════════════════════════════════
   13. Login button placeholder (future use)
═══════════════════════════════════════════════════════════ */
// Login button now links directly to pages/login.html — no JS needed.

/* ═══════════════════════════════════════════════════════════
   14. Waveform bars — randomise heights for variety
═══════════════════════════════════════════════════════════ */
(function animateWaveformInit() {
  const bars = document.querySelectorAll('.waveform span');
  bars.forEach((bar) => {
    const minH = 10 + Math.random() * 20;
    const maxH = 40 + Math.random() * 30;
    bar.style.setProperty('--min-h', `${minH}px`);
    bar.style.setProperty('--max-h', `${maxH}px`);
  });
})();
