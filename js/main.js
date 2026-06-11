// Dark mode toggle
(function () {
  var btn = document.querySelector('.theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', function () {
    var current = document.documentElement.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
})();

// Reading progress bar (article pages only — skip homepage snap layout)
(function () {
  var bar = document.querySelector('.reading-progress');
  if (!bar || document.querySelector('.landing-page')) return;
  function update() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
})();


// Mobile nav toggle
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    var expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
  });

  // Close menu when a nav link is clicked
  nav.addEventListener('click', function (e) {
    if (e.target.classList.contains('nav-link')) {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
    }
  });
})();

(function () {
  // TOC scroll tracking
  var tocLinks = document.querySelectorAll('.toc a');
  if (!tocLinks.length) return;

  var headings = document.querySelectorAll(
    '.post-content h1[id], .post-content h2[id], .post-content h3[id], .post-content h4[id]'
  );
  if (!headings.length) return;

  function setActive(id) {
    tocLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + id) {
        link.classList.add('active');
      }
    });
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActive(entry.target.getAttribute('id'));
        }
      });
    },
    {
      rootMargin: '-80px 0px -75% 0px',
    }
  );

  headings.forEach(function (heading) {
    observer.observe(heading);
  });
})();

// Homepage scroll-snap section highlighting
(function () {
  var page = document.querySelector('.landing-page');
  if (!page) return;
  var sections = Array.from(page.querySelectorAll('.landing-section'));
  if (sections.length < 2) return;

  var intersecting = new Set();
  function updateActive() {
    var active = null, best = Infinity;
    intersecting.forEach(function (s) {
      var d = Math.abs(s.getBoundingClientRect().top);
      if (d < best) { best = d; active = s; }
    });
    if (!active) active = sections[0];
    sections.forEach(function (s) {
      s.classList.toggle('snap-inactive', s !== active);
    });
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      e.isIntersecting ? intersecting.add(e.target) : intersecting.delete(e.target);
    });
    updateActive();
  }, { root: page, threshold: 0.4 });

  sections.forEach(function (s) { observer.observe(s); });
})();
