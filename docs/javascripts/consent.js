/**
 * Cookie-consent banner logic.
 * Shows the banner on first visit; stores the user's choice in localStorage.
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
  });

  var acceptBtn = banner.querySelector(".cookie-consent__btn--accept");
  var declineBtn = banner.querySelector(".cookie-consent__btn--decline");

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
});
