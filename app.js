/* ─────────────────────────────────────────────────────────────
   ODW.AI · v2 responsive prototype — behavior
   Progressive enhancement only. Site works without JS.
   ───────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ── Mobile navigation ─────────────────────────────────── */
  function initNav() {
    const toggle   = $('.nav-toggle');
    const nav      = $('.mobile-nav');
    const backdrop = $('.nav-backdrop');
    if (!toggle || !nav) return;

    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('open', open);
      backdrop && backdrop.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };

    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      setOpen(open);
    });

    backdrop && backdrop.addEventListener('click', () => setOpen(false));

    // Close nav on link click (mobile)
    $$('.mobile-nav a').forEach(link => {
      link.addEventListener('click', () => setOpen(false));
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ── Scroll spy (highlights current section in sidebar/mobile nav) ── */
  function initScrollSpy() {
    const sections = $$('main section[id]');
    const allLinks = $$('.sidebar-nav a, .mobile-nav a');
    if (!sections.length || !allLinks.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          allLinks.forEach(link => {
            const match = link.getAttribute('href') === '#' + id;
            if (match) link.setAttribute('aria-current', 'true');
            else       link.removeAttribute('aria-current');
          });
        }
      });
    }, {
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0
    });

    sections.forEach(s => observer.observe(s));
  }

  /* ── Copy-to-clipboard button ──────────────────────────── */
  function initCopyButtons() {
    $$('.copy-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const text = btn.dataset.copy || '';
        try {
          await navigator.clipboard.writeText(text);
          const labelEl = btn.querySelector('.copy-label');
          const iconEl  = btn.querySelector('.copy-icon');
          const originalLabel = labelEl ? labelEl.textContent : '';
          const originalIcon  = iconEl  ? iconEl.textContent  : '';
          if (labelEl) labelEl.textContent = 'Copied';
          if (iconEl)  iconEl.textContent  = '✓';
          btn.classList.add('copied');
          // Optional: haptic feedback on Android
          if (navigator.vibrate) navigator.vibrate(10);
          setTimeout(() => {
            if (labelEl) labelEl.textContent = originalLabel;
            if (iconEl)  iconEl.textContent  = originalIcon;
            btn.classList.remove('copied');
          }, 1800);
        } catch (err) {
          console.warn('Clipboard failed:', err);
        }
      });
    });
  }

  /* ── Sticky CTA bar: hide on scroll-down, show on scroll-up ── */
  function initStickyCta() {
    const bar = $('.sticky-cta');
    if (!bar) return;

    let lastY = window.scrollY;
    let ticking = false;

    // Hide when near footer (contact section already has its own CTAs)
    const contact = $('#contact');

    const update = () => {
      const y = window.scrollY;
      const goingDown = y > lastY && y > 200;

      // Hide when contact section is in view
      let inContact = false;
      if (contact) {
        const rect = contact.getBoundingClientRect();
        inContact = rect.top < window.innerHeight * 0.7;
      }

      bar.classList.toggle('hidden', goingDown || inContact);
      lastY = y;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── Reveal on scroll (subtle fade-in for cards) ────────── */
  function initReveal() {
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets = $$('.pillar, .module-card, .principle, .vertical-card, .service-card, .stack-layer, .feature-item');
    targets.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(12px)';
      el.style.transition = 'opacity 500ms cubic-bezier(0.4,0,0.2,1), transform 500ms cubic-bezier(0.4,0,0.2,1)';
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

    targets.forEach(el => io.observe(el));
  }

  /* ── Init ───────────────────────────────────────────────── */
  function init() {
    initNav();
    initScrollSpy();
    initCopyButtons();
    initStickyCta();
    initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
