// Scroll reveals. Inlined into <head> by app/layout.tsx, so it runs before first paint.
//
// Progressive enhancement: the hidden "before" states in globals.css only apply under
// html[data-motion], which is set here. No JavaScript, no IntersectionObserver or
// prefers-reduced-motion: reduce means the attribute is never set and the page is static.
//
// Elements opt in with data-reveal="fade | mask | image | head | section | stagger".
// When one enters the viewport it gets data-in, and CSS transitions it to its final state.
(function () {
  var root = document.documentElement;
  if (!("IntersectionObserver" in window) || !window.matchMedia) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  root.setAttribute("data-motion", "");

  var ready = false;
  // If setup has not finished in time, drop motion and show everything as-is.
  setTimeout(function () {
    if (!ready) root.removeAttribute("data-motion");
  }, 3000);

  try {
    var pending = new Set();

    var show = function (el) {
      if (!pending.has(el)) return;
      pending.delete(el);
      io.unobserve(el);
      el.setAttribute("data-in", "");
      // Once the reveal has played, clear delays so hover responds immediately.
      setTimeout(function () {
        el.setAttribute("data-in", "done");
      }, 1600);
    };

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          // Reveal on entry, and reveal anything already scrolled past (e.g. after a #anchor jump).
          if (e.isIntersecting || e.boundingClientRect.bottom < 0) show(e.target);
        });
      },
      { rootMargin: "0px" }
    );

    var add = function (node) {
      if (node.nodeType !== 1) return;
      var els = [].slice.call(node.querySelectorAll("[data-reveal]"));
      if (node.matches("[data-reveal]")) els.unshift(node);
      els.forEach(function (el) {
        if (el.hasAttribute("data-in") || pending.has(el)) return;
        [].forEach.call(el.querySelectorAll("[data-stagger]"), index);
        if (el.hasAttribute("data-stagger")) index(el);
        pending.add(el);
        io.observe(el);
      });
    };

    var index = function (list) {
      [].forEach.call(list.children, function (child, i) {
        child.style.setProperty("--i", i);
      });
    };

    // Safety net for load, anchor jumps and fast scrolling: reveal anything whose top is
    // above the bottom of the viewport, so nothing on or above the screen stays hidden.
    var sweep = function () {
      var h = window.innerHeight;
      pending.forEach(function (el) {
        if (el.getBoundingClientRect().top < h) show(el);
      });
    };
    var ticking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          ticking = false;
          sweep();
        });
      },
      { passive: true }
    );

    var start = function () {
      try {
        add(document.body);
        sweep();
        // Pages swapped in by client-side navigation bring new [data-reveal] elements.
        new MutationObserver(function (records) {
          records.forEach(function (r) {
            r.addedNodes.forEach(add);
          });
        }).observe(document.body, { childList: true, subtree: true });
        ready = true;
      } catch (err) {
        root.removeAttribute("data-motion");
      }
    };

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
    else start();
  } catch (err) {
    root.removeAttribute("data-motion");
  }
})();
