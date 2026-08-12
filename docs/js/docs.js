/* WindStrap docs — small helpers: copy-to-clipboard + TOC scrollspy.
   This is docs-site tooling, separate from the WindStrap translation. */
(function () {
  'use strict';

  // Copy-to-clipboard buttons. The button must carry data-target for the
  // selector of the <code> to copy (defaults to the next sibling <pre> code).
  document.querySelectorAll('.btn-clipboard').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = btn.getAttribute('data-target');
      var codeEl = target
        ? document.querySelector(target)
        : btn.closest('.bd-example-snippet, .highlight').querySelector('code');
      if (!codeEl) return;
      var text = codeEl.innerText;
      var done = function () {
        var original = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(function () { btn.textContent = original; }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) { /* noop */ }
        document.body.removeChild(ta);
        done();
      }
    });
  });

  // Scrollspy for the "On this page" TOC.
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll('.bd-toc nav a[href^="#"]'));
  if (tocLinks.length) {
    var sections = tocLinks
      .map(function (a) { return document.querySelector(a.getAttribute('href')); })
      .filter(Boolean);
    var linksByTarget = {};
    tocLinks.forEach(function (a) { linksByTarget[a.getAttribute('href')] = a; });

    var active = null;
    var setActive = function (id) {
      tocLinks.forEach(function (a) { a.classList.remove('active'); });
      active = id;
      if (active && linksByTarget['#' + active]) {
        linksByTarget['#' + active].classList.add('active');
      }
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-80px 0px -70% 0px' });
    sections.forEach(function (s) { observer.observe(s); });
  }

  // Activate Bootstrap plugins for live demos (popovers, tooltips, toasts).
  if (window.bootstrap) {
    document.querySelectorAll('[data-bs-toggle="popover"]').forEach(function (el) {
      new bootstrap.Popover(el);
    });
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function (el) {
      new bootstrap.Tooltip(el);
    });
  }
})();
