/* ============================================================
   Navigation — Sidebar, hamburger, active state, progress bar
   ============================================================ */
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    // --- Hamburger ---
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (hamburger && sidebar) {
      hamburger.addEventListener('click', function() {
        sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('active');
      });
    }
    if (overlay) {
      overlay.addEventListener('click', function() {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
      });
    }

    // --- Active nav link ---
    const currentPath = window.location.pathname;
    document.querySelectorAll('.sidebar-nav a').forEach(function(a) {
      const href = a.getAttribute('href');
      if (href && currentPath.endsWith(href.replace(/^\.\.\//, '').replace(/^\.\//,''))) {
        a.classList.add('active');
      }
      // Simpler check: compare last path segments
      const linkSegs = href ? href.split('/').filter(Boolean) : [];
      const pathSegs = currentPath.split('/').filter(Boolean);
      if (linkSegs.length > 0 && pathSegs.length > 0) {
        const linkEnd = linkSegs.slice(-2).join('/');
        const pathEnd = pathSegs.slice(-2).join('/');
        if (linkEnd === pathEnd) a.classList.add('active');
      }
    });

    // --- Progress bar (scroll) ---
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = pct + '%';
      }, { passive: true });
    }

    // --- Right-side TOC active tracking ---
    const tocLinks = document.querySelectorAll('.toc-aside a');
    if (tocLinks.length > 0) {
      const headings = [];
      tocLinks.forEach(function(a) {
        const id = a.getAttribute('href');
        if (id && id.startsWith('#')) {
          const el = document.getElementById(id.slice(1));
          if (el) headings.push({ el: el, link: a });
        }
      });

      function updateToc() {
        let current = null;
        for (let i = headings.length - 1; i >= 0; i--) {
          if (headings[i].el.getBoundingClientRect().top <= 120) {
            current = headings[i];
            break;
          }
        }
        tocLinks.forEach(function(a) { a.classList.remove('active'); });
        if (current) current.link.classList.add('active');
      }

      window.addEventListener('scroll', updateToc, { passive: true });
      updateToc();
    }

    // --- Track chapter visits in localStorage ---
    const chapterMatch = currentPath.match(/chapters\/(\d{2})/);
    if (chapterMatch) {
      const visited = JSON.parse(localStorage.getItem('visited_chapters') || '[]');
      const ch = chapterMatch[1];
      if (!visited.includes(ch)) {
        visited.push(ch);
        localStorage.setItem('visited_chapters', JSON.stringify(visited));
      }
    }
  });
})();
