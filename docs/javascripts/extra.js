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
 * Testimonials Carousel
 * Handles carousel initialization, navigation, auto-play, ARIA roles,
 * and keyboard navigation.
 */
document$.subscribe(() => {
  "use strict";

  var carousels = document.querySelectorAll(".testimonials-carousel-container");
  if (!carousels.length) return;

  carousels.forEach(function (container) {
    var carousel = container.querySelector(".testimonials-carousel");
    var slides = carousel.querySelectorAll(".carousel-slide");
    var prevBtn = container.querySelector(".carousel-button-prev");
    var nextBtn = container.querySelector(".carousel-button-next");
    var indicatorsContainer = container.querySelector(".carousel-indicators");

    var currentSlide = 0;
    var autoPlayInterval = null;
    var autoPlayPaused = false;
    var AUTO_PLAY_DELAY = 7000;

    /* ARIA: set up carousel region */
    carousel.setAttribute("role", "region");
    carousel.setAttribute("aria-roledescription", "carousel");
    carousel.setAttribute("aria-label", "Client testimonials");

    /* ARIA: label navigation buttons */
    prevBtn.setAttribute("aria-label", "Previous testimonial");
    nextBtn.setAttribute("aria-label", "Next testimonial");

    /* ARIA: set up slides */
    slides.forEach(function (slide, i) {
      slide.setAttribute("role", "group");
      slide.setAttribute("aria-roledescription", "slide");
      slide.setAttribute("aria-label", "Testimonial " + (i + 1) + " of " + slides.length);
    });

    /* ARIA: set up indicator tabs */
    indicatorsContainer.innerHTML = "";
    indicatorsContainer.setAttribute("role", "tablist");
    indicatorsContainer.setAttribute("aria-label", "Testimonial slides");

    slides.forEach(function (_, index) {
      var indicator = document.createElement("button");
      indicator.className = "carousel-indicator";
      indicator.setAttribute("role", "tab");
      indicator.setAttribute("aria-label", "Show testimonial " + (index + 1));
      indicator.setAttribute("aria-selected", index === 0 ? "true" : "false");
      indicator.setAttribute("tabindex", index === 0 ? "0" : "-1");
      if (index === 0) indicator.classList.add("active");
      indicator.addEventListener("click", function () {
        goToSlide(index);
        resetAutoPlay();
      });
      indicatorsContainer.appendChild(indicator);
    });

    function goToSlide(n) {
      var indicators = indicatorsContainer.querySelectorAll(".carousel-indicator");

      slides.forEach(function (slide) { slide.classList.remove("active"); });
      indicators.forEach(function (ind) {
        ind.classList.remove("active");
        ind.setAttribute("aria-selected", "false");
        ind.setAttribute("tabindex", "-1");
      });

      slides[n].classList.add("active");
      indicators[n].classList.add("active");
      indicators[n].setAttribute("aria-selected", "true");
      indicators[n].setAttribute("tabindex", "0");

      currentSlide = n;
    }

    function nextSlide() {
      goToSlide((currentSlide + 1) % slides.length);
    }

    function prevSlide() {
      goToSlide((currentSlide - 1 + slides.length) % slides.length);
    }

    function startAutoPlay() {
      if (autoPlayPaused) return;
      autoPlayInterval = setInterval(nextSlide, AUTO_PLAY_DELAY);
    }

    function resetAutoPlay() {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    }

    prevBtn.addEventListener("click", function () {
      prevSlide();
      resetAutoPlay();
    });

    nextBtn.addEventListener("click", function () {
      nextSlide();
      resetAutoPlay();
    });

    carousel.addEventListener("mouseenter", function () {
      clearInterval(autoPlayInterval);
    });

    carousel.addEventListener("mouseleave", function () {
      startAutoPlay();
    });

    /* Keyboard navigation: arrow keys on indicators */
    indicatorsContainer.addEventListener("keydown", function (e) {
      var indicators = indicatorsContainer.querySelectorAll(".carousel-indicator");
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        var next = (currentSlide + 1) % slides.length;
        goToSlide(next);
        indicators[next].focus();
        resetAutoPlay();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        var prev = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(prev);
        indicators[prev].focus();
        resetAutoPlay();
      } else if (e.key === "Home") {
        e.preventDefault();
        goToSlide(0);
        indicators[0].focus();
        resetAutoPlay();
      } else if (e.key === "End") {
        e.preventDefault();
        goToSlide(slides.length - 1);
        indicators[slides.length - 1].focus();
        resetAutoPlay();
      }
    });

    /* Touch support for swipe navigation */
    var touchStartX = 0;
    var touchEndX = 0;

    carousel.addEventListener("touchstart", function (e) {
      touchStartX = e.changedTouches[0].screenX;
      clearInterval(autoPlayInterval);
    });

    carousel.addEventListener("touchend", function (e) {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
        nextSlide();
      }
      if (touchEndX - touchStartX > 50) {
        prevSlide();
      }
      startAutoPlay();
    });

    goToSlide(0);
    startAutoPlay();
  });
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
  var cookieVisible = false;

  function updateBar() {
    if (!heroVisible && !bottomVisible && !cookieVisible) {
      ctaBar.classList.add("visible");
    } else {
      ctaBar.classList.remove("visible");
    }
  }

  /* Track cookie consent banner visibility */
  var cookieBanner = document.querySelector(".cookie-consent");
  if (cookieBanner) {
    var cookieObs = new MutationObserver(function () {
      cookieVisible = cookieBanner.classList.contains("visible");
      updateBar();
    });
    cookieObs.observe(cookieBanner, { attributes: true, attributeFilter: ["class"] });
    cookieVisible = cookieBanner.classList.contains("visible");
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

/**
 * Hero image carousel — crossfade between SVG illustrations.
 * Inlines SVGs so we can control their internal CSS animations.
 * Each SVG's entrance animation plays after the crossfade completes.
 * Cycles every 6 seconds. Pauses when off-screen.
 * Respects prefers-reduced-motion.
 */
document$.subscribe(() => {
  "use strict";

  var carousel = document.querySelector(".hero-image-carousel");
  if (!carousel) return;

  /* Prevent re-initialisation if already inlined */
  if (carousel.dataset.inlined) return;
  carousel.dataset.inlined = "1";

  var imgs = carousel.querySelectorAll(".hero-carousel-img");
  if (imgs.length < 2) return;

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  var INTERVAL_MS = 4500;
  var CROSSFADE_MS = 250; /* must match CSS transition duration */
  var current = 0;
  var timer = null;
  var svgs = [];

  /* Fetch each SVG, parse it, and inject inline so we can toggle
     the "animated" class that controls internal CSS animations. */
  var promises = Array.from(imgs).map(function (img, i) {
    return fetch(img.getAttribute("src"))
      .then(function (r) { return r.text(); })
      .then(function (text) {

        var doc = new DOMParser().parseFromString(text, "image/svg+xml");
        var svg = doc.documentElement;

        /* Transfer carousel classes */
        svg.classList.add("hero-carousel-img");
        if (img.classList.contains("active")) {
          var isFirstLoad = !sessionStorage.getItem("hero-carousel-loaded");
          if (isFirstLoad) {
            /* First load: keep hidden for 3s, then fade in */
            svg.classList.add("active");
            svg.style.transition = "none";
            svg.style.opacity = "0";
          } else {
            svg.classList.add("active");
            /* Suppress the CSS opacity transition so the swap from
               <img> → inline <svg> doesn't flicker (browser would
               otherwise animate opacity 0 → 1 on the new node). */
            svg.style.transition = "none";
            svg.style.opacity = "1";
          }
        } else {
          svg.classList.remove("animated");
        }

        /* Accessibility — decorative carousel is aria-hidden at container level,
           so mark individual SVGs as presentation */
        svg.setAttribute("role", "presentation");
        svg.setAttribute("aria-hidden", "true");

        img.replaceWith(svg);
        svgs[i] = svg;
      });
  });

  Promise.all(promises).then(function () {
    /* Refresh references after DOM replacement */
    svgs = Array.from(carousel.querySelectorAll(".hero-carousel-img"));

    /* Delay the first SVG's internal entrance animation,
       but only on the very first page load of the session. */
    var isFirstLoad = !sessionStorage.getItem("hero-carousel-loaded");
    if (isFirstLoad) {
      sessionStorage.setItem("hero-carousel-loaded", "1");
      setTimeout(function () {
        carousel.classList.add("ready");
        if (svgs[0]) {
          svgs[0].style.transition = "opacity 1s ease-in-out";
          svgs[0].style.opacity = "1";
          svgs[0].classList.add("animated");
        }
      }, 3000);
    } else {
      /* Make carousel visible immediately */
      carousel.classList.add("ready");
      /* Re-enable CSS transitions on the active SVG now that it's
         settled in the DOM (suppressed during replaceWith to prevent flicker). */
      requestAnimationFrame(function () {
        svgs.forEach(function (s) {
          s.style.transition = "";
          s.style.opacity = "";
        });
      });
      if (svgs[0]) svgs[0].classList.add("animated");
    }

    /* Start carousel only when the hero is in the viewport */
    var visObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { start(); }
      else { stop(); }
    }, { threshold: 0.1 });

    visObserver.observe(carousel);
  });

  function advance() {
    var outgoing = svgs[current];
    outgoing.classList.remove("active");

    /* Delay removing "animated" until after the fade-out completes
       so internal SVG elements stay visible during the crossfade. */
    setTimeout(function () {
      outgoing.classList.remove("animated");
    }, CROSSFADE_MS);

    current = (current + 1) % svgs.length;
    var incoming = svgs[current];
    incoming.classList.add("active");

    /* After the CSS opacity crossfade finishes, trigger the
       SVG's internal entrance animations. */
    setTimeout(function () {
      incoming.classList.add("animated");
    }, CROSSFADE_MS);
  }

  function start() {
    if (!timer) timer = setInterval(advance, INTERVAL_MS);
  }

  function stop() {
    clearInterval(timer);
    timer = null;
  }
});
