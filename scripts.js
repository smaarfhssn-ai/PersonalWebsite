
/* ==========================================================
   ISMA ARIF — PERSONAL PORTFOLIO
   DARK SLEEK EDITORIAL — VERSION 1

   Full JavaScript
   Vanilla JS / GitHub Pages Compatible

   Features:
   01. Initialization
   02. Mobile Navigation
   03. Smooth Scrolling
   04. Active Navigation
   05. Scroll Progress
   06. Scroll Reveal
   07. Hero Entrance
   08. Image Handling
   09. Interactive Details
   10. Accessibility
   ========================================================== */

"use strict";

(() => {

  /* ========================================================
     01 — CONFIGURATION
     ======================================================== */

  const CONFIG = {
    navigationOffset: 100,
    scrollThrottle: 16,
    revealThreshold: 0.12,
    revealRootMargin: "0px 0px -45px 0px",
    heroDelay: 120,
    mobileBreakpoint: 900
  };

  const SELECTORS = {
    body: "body",
    header: ".topbar",
    desktopNav: ".desktop-nav",
    mobileNav: ".mobile-nav",
    menuButton: ".menu-button",
    progress: ".progress",
    reveal: ".reveal",
    hero: ".hero",
    heroName: ".hero-name",
    heroVisual: ".hero-visual",
    sections: "section[id]",
    ticker: ".ticker-track"
  };

  const state = {
    menuOpen: false,
    scrolling: false,
    initialized: false,
    reducedMotion: false,
    revealObserver: null,
    sectionObserver: null,
    lastFocusedElement: null
  };

  /* ========================================================
     02 — UTILITIES
     ======================================================== */

  const $ = (selector, parent = document) => {
    return parent.querySelector(selector);
  };

  const $$ = (selector, parent = document) => {
    return Array.from(
      parent.querySelectorAll(selector)
    );
  };

  const clamp = (value, min, max) => {
    return Math.min(
      Math.max(value, min),
      max
    );
  };

  const prefersReducedMotion = () => {
    return window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  };

  const isMobile = () => {
    return window.innerWidth <=
      CONFIG.mobileBreakpoint;
  };

  const getHeaderOffset = () => {
    const header = $(SELECTORS.header);

    if (!header) {
      return CONFIG.navigationOffset;
    }

    return Math.max(
      header.getBoundingClientRect().height + 35,
      CONFIG.navigationOffset
    );
  };

  const requestTick = callback => {
    window.requestAnimationFrame(callback);
  };

  /* ========================================================
     03 — INITIALIZATION
     ======================================================== */

  function initialize() {

    if (state.initialized) {
      return;
    }

    state.initialized = true;

    state.reducedMotion =
      prefersReducedMotion();

    document.documentElement.classList.add(
      "js-enabled"
    );

    initializeNavigation();

    initializeSmoothScroll();

    initializeActiveNavigation();

    initializeScrollProgress();

    initializeRevealAnimations();

    initializeHeroEntrance();

    initializeImages();

    initializeInteractiveDetails();

    initializeAccessibility();

    updateScrollProgress();

    updateActiveNavigation();

    window.addEventListener(
      "load",
      () => {
        updateScrollProgress();
        updateActiveNavigation();
      },
      { once: true }
    );

  }

  /* ========================================================
     04 — MOBILE NAVIGATION
     ======================================================== */

  function initializeNavigation() {

    const menuButton = $(
      SELECTORS.menuButton
    );

    const mobileNav = $(
      SELECTORS.mobileNav
    );

    if (!menuButton || !mobileNav) {
      return;
    }

    if (!mobileNav.id) {
      mobileNav.id = "mobile-navigation";
    }

    menuButton.setAttribute(
      "aria-controls",
      mobileNav.id
    );

    menuButton.setAttribute(
      "aria-expanded",
      "false"
    );

    menuButton.setAttribute(
      "aria-label",
      "Open navigation menu"
    );

    mobileNav.setAttribute(
      "aria-hidden",
      "true"
    );

    if ("inert" in mobileNav) {
      mobileNav.inert = true;
    }

    function openMenu() {

      if (state.menuOpen) {
        return;
      }

      state.menuOpen = true;

      state.lastFocusedElement =
        document.activeElement;

      document.body.classList.add(
        "menu-open"
      );

      mobileNav.classList.add(
        "open"
      );

      menuButton.setAttribute(
        "aria-expanded",
        "true"
      );

      menuButton.setAttribute(
        "aria-label",
        "Close navigation menu"
      );

      mobileNav.setAttribute(
        "aria-hidden",
        "false"
      );

      if ("inert" in mobileNav) {
        mobileNav.inert = false;
      }

      const firstLink = $(
        "a",
        mobileNav
      );

      if (firstLink) {
        firstLink.focus({
          preventScroll: true
        });
      }

    }

    function closeMenu(
      restoreFocus = true
    ) {

      if (!state.menuOpen) {
        return;
      }

      state.menuOpen = false;

      document.body.classList.remove(
        "menu-open"
      );

      mobileNav.classList.remove(
        "open"
      );

      menuButton.setAttribute(
        "aria-expanded",
        "false"
      );

      menuButton.setAttribute(
        "aria-label",
        "Open navigation menu"
      );

      if (
        restoreFocus &&
        state.lastFocusedElement &&
        typeof state.lastFocusedElement.focus ===
          "function"
      ) {

        state.lastFocusedElement.focus({
          preventScroll: true
        });

      }

      mobileNav.setAttribute(
        "aria-hidden",
        "true"
      );

      if ("inert" in mobileNav) {
        mobileNav.inert = true;
      }

    }

    menuButton.addEventListener(
      "click",
      () => {

        if (state.menuOpen) {
          closeMenu();
        } else {
          openMenu();
        }

      }
    );

    $$("a", mobileNav).forEach(
      link => {

        link.addEventListener(
          "click",
          () => {
            closeMenu(false);
          }
        );

      }
    );

    document.addEventListener(
      "keydown",
      event => {

        if (!state.menuOpen) {
          return;
        }

        if (event.key === "Escape") {

          event.preventDefault();

          closeMenu();

          return;
        }

        if (event.key !== "Tab") {
          return;
        }

        const focusable = [
          menuButton,
          ...$$(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
            mobileNav
          )
        ].filter(
          element =>
            element.getClientRects().length > 0
        );

        if (!focusable.length) {
          return;
        }

        const first = focusable[0];

        const last = focusable[
          focusable.length - 1
        ];

        if (
          event.shiftKey &&
          document.activeElement === first
        ) {

          event.preventDefault();

          last.focus();

        } else if (
          !event.shiftKey &&
          document.activeElement === last
        ) {

          event.preventDefault();

          first.focus();

        }

      }
    );

    document.addEventListener(
      "click",
      event => {

        if (!state.menuOpen) {
          return;
        }

        if (
          !mobileNav.contains(event.target) &&
          !menuButton.contains(event.target)
        ) {

          closeMenu(false);

        }

      }
    );

    window.addEventListener(
      "resize",
      () => {

        if (!isMobile()) {
          closeMenu(false);
        }

      },
      { passive: true }
    );

  }

  /* ========================================================
     05 — SMOOTH SCROLLING
     ======================================================== */

  function initializeSmoothScroll() {

    const anchorLinks = $$(
      'a[href^="#"]'
    );

    anchorLinks.forEach(link => {

      link.addEventListener(
        "click",
        event => {

          const href = link.getAttribute(
            "href"
          );

          if (
            !href ||
            href === "#"
          ) {
            return;
          }

          const targetId =
            decodeURIComponent(
              href.substring(1)
            );

          const target =
            document.getElementById(
              targetId
            );

          if (!target) {
            return;
          }

          event.preventDefault();

          scrollToElement(target);

          if (
            window.location.hash !== href
          ) {

            history.pushState(
              null,
              "",
              href
            );

          }

        }
      );

    });

    window.addEventListener(
      "hashchange",
      () => {

        const id =
          decodeURIComponent(
            window.location.hash.slice(1)
          );

        if (!id) {
          return;
        }

        const target =
          document.getElementById(id);

        if (target) {
          scrollToElement(target);
        }

      }
    );

    if (window.location.hash) {

      window.addEventListener(
        "load",
        () => {

          const id =
            decodeURIComponent(
              window.location.hash.slice(1)
            );

          const target =
            document.getElementById(id);

          if (target) {

            requestTick(() => {
              scrollToElement(target);
            });

          }

        },
        { once: true }
      );

    }

  }

  function scrollToElement(element) {

    const offset =
      getHeaderOffset();

    const position =
      element.getBoundingClientRect().top +
      window.scrollY -
      offset;

    window.scrollTo({
      top: Math.max(0, position),
      behavior: state.reducedMotion
        ? "auto"
        : "smooth"
    });

  }

  /* ========================================================
     06 — ACTIVE NAVIGATION
     ======================================================== */

  function initializeActiveNavigation() {

    const sections = $$(
      SELECTORS.sections
    );

    if (!sections.length) {
      return;
    }

    let scheduled = false;

    const onScroll = () => {

      if (scheduled) {
        return;
      }

      scheduled = true;

      requestTick(() => {

        updateActiveNavigation();

        scheduled = false;

      });

    };

    window.addEventListener(
      "scroll",
      onScroll,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      onScroll,
      { passive: true }
    );

  }

  function updateActiveNavigation() {

    const sections = $$(
      SELECTORS.sections
    );

    if (!sections.length) {
      return;
    }

    const referencePosition =
      window.scrollY +
      getHeaderOffset() +
      100;

    let activeSection = null;

    sections.forEach(section => {

      if (
        section.offsetTop <=
        referencePosition
      ) {

        activeSection = section;

      }

    });

    if (!activeSection) {
      activeSection = sections[0];
    }

    const activeId =
      activeSection.id;

    const navLinks = $$(
      '.desktop-nav a[href^="#"], .mobile-nav a[href^="#"]'
    );

    navLinks.forEach(link => {

      const href =
        link.getAttribute("href");

      const isActive =
        href === `#${activeId}`;

      link.classList.toggle(
        "active",
        isActive
      );

      if (isActive) {

        link.setAttribute(
          "aria-current",
          "location"
        );

      } else {

        link.removeAttribute(
          "aria-current"
        );

      }

    });

  }

  /* ========================================================
     07 — SCROLL PROGRESS INDICATOR
     ======================================================== */

  function initializeScrollProgress() {

    const progress = $(
      SELECTORS.progress
    );

    if (!progress) {
      return;
    }

    let ticking = false;

    const onScroll = () => {

      if (ticking) {
        return;
      }

      ticking = true;

      requestTick(() => {

        updateScrollProgress();

        ticking = false;

      });

    };

    window.addEventListener(
      "scroll",
      onScroll,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      onScroll,
      { passive: true }
    );

  }

  function updateScrollProgress() {

    const progress = $(
      SELECTORS.progress
    );

    if (!progress) {
      return;
    }

    const scrollableHeight =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const scrollPercentage =
      scrollableHeight > 0
        ? (window.scrollY /
           scrollableHeight) * 100
        : 100;

    progress.style.width =
      `${clamp(
        scrollPercentage,
        0,
        100
      )}%`;

  }

  /* ========================================================
     08 — SCROLL REVEAL ANIMATIONS
     ======================================================== */

  function initializeRevealAnimations() {

    const elements = $$(
      SELECTORS.reveal
    );

    if (!elements.length) {
      return;
    }

    if (
      state.reducedMotion ||
      !("IntersectionObserver" in window)
    ) {

      elements.forEach(element => {
        element.classList.add(
          "visible"
        );
      });

      return;
    }

    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (!entry.isIntersecting) {
              return;
            }

            const element =
              entry.target;

            element.classList.add(
              "visible"
            );

            observer.unobserve(
              element
            );

          });

        },
        {
          threshold:
            CONFIG.revealThreshold,

          rootMargin:
            CONFIG.revealRootMargin
        }
      );

    state.revealObserver =
      observer;

    elements.forEach(element => {

      const rect =
        element.getBoundingClientRect();

      const isInitiallyVisible =
        rect.top < window.innerHeight &&
        rect.bottom > 0;

      if (isInitiallyVisible) {

        element.classList.add(
          "visible"
        );

      } else {

        observer.observe(
          element
        );

      }

    });

    // Enable animation styles after observers
    // have been initialized to prevent blank
    // content on unsupported browsers.

    document.body.classList.add(
      "js-ready"
    );

  }

  /* ========================================================
     09 — HERO ENTRANCE
     ======================================================== */

  function initializeHeroEntrance() {

    const hero = $(
      SELECTORS.hero
    );

    if (!hero) {
      return;
    }

    const heroElements = $$(
      ".reveal",
      hero
    );

    if (!heroElements.length) {
      return;
    }

    heroElements.forEach(element => {

      element.classList.add(
        "visible"
      );

    });

    if (state.reducedMotion) {
      return;
    }

    hero.classList.add(
      "hero-loaded"
    );

  }

  /* ========================================================
     10 — IMAGE HANDLING
     ======================================================== */

  function initializeImages() {

    const images = $$("img");

    images.forEach(image => {

      image.decoding = "async";

      const isHeroImage =
        Boolean(
          image.closest(".hero")
        );

      if (isHeroImage) {

        image.loading = "eager";

        image.setAttribute(
          "fetchpriority",
          "high"
        );

      } else {

        if (
          !image.hasAttribute(
            "loading"
          )
        ) {

          image.loading = "lazy";

        }

      }

      function handleLoadedImage() {

        image.classList.add(
          "image-loaded"
        );

      }

      function handleImageError() {

        image.classList.add(
          "image-error"
        );

        // Do not replace or alter the
        // original image URL.

      }

      if (
        image.complete &&
        image.naturalWidth > 0
      ) {

        handleLoadedImage();

      } else if (
        image.complete &&
        image.naturalWidth === 0
      ) {

        handleImageError();

      } else {

        image.addEventListener(
          "load",
          handleLoadedImage,
          { once: true }
        );

        image.addEventListener(
          "error",
          handleImageError,
          { once: true }
        );

      }

    });

  }

  /* ========================================================
     11 — INTERACTIVE DETAILS
     ======================================================== */

  function initializeInteractiveDetails() {

    initializePointerEffects();

    initializeTicker();

    initializeExternalLinks();

  }

  /* --------------------------------------------------------
     POINTER EFFECTS
     -------------------------------------------------------- */

  function initializePointerEffects() {

    if (state.reducedMotion) {
      return;
    }

    const finePointer =
      window.matchMedia(
        "(hover: hover) and (pointer: fine)"
      );

    if (!finePointer.matches) {
      return;
    }

    const cards = $$(
      ".skill-card, .tool-card, .uni-card, .achievement"
    );

    cards.forEach(card => {

      let frame = null;

      card.addEventListener(
        "pointermove",
        event => {

          if (frame !== null) {
            return;
          }

          const x = event.clientX;
          const y = event.clientY;

          frame = requestAnimationFrame(
            () => {

              const rect =
                card.getBoundingClientRect();

              const localX =
                x - rect.left;

              const localY =
                y - rect.top;

              const percentX =
                (localX / rect.width) *
                100;

              const percentY =
                (localY / rect.height) *
                100;

              card.style.setProperty(
                "--mouse-x",
                `${percentX}%`
              );

              card.style.setProperty(
                "--mouse-y",
                `${percentY}%`
              );

              frame = null;

            }
          );

        },
        { passive: true }
      );

      card.addEventListener(
        "pointerleave",
        () => {

          if (frame !== null) {

            cancelAnimationFrame(
              frame
            );

            frame = null;

          }

          card.style.removeProperty(
            "--mouse-x"
          );

          card.style.removeProperty(
            "--mouse-y"
          );

        }
      );

    });

  }

  /* --------------------------------------------------------
     TICKER
     -------------------------------------------------------- */

  function initializeTicker() {

    const ticker = $(
      SELECTORS.ticker
    );

    if (!ticker) {
      return;
    }

    ticker.setAttribute(
      "aria-label",
      ticker.textContent
        .replace(/\s+/g, " ")
        .trim()
    );

    if (state.reducedMotion) {

      ticker.style.animation = "none";

    }

  }

  /* --------------------------------------------------------
     EXTERNAL LINKS
     -------------------------------------------------------- */

  function initializeExternalLinks() {

    const externalLinks = $$(
      'a[target="_blank"]'
    );

    externalLinks.forEach(link => {

      const existingRel =
        link.getAttribute("rel") || "";

      const values = new Set(
        existingRel
          .split(/\s+/)
          .filter(Boolean)
      );

      values.add("noopener");
      values.add("noreferrer");

      link.setAttribute(
        "rel",
        [...values].join(" ")
      );

    });

  }

  /* ========================================================
     12 — ACCESSIBILITY
     ======================================================== */

  function initializeAccessibility() {

    initializeMotionPreference();

    initializeKeyboardSupport();

    initializeFocusHandling();

  }

  /* --------------------------------------------------------
     REDUCED MOTION
     -------------------------------------------------------- */

  function initializeMotionPreference() {

    const mediaQuery =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

    const handleChange = event => {

      state.reducedMotion =
        event.matches;

      if (event.matches) {

        $$(SELECTORS.reveal).forEach(
          element => {

            element.classList.add(
              "visible"
            );

          }
        );

        const ticker = $(
          SELECTORS.ticker
        );

        if (ticker) {

          ticker.style.animation =
            "none";

        }

      } else {

        const ticker = $(
          SELECTORS.ticker
        );

        if (ticker) {

          ticker.style.removeProperty(
            "animation"
          );

        }

      }

    };

    if (
      typeof mediaQuery.addEventListener ===
      "function"
    ) {

      mediaQuery.addEventListener(
        "change",
        handleChange
      );

    } else if (
      typeof mediaQuery.addListener ===
      "function"
    ) {

      mediaQuery.addListener(
        handleChange
      );

    }

  }

  /* --------------------------------------------------------
     KEYBOARD SUPPORT
     -------------------------------------------------------- */

  function initializeKeyboardSupport() {

    document.addEventListener(
      "keydown",
      event => {

        // Home key: jump to beginning
        // when not editing a text field.

        const active =
          document.activeElement;

        const isEditing =
          active &&
          (
            active.tagName === "INPUT" ||
            active.tagName === "TEXTAREA" ||
            active.tagName === "SELECT" ||
            active.isContentEditable
          );

        if (isEditing) {
          return;
        }

        if (
          event.key === "Home" &&
          !event.ctrlKey &&
          !event.metaKey &&
          !event.altKey &&
          !event.shiftKey &&
          !state.menuOpen
        ) {

          event.preventDefault();

          window.scrollTo({
            top: 0,
            behavior: state.reducedMotion
              ? "auto"
              : "smooth"
          });

        }

      }
    );

  }

  /* --------------------------------------------------------
     FOCUS HANDLING
     -------------------------------------------------------- */

  function initializeFocusHandling() {

    let keyboardMode = false;

    document.addEventListener(
      "keydown",
      event => {

        if (event.key === "Tab") {

          keyboardMode = true;

          document.body.classList.add(
            "keyboard-navigation"
          );

        }

      }
    );

    document.addEventListener(
      "pointerdown",
      () => {

        if (!keyboardMode) {
          return;
        }

        keyboardMode = false;

        document.body.classList.remove(
          "keyboard-navigation"
        );

      },
      { passive: true }
    );

  }

  /* ========================================================
     13 — PAGE VISIBILITY
     ======================================================== */

  function initializePageVisibility() {

    document.addEventListener(
      "visibilitychange",
      () => {

        if (!document.hidden) {

          updateScrollProgress();

          updateActiveNavigation();

        }

      }
    );

    window.addEventListener(
      "pageshow",
      () => {

        updateScrollProgress();

        updateActiveNavigation();

      }
    );

  }

  /* ========================================================
     14 — INITIALIZE EVERYTHING
     ======================================================== */

  function boot() {

    initialize();

    initializePageVisibility();

  }

  if (
    document.readyState === "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      boot,
      { once: true }
    );

  } else {

    boot();

  }

})();
