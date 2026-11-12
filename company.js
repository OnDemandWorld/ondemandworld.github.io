/* ─────────────────────────────────────────────────────────────
   ODW.AI · Company pages — progressive enhancement only.
   Every page is fully readable and navigable without JS.
   Adds: reading-progress bar, TOC scroll-spy, scroll reveals.
   ───────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Reading progress + TOC scroll-spy (long documents) ── */
  function initDoc() {
    var toc = document.querySelector('.doc-toc');
    var sections = Array.prototype.slice.call(
      document.querySelectorAll('.doc-section[id]'));
    if (!toc || !sections.length) return;

    var links = {};
    Array.prototype.forEach.call(toc.querySelectorAll('a[href^="#"]'), function (a) {
      links[a.getAttribute('href').slice(1)] = a;
    });

    var bar = document.createElement('div');
    bar.className = 'reading-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    var ticking = false;
    function update() {
      ticking = false;
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = Math.min(100, Math.max(0, pct)) + '%';

      /* current section = last one whose top is above the 35% line */
      var line = window.innerHeight * 0.35;
      var current = null;
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].getBoundingClientRect().top <= line) current = sections[i].id;
      }
      for (var id in links) {
        if (links.hasOwnProperty(id)) {
          if (id === current) links[id].setAttribute('aria-current', 'true');
          else links[id].removeAttribute('aria-current');
        }
      }
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ── Staggered scroll reveals ── */
  function initReveal() {
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    var targets = Array.prototype.slice.call(document.querySelectorAll(
      '.doc-section, .doc-toc, .contact-card, .product-card, ' +
      '.timeline-item, .repo-card, .hours-panel, .post-hero, .notfound-grid'
    ));
    if (!targets.length) return;

    document.documentElement.classList.add('js-reveal');
    targets.forEach(function (el) { el.classList.add('reveal-target'); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.04 });
    targets.forEach(function (el) { io.observe(el); });
  }

  function init() { initDoc(); initReveal(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();