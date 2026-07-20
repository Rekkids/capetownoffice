/* Cape Town Office -- shared site behaviour (item #43 in the project tracker)
   Scoped to scripts only: cookie consent + GA4 loading, mobile nav toggle,
   and book_viewing_click tracking. Nav/footer HTML stays inline per page. */
(function () {
  'use strict';

  var GA4_ID = 'G-GWQYWP8Z4C';
  var CONSENT_KEY = 'cto_cookie_consent';

  /* ---------------- GA4 loader (consent-gated) ---------------- */

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }

  window.ctoLoadAnalytics = function () {
    if (window.ctoAnalyticsLoaded) return;
    window.ctoAnalyticsLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA4_ID);
  };

  /* ---------------- Cookie consent ---------------- */

  function getConsentChoice() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
  }

  window.ctoCookieChoice = function (choice) {
    try { localStorage.setItem(CONSENT_KEY, choice); } catch (e) {}
    var bar = document.getElementById('cto-cookie-bar');
    if (bar) bar.classList.remove('visible');
    if (choice === 'accepted') window.ctoLoadAnalytics();
  };

  function initConsent() {
    var bar = document.getElementById('cto-cookie-bar');
    var existing = getConsentChoice();
    if (existing === 'accepted') {
      window.ctoLoadAnalytics();
    } else if (!existing && bar) {
      bar.classList.add('visible');
    }
    /* existing === 'declined' (or bar missing): do nothing, stay hidden */
  }

  /* ---------------- Mobile nav toggle ---------------- */

  function getHamburger() { return document.querySelector('.hamburger'); }
  function getMobileMenu() { return document.getElementById('mobile-menu'); }

  window.toggleMenu = function () {
    var menu = getMobileMenu();
    if (!menu) return;
    var isOpen = menu.classList.toggle('open');
    var btn = getHamburger();
    if (btn) btn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  };

  window.closeMenu = function () {
    var menu = getMobileMenu();
    if (menu) menu.classList.remove('open');
    var btn = getHamburger();
    if (btn) btn.setAttribute('aria-label', 'Open menu');
  };

  /* ---------------- GA4 book_viewing_click tracking (item #44) ---------------- */

  function initBookingClickTracking() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest ? e.target.closest('a[href^="/book-a-viewing"]') : null;
      if (!link) return;
      var inNav = !!(link.closest('nav') || link.closest('#mobile-menu'));
      gtag('event', 'book_viewing_click', {
        link_location: inNav ? 'nav' : 'page_body'
      });
    });
  }

  /* ---------------- Init ---------------- */

  function init() {
    initConsent();
    initBookingClickTracking();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
