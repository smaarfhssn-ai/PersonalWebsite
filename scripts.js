
document.addEventListener('DOMContentLoaded', function () {

  'use strict';

  /* =========================================
     ELEMENTS
  ========================================= */

  const loader = document.getElementById('siteLoader');
  const loaderBar = document.getElementById('loaderBar');
  const loaderPercent = document.getElementById('loaderPercent');

  const nav = document.getElementById('nav');
  const menuButton = document.getElementById('menuButton');
  const mobileNav = document.getElementById('mobileNav');
  const progress = document.getElementById('scrollProgress');

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  );

  const desktopPointer = window.matchMedia(
    '(hover: hover) and (pointer: fine)'
  );

  const mobileBreakpoint = window.matchMedia(
    '(max-width: 650px)'
  );

  /* =========================================
     LOADER
  ========================================= */

  document.body.classList.add('loading');

  let loadingProgress = 0;
  let loaderFinished = false;
  let loaderTimeout = null;

  const loadingTimer = window.setInterval(function () {

    if (loaderFinished) return;

    loadingProgress += Math.floor(Math.random() * 12) + 4;
    loadingProgress = Math.min(loadingProgress, 95);

    if (loaderBar) {
      loaderBar.style.width = loadingProgress + '%';
    }

    if (loaderPercent) {
      loaderPercent.textContent = loadingProgress + '%';
    }

  }, 100);

  function finishLoader() {

    if (loaderFinished) return;

    loaderFinished = true;

    window.clearInterval(loadingTimer);

    if (loaderTimeout !== null) {
      window.clearTimeout(loaderTimeout);
    }

    if (loaderBar) {
      loaderBar.style.width = '100%';
    }

    if (loaderPercent) {
      loaderPercent.textContent = '100%';
    }

    window.setTimeout(function () {

      if (loader) {
        loader.classList.add('finished');
        loader.setAttribute('aria-hidden', 'true');
      }

      document.body.classList.remove('loading');

    }, reducedMotion.matches ? 0 : 350);

  }

  if (document.readyState === 'complete') {
    finishLoader();
  } else {
    window.addEventListener('load', finishLoader, {
      once: true
    });
  }

  // Safety fallback: never leave the page locked.
  loaderTimeout = window.setTimeout(
    finishLoader,
    3500
  );

  /* =========================================
     NAVIGATION + SCROLL PROGRESS
  ========================================= */

  let previousScroll = Math.max(window.scrollY, 0);
  let scrollTicking = false;

  function isMenuOpen() {
    return Boolean(
      mobileNav &&
      mobileNav.classList.contains('open')
    );
  }

  function updateScroll() {

    const current = Math.max(
      window.scrollY || window.pageYOffset || 0,
      0
    );

    if (nav) {

      nav.classList.toggle(
        'scrolled',
        current > 20
      );

      const scrollingDown = current > previousScroll + 2;

      if (
        scrollingDown &&
        current > 350 &&
        !isMenuOpen()
      ) {
        nav.classList.add('nav-hidden');
      } else if (
        current < previousScroll - 2 ||
        current <= 350 ||
        isMenuOpen()
      ) {
        nav.classList.remove('nav-hidden');
      }

    }

    previousScroll = current;

    const maxScroll = Math.max(
      document.documentElement.scrollHeight -
      window.innerHeight,
      0
    );

    const percentage = maxScroll > 0
      ? Math.min(100, current / maxScroll * 100)
      : 0;

    if (progress) {
      progress.style.width = percentage + '%';
    }

  }

  /* =========================================
     MOBILE MENU
  ========================================= */

  function setMenuOpen(open) {

    if (!menuButton || !mobileNav) return;

    mobileNav.classList.toggle('open', open);

    menuButton.setAttribute(
      'aria-expanded',
      String(open)
    );

    menuButton.setAttribute(
      'aria-label',
      open ? 'Close menu' : 'Open menu'
    );

    if (nav) {
      nav.classList.remove('nav-hidden');
    }

  }

  if (menuButton && mobileNav) {

    menuButton.setAttribute(
      'aria-controls',
      'mobileNav'
    );

    menuButton.addEventListener('click', function () {
      setMenuOpen(!isMenuOpen());
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {

      link.addEventListener('click', function () {
        setMenuOpen(false);
      });

    });

    document.addEventListener('keydown', function (event) {

      if (event.key === 'Escape' && isMenuOpen()) {
        setMenuOpen(false);
        menuButton.focus();
      }

    });

    document.addEventListener('click', function (event) {

      if (!isMenuOpen()) return;

      if (nav && !nav.contains(event.target)) {
        setMenuOpen(false);
      }

    });

    window.addEventListener('resize', function () {

      if (!mobileBreakpoint.matches && isMenuOpen()) {
        setMenuOpen(false);
      }

    });

  }

  /* =========================================
     REVEAL ANIMATIONS
  ========================================= */

  const revealElements = document.querySelectorAll('.reveal');

  if (
    reducedMotion.matches ||
    !('IntersectionObserver' in window)
  ) {

    revealElements.forEach(function (element) {
      element.classList.add('visible');
    });

  } else {

    const revealObserver = new IntersectionObserver(
      function (entries, observer) {

        entries.forEach(function (entry) {

          if (!entry.isIntersecting) return;

          entry.target.classList.add('visible');
          observer.unobserve(entry.target);

        });

      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(function (element) {
      revealObserver.observe(element);
    });

  }

  /* =========================================
     ACTIVE NAVIGATION
  ========================================= */

  const sections = document.querySelectorAll('section[id]');

  const navigationLinks = document.querySelectorAll(
    '.desktop-nav a, .mobile-nav a'
  );

  function setActiveSection(id) {

    navigationLinks.forEach(function (link) {

      const active = link.getAttribute('href') === '#' + id;

      link.classList.toggle('active', active);

      if (active) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }

    });

  }

  if ('IntersectionObserver' in window) {

    const sectionObserver = new IntersectionObserver(
      function (entries) {

        const visibleEntries = entries.filter(function (entry) {
          return entry.isIntersecting;
        });

        if (visibleEntries.length === 0) return;

        visibleEntries.sort(function (a, b) {
          return b.intersectionRatio - a.intersectionRatio;
        });

        setActiveSection(visibleEntries[0].target.id);

      },
      {
        rootMargin: '-35% 0px -55% 0px',
        threshold: 0
      }
    );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });

  }

  /* =========================================
     SMOOTH ANCHOR LINKS
  ========================================= */

  document.querySelectorAll('a[href^="#"]').forEach(
    function (link) {

      link.addEventListener('click', function (event) {

        const id = link.getAttribute('href');

        if (!id || id === '#') return;

        const target = document.getElementById(
          id.substring(1)
        );

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
          behavior: reducedMotion.matches ? 'auto' : 'smooth',
          block: 'start'
        });

        if (isMenuOpen()) {
          setMenuOpen(false);
        }

        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, '', id);
        }

      });

    }
  );

  /* =========================================
     DESKTOP CARD TILT
  ========================================= */

  const skillCards = document.querySelectorAll('.skill-card');

  function resetCardTransforms() {

    skillCards.forEach(function (card) {
      card.style.transform = '';
    });

  }

  skillCards.forEach(function (card) {

    card.addEventListener('mousemove', function (event) {

      if (
        !desktopPointer.matches ||
        reducedMotion.matches
      ) return;

      const rect = card.getBoundingClientRect();

      const x = (
        (event.clientX - rect.left) / rect.width
      ) - 0.5;

      const y = (
        (event.clientY - rect.top) / rect.height
      ) - 0.5;

      card.style.transform =
        'perspective(1000px) ' +
        'rotateX(' + (y * -3) + 'deg) ' +
        'rotateY(' + (x * 3) + 'deg) ' +
        'translateY(-6px)';

    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });

  });

  /* =========================================
     MAGNETIC EXPLORE BUTTON
  ========================================= */

  const explore = document.querySelector('.explore');

  if (explore) {

    explore.addEventListener('mousemove', function (event) {

      if (
        !desktopPointer.matches ||
        reducedMotion.matches
      ) return;

      const rect = explore.getBoundingClientRect();

      const x = event.clientX -
        rect.left -
        rect.width / 2;

      const y = event.clientY -
        rect.top -
        rect.height / 2;

      explore.style.transform =
        'translate(' +
        (x * 0.12) + 'px,' +
        (y * 0.18) + 'px)';

    });

    explore.addEventListener('mouseleave', function () {
      explore.style.transform = '';
    });

  }

  /* =========================================
     RETRACE PHONE PARALLAX
  ========================================= */

  const phoneStage = document.querySelector('.phone-stage');
  const phones = document.querySelectorAll('.phone');

  let phoneTicking = false;

  function resetPhoneTransforms() {

    phones.forEach(function (phone) {
      phone.style.transform = '';
    });

  }

  function updatePhones() {

    phoneTicking = false;

    if (!phoneStage || phones.length === 0) return;

    if (
      mobileBreakpoint.matches ||
      reducedMotion.matches
    ) {
      resetPhoneTransforms();
      return;
    }

    const rect = phoneStage.getBoundingClientRect();

    const viewportCenter = window.innerHeight / 2;

    const stageCenter = rect.top + rect.height / 2;

    const difference = stageCenter - viewportCenter;

    phones.forEach(function (phone) {

      const speed = Number(
        phone.dataset.phoneSpeed || -0.3
      );

      let movement = difference * speed * 0.13;

      movement = Math.max(
        -45,
        Math.min(45, movement)
      );

      if (phone.classList.contains('phone-main')) {

        phone.style.transform =
          'translateX(-50%) translateY(' +
          movement + 'px)';

      } else if (phone.classList.contains('phone-left')) {

        phone.style.transform =
          'rotate(-7deg) translateY(' +
          movement + 'px)';

      } else {

        phone.style.transform =
          'rotate(7deg) translateY(' +
          movement + 'px)';

      }

    });

  }

  function requestPhoneUpdate() {

    if (phoneTicking) return;

    phoneTicking = true;

    window.requestAnimationFrame(updatePhones);

  }

  /* =========================================
     IMAGE FALLBACK
  ========================================= */

  function handleImageError(img) {

    const fallback = img.dataset.fallback;
    const alreadyUsed = img.dataset.fallbackUsed === 'true';

    if (fallback && !alreadyUsed) {

      img.dataset.fallbackUsed = 'true';
      img.src = fallback;
      return;

    }

    console.error('Image failed to load:', img.src);

  }

  document.querySelectorAll('img').forEach(function (img) {

    img.addEventListener('error', function () {
      handleImageError(img);
    });

    // Catch images that failed before this listener was added.
    if (img.complete && img.naturalWidth === 0) {
      handleImageError(img);
    }

  });

  /* =========================================
     MAIN SCROLL EVENT
  ========================================= */

  function onScroll() {

    if (scrollTicking) return;

    scrollTicking = true;

    window.requestAnimationFrame(function () {

      updateScroll();
      requestPhoneUpdate();

      scrollTicking = false;

    });

  }

  window.addEventListener('scroll', onScroll, {
    passive: true
  });

  window.addEventListener('resize', function () {

    updateScroll();
    requestPhoneUpdate();

  });

  reducedMotion.addEventListener?.('change', function () {

    if (reducedMotion.matches) {
      resetCardTransforms();

      if (explore) {
        explore.style.transform = '';
      }
    }

    requestPhoneUpdate();

  });

  /* =========================================
     INITIALISE
  ========================================= */

  updateScroll();
  requestPhoneUpdate();

});

// ==================================================
// CREATIVE WORKS — HORIZONTAL SHOWCASE
// ==================================================

(() => {
  const track = document.getElementById("creativeTrack");
  const prev = document.getElementById("creativePrev");
  const next = document.getElementById("creativeNext");
  const current = document.getElementById("creativeCurrent");
  const total = document.getElementById("creativeTotal");
  const progress = document.getElementById("creativeProgress");

  const lightbox = document.getElementById("creativeLightbox");
  const lightboxImage = document.getElementById("creativeLightboxImage");
  const lightboxTitle = document.getElementById("creativeLightboxTitle");
  const closeButton = document.getElementById("creativeLightboxClose");

  if (!track) return;

  const slides = [...track.querySelectorAll(".creative-slide")];
  const count = slides.length;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let activeIndex = 0;
  let lastFocusedElement = null;
  let scrollFrame = null;

  const formatNumber = number =>
    String(number).padStart(2, "0");

  total.textContent = formatNumber(count);

  function getActiveIndex() {
    const trackCenter =
      track.getBoundingClientRect().left +
      track.clientWidth / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    slides.forEach((slide, index) => {
      const rect = slide.getBoundingClientRect();
      const slideCenter = rect.left + rect.width / 2;
      const distance = Math.abs(slideCenter - trackCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  }

  function updateControls() {
    activeIndex = getActiveIndex();

    current.textContent = formatNumber(activeIndex + 1);

    progress.style.width =
      `${((activeIndex + 1) / count) * 100}%`;

    prev.disabled = activeIndex === 0;
    next.disabled = activeIndex === count - 1;
  }

  function goToSlide(index) {
    const target = Math.max(
      0,
      Math.min(index, count - 1)
    );

    slides[target].scrollIntoView({
      behavior: reducedMotion.matches ? "instant" : "smooth",
      block: "nearest",
      inline: "center"
    });
  }

  prev.addEventListener("click", () => {
    goToSlide(getActiveIndex() - 1);
  });

  next.addEventListener("click", () => {
    goToSlide(getActiveIndex() + 1);
  });

  track.addEventListener("scroll", () => {
    if (scrollFrame !== null) {
      cancelAnimationFrame(scrollFrame);
    }

    scrollFrame = requestAnimationFrame(() => {
      updateControls();
      scrollFrame = null;
    });
  }, { passive: true });

  window.addEventListener("resize", updateControls);

  // LIGHTBOX

  function openLightbox(button) {
    lastFocusedElement = document.activeElement;

    lightboxImage.src = button.dataset.creativeImage;
    lightboxImage.alt = button.dataset.creativeTitle || "Design preview";
    lightboxTitle.textContent =
      button.dataset.creativeTitle || "";

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");

    document.body.classList.add("creative-lightbox-open");

    closeButton.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");

    document.body.classList.remove("creative-lightbox-open");

    lightboxImage.removeAttribute("src");

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  track.querySelectorAll(".creative-image-button")
    .forEach(button => {
      button.addEventListener("click", () => {
        openLightbox(button);
      });
    });

  closeButton.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", event => {
    if (!lightbox.classList.contains("open")) return;

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "Tab") {
      event.preventDefault();
      closeButton.focus();
    }
  });

  updateControls();
})();
