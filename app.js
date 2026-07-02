(function () {
  'use strict';

  const SLIDE_WIDTH = 1920;
  const SLIDE_HEIGHT = 1080;

  function scaleSlides() {
    const sections = document.querySelectorAll('.slide-section');
    sections.forEach(function (section) {
      const container = section.querySelector('.slide-container');
      if (!container) return;
      const sectionWidth = section.clientWidth;
      const scale = sectionWidth / SLIDE_WIDTH;
      container.style.transform = 'scale(' + scale + ')';
      section.style.height = Math.ceil(SLIDE_HEIGHT * scale) + 'px';
    });
  }

  function initNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
    const backdrop = document.querySelector('.nav-backdrop');

    function closeNav() {
      nav.classList.remove('open');
      navToggle.classList.remove('active');
      backdrop.classList.remove('active');
    }

    function openNav() {
      nav.classList.add('open');
      navToggle.classList.add('active');
      backdrop.classList.add('active');
    }

    if (navToggle && nav) {
      navToggle.addEventListener('click', function () {
        if (nav.classList.contains('open')) {
          closeNav();
        } else {
          openNav();
        }
      });
    }

    // Close nav when clicking backdrop
    if (backdrop) {
      backdrop.addEventListener('click', closeNav);
    }

    // Close nav on link click (mobile) — covers both section nav and lang switcher.
    var navLinks = document.querySelectorAll('.nav-links a, .nav-lang a');
    navLinks.forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
  }

  function initScrollSpy() {
    var sections = document.querySelectorAll('.slide-section[id]');
    var navLinks = document.querySelectorAll('.nav-links a');

    if (!sections.length || !navLinks.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-30% 0px -70% 0px',
      threshold: 0
    });

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  function getCurrentLang() {
    var path = window.location.pathname;
    if (path.indexOf('/zh-cn') !== -1) return 'zh-CN';
    if (path.indexOf('/zh-hk') !== -1) return 'zh-HK';
    return 'en';
  }

  function initLangSwitcher() {
    var current = getCurrentLang();
    var hash = window.location.hash || '';
    var links = document.querySelectorAll('.nav-lang a');

    links.forEach(function (link) {
      var lang = link.getAttribute('data-lang');
      // Highlight the current locale.
      if (lang === current) {
        link.classList.add('active');
      }
      // Preserve the current section anchor across language switches,
      // so clicking 简体中文 while reading #modules lands on /zh-cn/#modules.
      var baseHref = link.getAttribute('href').split('#')[0];
      link.setAttribute('href', baseHref + hash);
    });
  }

  function init() {
    scaleSlides();
    initNav();
    initScrollSpy();
    initLangSwitcher();
    window.addEventListener('resize', scaleSlides);
    // Re-apply hash preservation when the user navigates within the page.
    window.addEventListener('hashchange', initLangSwitcher);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
