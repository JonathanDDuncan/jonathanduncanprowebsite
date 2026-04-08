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

  /* Reset all targets so they can animate fresh on page swap */
  targets.forEach(function (el) {
    el.classList.remove("revealed");
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
 * Handles carousel initialization, navigation, and auto-play on page load.
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
    var AUTO_PLAY_DELAY = 7000; // 7 seconds

    // Clear existing indicators
    indicatorsContainer.innerHTML = "";

    // Create indicators
    slides.forEach(function (_, index) {
      var indicator = document.createElement("div");
      indicator.className = "carousel-indicator";
      if (index === 0) indicator.classList.add("active");
      indicator.addEventListener("click", function () {
        goToSlide(index);
        resetAutoPlay();
      });
      indicatorsContainer.appendChild(indicator);
    });

    function goToSlide(n) {
      var indicators = indicatorsContainer.querySelectorAll(".carousel-indicator");

      // Remove active class from all slides and indicators
      slides.forEach(function (slide) {
        slide.classList.remove("active");
      });
      indicators.forEach(function (indicator) {
        indicator.classList.remove("active");
      });

      // Add active class to current slide and indicator
      slides[n].classList.add("active");
      indicators[n].classList.add("active");

      currentSlide = n;
    }

    function nextSlide() {
      goToSlide((currentSlide + 1) % slides.length);
    }

    function prevSlide() {
      goToSlide((currentSlide - 1 + slides.length) % slides.length);
    }

    function startAutoPlay() {
      autoPlayInterval = setInterval(nextSlide, AUTO_PLAY_DELAY);
    }

    function resetAutoPlay() {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    }

    // Event listeners
    prevBtn.addEventListener("click", function () {
      prevSlide();
      resetAutoPlay();
    });

    nextBtn.addEventListener("click", function () {
      nextSlide();
      resetAutoPlay();
    });

    // Pause auto-play on mouse enter, resume on mouse leave
    carousel.addEventListener("mouseenter", function () {
      clearInterval(autoPlayInterval);
    });

    carousel.addEventListener("mouseleave", function () {
      startAutoPlay();
    });

    // Touch support for swipe navigation
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

    // Initialize
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
