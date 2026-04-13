/**
 * Scroll-reveal with staggered entry for cards.
 * Re-initialises on Material instant-navigation page swaps.
 */
document$.subscribe(() => {
  "use strict";

  /* ── Scroll progress indicator ────────────────────────────── */
  var bar = document.querySelector(".scroll-progress");
  if (!bar) {
    bar = document.createElement("div");
    bar.className = "scroll-progress";
    document.body.appendChild(bar);
  }
  bar.style.width = "0%";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReduced) {
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var scrollTop = window.scrollY || document.documentElement.scrollTop;
          var docHeight = document.documentElement.scrollHeight - window.innerHeight;
          var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
          bar.style.width = pct + "%";
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── Scroll-reveal with stagger ───────────────────────────── */

  var STAGGER_MS = 80;

  document.body.classList.add("js-reveal-ready");

  var targets = document.querySelectorAll(".reveal-target");
  if (!targets.length) return;

  /* On instant-nav re-runs, elements already in the viewport should
     NOT flash invisible then animate back in. Only reset elements
     that are below the fold; above-fold ones stay visible.          */
  var viewH = window.innerHeight || document.documentElement.clientHeight;
  targets.forEach(function (el) {
    var rect = el.getBoundingClientRect();
    if (rect.top < viewH && rect.bottom > 0) {
      /* Already visible — keep it shown, no animation replay */
      el.classList.add("revealed");
    } else {
      el.classList.remove("revealed");
    }
    /* Clear stagger items from previous run */
    el.querySelectorAll(".stagger-item").forEach(function (card) {
      card.classList.remove("stagger-item");
      card.style.animationDelay = "";
    });
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var el = entry.target;
        observer.unobserve(el);

        /* If the element contains grid cards, stagger their children */
        var cards = el.querySelectorAll(
          ".grid.cards > ul > li, .grid.cards > ol > li"
        );

        if (cards.length) {
          cards.forEach(function (card, i) {
            card.style.animationDelay = i * STAGGER_MS + "ms";
            card.classList.add("stagger-item");
          });
        }

        el.classList.add("revealed");
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach(function (el) {
    observer.observe(el);
  });

  /* Safety fallback — show everything after 4s if observer stalls */
  setTimeout(function () {
    targets.forEach(function (el) {
      el.classList.add("revealed");
    });
  }, 4000);
});
 

/**
 * Mobile sticky CTA
 * Shows after the hero section scrolls out of view; hides when the bottom
 * CTA panel is visible so it doesn't overlap the main call-to-action.
 */
document$.subscribe(() => {
  "use strict";

  var ctaBar = document.getElementById("mobile-sticky-cta");
  if (!ctaBar) return;

  /* Only meaningful on small screens — skip expensive observer on desktop */
  if (window.innerWidth > 768) return;

  var heroSection = document.querySelector(".text-intro-grid, .hero-section, .hero-wrapper");
  var bottomCta   = document.querySelector(".cta-panel");

  var heroVisible   = true;
  var bottomVisible = false;

  function updateBar() {
    if (!heroVisible && !bottomVisible) {
      ctaBar.classList.add("visible");
    } else {
      ctaBar.classList.remove("visible");
    }
  }

  if (heroSection) {
    new IntersectionObserver(function (entries) {
      heroVisible = entries[0].isIntersecting;
      updateBar();
    }, { threshold: 0.1 }).observe(heroSection);
  } else {
    /* If no hero (inner pages), show bar immediately after fold */
    heroVisible = false;
    updateBar();
  }

  if (bottomCta) {
    new IntersectionObserver(function (entries) {
      bottomVisible = entries[0].isIntersecting;
      updateBar();
    }, { threshold: 0.2 }).observe(bottomCta);
  }
});

/**
 * Floating CTA button — desktop/tablet only.
 * Hidden when hero is visible (user hasn't scrolled) or when the
 * bottom CTA panel / footer is visible (user is already at a CTA).
 */
document$.subscribe(() => {
  "use strict";

  var floatingCta = document.getElementById("floating-cta");
  if (!floatingCta) return;

  /* Only meaningful on larger screens */
  if (window.innerWidth <= 768) return;

  var heroSection = document.querySelector(".text-intro-grid, .hero-section, .hero-wrapper");
  var bottomCta   = document.querySelector(".cta-panel");
  var footer      = document.querySelector(".site-footer");

  var heroVisible   = true;
  var bottomVisible = false;
  var footerVisible = false;

  function updateFloating() {
    if (!heroVisible && !bottomVisible && !footerVisible) {
      floatingCta.classList.remove("hidden");
    } else {
      floatingCta.classList.add("hidden");
    }
  }

  /* Start hidden */
  floatingCta.classList.add("hidden");

  if (heroSection) {
    new IntersectionObserver(function (entries) {
      heroVisible = entries[0].isIntersecting;
      updateFloating();
    }, { threshold: 0.1 }).observe(heroSection);
  } else {
    heroVisible = false;
    updateFloating();
  }

  if (bottomCta) {
    new IntersectionObserver(function (entries) {
      bottomVisible = entries[0].isIntersecting;
      updateFloating();
    }, { threshold: 0.15 }).observe(bottomCta);
  }

  if (footer) {
    new IntersectionObserver(function (entries) {
      footerVisible = entries[0].isIntersecting;
      updateFloating();
    }, { threshold: 0.1 }).observe(footer);
  }
});
 