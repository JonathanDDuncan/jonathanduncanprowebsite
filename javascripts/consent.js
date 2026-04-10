/**
 * Cookie-consent banner logic.
 * Shows the banner on first visit; stores the user's choice in localStorage.
 * Traps focus within the dialog while visible.
 */
document$.subscribe(() => {
  "use strict";

  var STORAGE_KEY = "cookie-consent";
  var banner = document.querySelector(".cookie-consent");
  if (!banner) return;

  /* Already answered — hide and bail */
  var stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    banner.classList.remove("visible");
    return;
  }

  /* Show banner after a short delay so the page paints first */
  requestAnimationFrame(function () {
    banner.classList.add("visible");
    /* Focus the accept button so keyboard users land inside the dialog */
    var acceptBtn = banner.querySelector(".cookie-consent__btn--accept");
    if (acceptBtn) acceptBtn.focus();
  });

  var acceptBtn = banner.querySelector(".cookie-consent__btn--accept");
  var declineBtn = banner.querySelector(".cookie-consent__btn--decline");
  var focusableEls = banner.querySelectorAll("a[href], button");
  var firstFocusable = focusableEls[0];
  var lastFocusable = focusableEls[focusableEls.length - 1];

  function dismiss(choice) {
    localStorage.setItem(STORAGE_KEY, choice);
    banner.classList.remove("visible");
  }

  if (acceptBtn) {
    acceptBtn.addEventListener("click", function () { dismiss("accepted"); });
  }
  if (declineBtn) {
    declineBtn.addEventListener("click", function () { dismiss("declined"); });
  }

  /* Trap focus within the banner while visible */
  banner.addEventListener("keydown", function (e) {
    if (e.key !== "Tab") return;
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  });
});
