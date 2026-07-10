(function () {
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Mobile nav ── */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
      });
    });
  }

  /* ── Header scroll state ── */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── Scroll reveal ── */
  if (!prefersReduced && 'IntersectionObserver' in window) {
    var revealEls = document.querySelectorAll('.reveal, .reveal-child');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el, i) {
      if (el.classList.contains('reveal-child')) {
        el.style.setProperty('--reveal-delay', (i % 6) * 60 + 'ms');
      }
      observer.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal, .reveal-child').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ── Reading progress (post pages) ── */
  var progressBar = document.querySelector('.reading-progress-bar');
  if (progressBar && !prefersReduced) {
    var onProgress = function () {
      var main = document.getElementById('main-content');
      if (!main) return;
      var rect = main.getBoundingClientRect();
      var total = main.scrollHeight - window.innerHeight;
      var scrolled = window.scrollY - (main.offsetTop - 80);
      var pct = Math.min(100, Math.max(0, (scrolled / total) * 100));
      progressBar.style.width = pct + '%';
    };
    window.addEventListener('scroll', onProgress, { passive: true });
    onProgress();
  }

  /* ── Active nav indicator ── */
  var navLinks = document.querySelectorAll('.site-nav a[href^="/"]');
  navLinks.forEach(function (link) {
    if (link.getAttribute('aria-current') === 'page') {
      link.classList.add('is-active');
    }
  });
})();
