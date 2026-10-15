/* ==========================================================================
   SIP & CHILL CAFÉ — main.js
   Top-tier creative motion design, Lenis smooth scrolling, GSAP ScrollTrigger,
   custom cursor, parallax effects, menu search & filtering, gallery lightbox,
   and accessible fallbacks.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isDesktop = function () { return window.matchMedia('(min-width: 768px)').matches; };
  var hasGsap = typeof window.gsap !== 'undefined';
  var hasST = hasGsap && typeof window.ScrollTrigger !== 'undefined';
  var animate = hasGsap && !reduceMotion;

  var MAPS_URL = 'https://maps.app.goo.gl/Jgcs1RRxFxRZBNLQA';

  /* Chip / display labels for each category key (brief-specified names) */
  var CAT_LABELS = {
    tea: 'Tea', coffee: 'Coffee', cold: 'Cold Beverages', shakes: 'Milkshakes',
    sandwiches: 'Sandwiches', grilled: 'Grilled Sandwiches', fries: 'Fries',
    maggie: 'Maggie', chaat: 'Chaat'
  };

  /* Gallery photographs (real photos of the café) */
  var GALLERY = [
    { src: './assets/images/storefront.jpg',        w: 1048, h: 1400, cat: 'storefront', alt: 'Sip & Chill Café storefront at dusk with the glowing magenta sign', caption: 'The storefront, lit up for the evening' },
    { src: './assets/images/interior-canopy.jpg',   w: 839,  h: 1400, cat: 'ambiance',   alt: 'Café seating under a ceiling of cascading white flowers', caption: 'Seating under the blooms' },
    { src: './assets/images/cafe-counter.jpg',      w: 839,  h: 1400, cat: 'counter',    alt: 'The café counter with digital menu screens and a dessert display', caption: 'The counter & menu screens' },
    { src: './assets/images/interior-vines.jpg',    w: 840,  h: 1400, cat: 'ambiance',   alt: 'Dining tables beneath a lush vine canopy', caption: 'Lunch under the vines' },
    { src: './assets/images/interior-lounge.jpg',   w: 840,  h: 1400, cat: 'ambiance',   alt: 'Wide view of the café interior with wooden seating', caption: 'The main seating area' },
    { src: './assets/images/interior-garden.jpg',   w: 1048, h: 1400, cat: 'corners',    alt: 'Corner seating beneath hanging florals and starburst wall lamps', caption: 'A quiet corner' },
    { src: './assets/images/interior-twilight.jpg', w: 1254, h: 1254, cat: 'twilight',   alt: 'String lights and hanging blooms inside the café in the evening', caption: 'Warm lights for slow evenings' }
  ];

  /* ------------------------------------------------------------------
     Helpers
  ------------------------------------------------------------------ */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function svgUse(id) { return '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#' + id + '"></use></svg>'; }

  /* ------------------------------------------------------------------
     Lenis Smooth Scrolling (momentum scroll)
  ------------------------------------------------------------------ */
  var lenis = null;
  if (typeof window.Lenis !== 'undefined' && !reduceMotion) {
    lenis = new window.Lenis({
      duration: 1.25,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.5
    });

    if (hasST) {
      lenis.on('scroll', window.ScrollTrigger.update);
      gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  function lockScroll(lock) {
    if (lenis) {
      if (lock) lenis.stop();
      else lenis.start();
    }
    var root = document.documentElement;
    if (lock) {
      var sw = window.innerWidth - root.clientWidth;
      if (sw > 0) document.body.style.paddingRight = sw + 'px';
      root.style.overflow = 'hidden';
    } else {
      root.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  }

  /* Smooth scroll to element */
  function scrollToTarget(target) {
    if (!target) return;
    if (lenis) {
      lenis.scrollTo(target, { offset: -72, duration: 1.2 });
    } else {
      var top = target.getBoundingClientRect().top + window.pageYOffset - 72;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
  }

  /* ------------------------------------------------------------------
     Footer year
  ------------------------------------------------------------------ */
  var yearEl = $('#footer-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ------------------------------------------------------------------
     Scroll Progress Indicator
  ------------------------------------------------------------------ */
  var progressBar = $('#scroll-progress');
  function updateScrollProgress() {
    if (!progressBar) return;
    var total = document.documentElement.scrollHeight - window.innerHeight;
    if (total <= 0) {
      progressBar.style.width = '0%';
      return;
    }
    var current = window.scrollY || window.pageYOffset || 0;
    var progress = Math.min(100, Math.max(0, (current / total) * 100));
    progressBar.style.width = progress + '%';
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  /* ------------------------------------------------------------------
     Sticky Navigation State
  ------------------------------------------------------------------ */
  var nav = $('#nav');
  var navTick = false;
  function navOnScroll() {
    if (navTick) return;
    navTick = true;
    requestAnimationFrame(function () {
      if (nav) {
        nav.classList.toggle('nav--scrolled', window.scrollY > 12);
      }
      navTick = false;
    });
  }
  window.addEventListener('scroll', navOnScroll, { passive: true });
  navOnScroll();

  /* ------------------------------------------------------------------
     Custom Cursor (Desktop Fine Pointer Only)
  ------------------------------------------------------------------ */
  var cursor = $('#custom-cursor');
  if (cursor && isDesktop() && !reduceMotion) {
    var dot = $('.cursor-dot', cursor);
    var ring = $('.cursor-ring', cursor);
    var mouseX = window.innerWidth / 2;
    var mouseY = window.innerHeight / 2;
    var ringX = mouseX;
    var ringY = mouseY;
    var cursorActive = false;

    window.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!cursorActive) {
        cursorActive = true;
        cursor.style.opacity = '1';
      }
      if (dot) {
        dot.style.transform = 'translate(' + mouseX + 'px, ' + mouseY + 'px)';
      }
    }, { passive: true });

    function renderRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ring) {
        ring.style.transform = 'translate(' + ringX + 'px, ' + ringY + 'px)';
      }
      requestAnimationFrame(renderRing);
    }
    renderRing();

    /* Hover effect on interactive elements */
    var interactives = 'a, button, .menu-card, .feature-row, .gallery-item, .gallery-card, .drink-card, .why-card, .faq-btn, input';
    document.addEventListener('mouseover', function (e) {
      if (e.target && e.target.closest(interactives)) {
        document.body.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target && e.target.closest(interactives)) {
        document.body.classList.remove('cursor-hover');
      }
    });
  }

  /* ------------------------------------------------------------------
     In-Page Smooth Anchor Clicks
  ------------------------------------------------------------------ */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (href === '#' || href === '#!') return;
    var targetEl = $(href);
    if (targetEl) {
      e.preventDefault();
      if (drawer && drawer.classList.contains('is-open')) {
        setDrawer(false);
      }
      scrollToTarget(targetEl);
      if (history.pushState) {
        history.pushState(null, null, href);
      }
    }
  });

  /* ------------------------------------------------------------------
     Mobile Drawer
  ------------------------------------------------------------------ */
  var navToggle = $('#nav-toggle');
  var drawer = $('#mobile-menu');

  function setDrawer(open) {
    if (!navToggle || !drawer) return;
    navToggle.setAttribute('aria-expanded', String(open));
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
    lockScroll(open);
    if (open) {
      var first = drawer.querySelector('.drawer__link');
      if (first) first.focus({ preventScroll: true });
    } else {
      navToggle.focus({ preventScroll: true });
    }
  }

  if (navToggle && drawer) {
    navToggle.addEventListener('click', function () {
      setDrawer(navToggle.getAttribute('aria-expanded') !== 'true');
    });
    $$('.drawer a', drawer).forEach(function (a) {
      a.addEventListener('click', function () { setDrawer(false); });
    });
    drawer.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        var focusables = $$('a, button', drawer).filter(function (el) { return el.offsetParent !== null; });
        if (!focusables.length) return;
        var first = focusables[0], last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.addEventListener('resize', function () {
      if (isDesktop() && drawer.classList.contains('is-open')) setDrawer(false);
    });
  }

  /* ------------------------------------------------------------------
     Menu data joins
  ------------------------------------------------------------------ */
  var ITEMS = window.MENU_ITEMS || [];
  var CATS = window.MENU_CATEGORIES || [];
  function findItem(name) {
    for (var i = 0; i < ITEMS.length; i++) if (ITEMS[i].n === name) return ITEMS[i];
    return null;
  }

  /* ------------------------------------------------------------------
     Featured Showcase Rows (built on index.html with 3D Dish Pop)
  ------------------------------------------------------------------ */
  var featureWrap = $('#feature-rows');
  if (featureWrap && window.MENU_FEATURED) {
    var html = '';
    window.MENU_FEATURED.forEach(function (f, i) {
      var item = findItem(f.name) || {};
      var flip = i % 2 === 1 ? ' feature-row--flip' : '';
      var dir = i % 2 === 1 ? 'right' : 'left';
      var price = item.p || '';
      var unit = item.u ? '<small>' + item.u + '</small>' : '';
      var label = CAT_LABELS[f.cat] || f.cat;
      var badge = f.badge || 'House Signature';
      var dishImg = f.img || './assets/images/dish-special-tea.jpg';

      html +=
        '<article class="feature-row' + flip + '" data-slide="' + dir + '">' +
          '<div class="feature-card-3d">' +
            '<div class="feature-card-3d__dish-wrap">' +
              '<img src="' + dishImg + '" alt="' + f.name + '" class="feature-card-3d__img" loading="lazy" width="220" height="220">' +
              '<span class="feature-card-3d__badge">' + badge + '</span>' +
            '</div>' +
            '<div class="feature-card-3d__content">' +
              '<p class="feature-card-3d__cat">' + svgUse(f.icon) + label + '</p>' +
              '<h3 class="feature-card-3d__name">' + f.name + '</h3>' +
              '<p class="feature-card-3d__price">₹' + price + ' ' + unit + '</p>' +
            '</div>' +
          '</div>' +
          '<div class="feature-row__body">' +
            '<p class="feature-row__cat">' + svgUse(f.icon) + label + '</p>' +
            '<h3 class="feature-row__name">' + f.name + '</h3>' +
            '<p class="feature-row__blurb">' + f.blurb + '</p>' +
            '<div class="feature-row__meta-row">' +
              '<p class="feature-row__price">₹' + price + ' ' + unit + '</p>' +
              '<a class="btn btn--gold btn--sm" href="menu.html">View on Menu <svg class="btn__icon" viewBox="0 0 24 24" aria-hidden="true">' + svgUse('i-arrow') + '</svg></a>' +
            '</div>' +
          '</div>' +
        '</article>';
    });
    featureWrap.innerHTML = html;
  }

  /* ------------------------------------------------------------------
     Filter Chips & Full Menu List (for index.html fullmenu section)
  ------------------------------------------------------------------ */
  var filtersWrap = $('#menu-filters');
  var listWrap = $('#menu-list');
  var activeCat = 'all';

  function renderChips() {
    if (!filtersWrap) return;
    var chips = [{ key: 'all', label: 'All' }].concat(
      Object.keys(CAT_LABELS).map(function (k) { return { key: k, label: CAT_LABELS[k] }; })
    );
    filtersWrap.innerHTML = chips.map(function (c) {
      return '<button class="filter-chip" type="button" data-cat="' + c.key + '" aria-pressed="' + (c.key === activeCat) + '">' + c.label + '</button>';
    }).join('');
  }

  function itemHTML(item) {
    return '<div class="menu-item">' +
        '<div class="menu-item__row">' +
          '<span class="menu-item__name">' + item.n + '</span>' +
          '<span class="menu-item__leader" aria-hidden="true"></span>' +
          '<span class="menu-item__price">₹' + item.p + '</span>' +
        '</div>' +
        (item.u ? '<p class="menu-item__note">' + item.u + '</p>' : '') +
        (item.d ? '<p class="menu-item__desc">' + item.d + '</p>' : '') +
      '</div>';
  }

  function renderList() {
    if (!listWrap) return;
    var out = '';
    CATS.forEach(function (cat) {
      if (activeCat !== 'all' && activeCat !== cat.key) return;
      var items = ITEMS.filter(function (it) { return it.c === cat.key; });
      if (!items.length) return;
      out += '<section class="menu-group">' +
          '<h4 class="menu-group__title">' + cat.heading + '</h4>' +
          '<div class="menu-group__items">' + items.map(itemHTML).join('') + '</div>' +
        '</section>';
    });
    listWrap.innerHTML = out || '<p class="menu-item__desc">Nothing in this category yet — more items coming soon.</p>';
  }

  function animateListIn() {
    if (!animate) return;
    gsap.fromTo('.menu-item', { autoAlpha: 0, y: 14 }, {
      autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.02,
      ease: 'power2.out', overwrite: true, clearProps: 'transform,opacity,visibility'
    });
  }

  if (filtersWrap && listWrap) {
    renderChips();
    renderList();
    filtersWrap.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-chip');
      if (!btn || btn.getAttribute('aria-pressed') === 'true') return;
      activeCat = btn.getAttribute('data-cat');
      $$('.filter-chip', filtersWrap).forEach(function (chip) {
        chip.setAttribute('aria-pressed', String(chip === btn));
      });
      renderList();
      animateListIn();
      if (hasST) window.ScrollTrigger.refresh();
    });
  }

  /* ------------------------------------------------------------------
     Dedicated Menu Page (menu.html interactive grid & live search)
  ------------------------------------------------------------------ */
  var dedicatedMenuGrid = $('#dedicated-menu-grid');
  var menuSearchInput = $('#menu-search');
  var menuSearchCount = $('#menu-count');
  var dedicatedFilters = $('#dedicated-filters');
  var dedicatedActiveCat = 'all';

  function renderDedicatedMenu(shouldAnimate) {
    if (!dedicatedMenuGrid) return;
    var query = menuSearchInput ? menuSearchInput.value.trim().toLowerCase() : '';

    var filtered = ITEMS.filter(function (it) {
      var matchesCat = (dedicatedActiveCat === 'all' || it.c === dedicatedActiveCat);
      if (!matchesCat) return false;
      if (!query) return true;
      var catName = (CAT_LABELS[it.c] || '').toLowerCase();
      var nameMatch = it.n.toLowerCase().indexOf(query) !== -1;
      var descMatch = (it.d || '').toLowerCase().indexOf(query) !== -1;
      var catMatch = catName.indexOf(query) !== -1;
      return nameMatch || descMatch || catMatch;
    });

    if (menuSearchCount) {
      menuSearchCount.textContent = 'Showing ' + filtered.length + ' item' + (filtered.length === 1 ? '' : 's');
    }

    if (!filtered.length) {
      dedicatedMenuGrid.innerHTML =
        '<div style="grid-column: 1/-1; text-align: center; padding: 2.5rem 1rem;">' +
          '<p style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--plum);">No matching items found</p>' +
          '<p style="color: var(--ink-soft); margin-top: 0.5rem;">Try a different keyword or choose another category filter.</p>' +
        '</div>';
      return;
    }

    dedicatedMenuGrid.innerHTML = filtered.map(function (it) {
      var catLabel = CAT_LABELS[it.c] || it.c;
      var iconId = 'i-coffee';
      if (it.c === 'tea') iconId = 'i-tea';
      else if (it.c === 'cold') iconId = 'i-iced';
      else if (it.c === 'shakes') iconId = 'i-shake';
      else if (it.c === 'sandwiches') iconId = 'i-sandwich';
      else if (it.c === 'grilled') iconId = 'i-grill';
      else if (it.c === 'fries') iconId = 'i-fries';
      else if (it.c === 'maggie') iconId = 'i-bowl';
      else if (it.c === 'chaat') iconId = 'i-chaat';

      return '<article class="menu-card">' +
        '<div>' +
          '<p class="menu-card__cat">' + svgUse(iconId) + catLabel + '</p>' +
          '<div class="menu-card__top">' +
            '<h3 class="menu-card__title">' + it.n + '</h3>' +
            '<span class="menu-card__price">₹' + it.p + '</span>' +
          '</div>' +
          (it.u ? '<p style="font-size: 0.78rem; color: var(--gold-ink); font-weight: 600; margin-bottom: 0.4rem;">' + it.u + '</p>' : '') +
          '<p class="menu-card__desc">' + (it.d || '') + '</p>' +
        '</div>' +
        '<div class="menu-card__foot">' +
          '<span class="menu-card__badge-veg">100% Veg</span>' +
          '<span style="font-size: 0.75rem; color: var(--ink-soft);">Jain option on request</span>' +
        '</div>' +
      '</article>';
    }).join('');

    if (animate && shouldAnimate) {
      gsap.fromTo('.menu-card', { opacity: 0.4, y: 8 }, {
        opacity: 1, y: 0, duration: 0.25, stagger: 0.012,
        ease: 'power2.out', clearProps: 'all'
      });
    }
    if (hasST) window.ScrollTrigger.refresh();
  }

  if (dedicatedMenuGrid) {
    if (dedicatedFilters) {
      var dChips = [{ key: 'all', label: 'All' }].concat(
        Object.keys(CAT_LABELS).map(function (k) { return { key: k, label: CAT_LABELS[k] }; })
      );
      dedicatedFilters.innerHTML = dChips.map(function (c) {
        return '<button class="filter-chip" type="button" data-cat="' + c.key + '" aria-pressed="' + (c.key === dedicatedActiveCat) + '">' + c.label + '</button>';
      }).join('');

      dedicatedFilters.addEventListener('click', function (e) {
        var btn = e.target.closest('.filter-chip');
        if (!btn) return;
        dedicatedActiveCat = btn.getAttribute('data-cat');
        $$('.filter-chip', dedicatedFilters).forEach(function (c) {
          c.setAttribute('aria-pressed', String(c === btn));
        });
        renderDedicatedMenu(true);
      });
    }

    if (menuSearchInput) {
      menuSearchInput.addEventListener('input', function () {
        renderDedicatedMenu(false);
      });
    }

    renderDedicatedMenu(false);
  }

  /* ------------------------------------------------------------------
     Gallery Grid (for index.html and gallery.html)
  ------------------------------------------------------------------ */
  var galleryGrid = $('#gallery-grid');
  if (galleryGrid) {
    galleryGrid.innerHTML = GALLERY.map(function (g, i) {
      return '<button class="gallery-item" type="button" data-index="' + i + '" aria-label="View photo: ' + g.caption + '">' +
          '<img src="' + g.src + '" alt="' + g.alt + '" width="' + g.w + '" height="' + g.h + '" loading="lazy" decoding="async">' +
          '<span class="gallery-item__view" aria-hidden="true">' + svgUse('i-expand') + '</span>' +
        '</button>';
    }).join('');
    galleryGrid.addEventListener('click', function (e) {
      var btn = e.target.closest('.gallery-item');
      if (!btn) return;
      openLightbox(GALLERY, parseInt(btn.getAttribute('data-index'), 10));
    });
  }

  /* Dedicated Gallery Page Filter & Masonry (gallery.html) */
  var galleryMasonry = $('#gallery-masonry');
  var galleryFilterBar = $('#gallery-filter-bar');
  if (galleryMasonry) {
    var curGalleryCat = 'all';

    function renderGalleryPage() {
      var items = GALLERY.filter(function (g) {
        return curGalleryCat === 'all' || g.cat === curGalleryCat;
      });

      galleryMasonry.innerHTML = items.map(function (g, idx) {
        var globalIdx = GALLERY.indexOf(g);
        var tagLabel = g.cat.charAt(0).toUpperCase() + g.cat.slice(1);
        return '<button class="gallery-card" type="button" data-index="' + globalIdx + '" aria-label="View photo: ' + g.caption + '">' +
          '<img src="' + g.src + '" alt="' + g.alt + '" width="' + g.w + '" height="' + g.h + '" loading="lazy" decoding="async">' +
          '<div class="gallery-card__overlay">' +
            '<span class="gallery-card__tag">' + tagLabel + '</span>' +
            '<span class="gallery-card__caption">' + g.caption + '</span>' +
          '</div>' +
        '</button>';
      }).join('');

      if (animate) {
        gsap.fromTo('.gallery-card', { autoAlpha: 0, y: 20 }, {
          autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.04,
          ease: 'power2.out', clearProps: 'transform,opacity,visibility'
        });
      }
      if (hasST) window.ScrollTrigger.refresh();
    }

    if (galleryFilterBar) {
      galleryFilterBar.addEventListener('click', function (e) {
        var btn = e.target.closest('.filter-chip');
        if (!btn) return;
        curGalleryCat = btn.getAttribute('data-cat');
        $$('.filter-chip', galleryFilterBar).forEach(function (c) {
          c.setAttribute('aria-pressed', String(c === btn));
        });
        renderGalleryPage();
      });
    }

    galleryMasonry.addEventListener('click', function (e) {
      var card = e.target.closest('.gallery-card');
      if (!card) return;
      var idx = parseInt(card.getAttribute('data-index'), 10);
      openLightbox(GALLERY, idx);
    });

    renderGalleryPage();
  }

  /* ------------------------------------------------------------------
     Interactive Lightbox (Gallery + Full Menu Board)
  ------------------------------------------------------------------ */
  var lightbox = $('#lightbox');
  var lbImg = $('#lightbox-img');
  var lbCaption = $('#lightbox-caption');
  var lbClose = $('#lightbox-close');
  var lbPrev = $('#lightbox-prev');
  var lbNext = $('#lightbox-next');
  var lbItems = [];
  var lbIndex = 0;
  var lbReturnFocus = null;

  function lbRender() {
    var item = lbItems[lbIndex];
    if (!item || !lbImg) return;
    lbImg.src = item.src;
    lbImg.alt = item.alt || '';
    if (lbCaption) {
      lbCaption.textContent = item.caption || '';
      lbCaption.hidden = !item.caption;
    }
    var multi = lbItems.length > 1;
    if (lbPrev) {
      lbPrev.hidden = !multi;
      lbPrev.disabled = lbIndex === 0;
    }
    if (lbNext) {
      lbNext.hidden = !multi;
      lbNext.disabled = lbIndex === lbItems.length - 1;
    }
  }

  function openLightbox(items, index) {
    if (!lightbox) return;
    lbItems = items;
    lbIndex = index;
    lbReturnFocus = document.activeElement;
    lbRender();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    lockScroll(true);
    if (lbClose) lbClose.focus({ preventScroll: true });
    if (animate && lbImg) {
      gsap.fromTo(lbImg, { autoAlpha: 0, scale: 0.95 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'power2.out', clearProps: 'all' });
    }
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    lockScroll(false);
    if (lbReturnFocus && lbReturnFocus.focus) lbReturnFocus.focus({ preventScroll: true });
    lbReturnFocus = null;
  }

  function lbStep(delta) {
    var next = lbIndex + delta;
    if (next < 0 || next >= lbItems.length) return;
    lbIndex = next;
    lbRender();
    if (animate && lbImg) {
      gsap.fromTo(lbImg, { autoAlpha: 0, x: delta * 24 }, { autoAlpha: 1, x: 0, duration: 0.35, ease: 'power2.out', clearProps: 'all' });
    }
  }

  if (lightbox) {
    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbPrev) lbPrev.addEventListener('click', function () { lbStep(-1); });
    if (lbNext) lbNext.addEventListener('click', function () { lbStep(1); });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      var drawerOpen = drawer && drawer.classList.contains('is-open');
      if (e.key === 'Escape') {
        if (lightbox.classList.contains('is-open')) closeLightbox();
        else if (drawerOpen) setDrawer(false);
      }
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'ArrowLeft') lbStep(-1);
      if (e.key === 'ArrowRight') lbStep(1);
      if (e.key === 'Tab') {
        var focusables = [lbClose, lbPrev, lbNext].filter(function (el) { return el && !el.hidden && el.offsetParent !== null; });
        if (!focusables.length) return;
        var first = focusables[0], last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    var menuBoardButtons = $$('#view-menu-board, .btn-view-menu-board');
    menuBoardButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        openLightbox([{
          src: './assets/images/menu-board.jpg',
          alt: 'Photograph of the Sip & Chill Café menu board with all items and prices',
          caption: 'The café menu board — photographed in-store'
        }], 0);
      });
    });
  }

  /* ------------------------------------------------------------------
     FAQ Accordion (for visit.html)
  ------------------------------------------------------------------ */
  $$('.faq-card').forEach(function (card) {
    var btn = card.querySelector('.faq-btn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var isOpen = card.classList.contains('is-open');
      $$('.faq-card').forEach(function (c) {
        c.classList.remove('is-open');
        var b = c.querySelector('.faq-btn');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        card.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
      if (hasST) window.ScrollTrigger.refresh();
    });
  });

  /* ==================================================================
     GSAP & SCROLLTRIGGER ANIMATIONS
     Elevated motion design, parallax image scrubs, magnetic reveals
  ================================================================== */
  if (animate && hasST) {
    gsap.registerPlugin(window.ScrollTrigger);

    /* --- Hero entrance timeline --- */
    var heroEl = $('.hero');
    if (heroEl) {
      var tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } });

      if (isDesktop()) {
        tl.from('.hero__figure', { clipPath: 'inset(0 0 100% 0)', duration: 1.25, ease: 'power4.inOut' }, 0.05)
          .from('.hero__badge', { scale: 0.4, autoAlpha: 0, duration: 0.85, ease: 'back.out(1.8)' }, 0.75)
          .from('.hero__eyebrow', { y: 24, autoAlpha: 0, duration: 0.7 }, 0.35)
          .from('.hero__title .line__inner', { yPercent: 115, duration: 1.1, stagger: 0.15, ease: 'power4.out' }, 0.5)
          .from('.hero__copy', { y: 25, autoAlpha: 0 }, 0.95)
          .from('.hero__ctas', { y: 20, autoAlpha: 0, duration: 0.7 }, 1.05)
          .from('.hero__meta', { y: 15, autoAlpha: 0, duration: 0.6 }, 1.2)
          .from('.hero__scroll', { autoAlpha: 0, y: -8, duration: 0.6 }, 1.35);

        /* Rotating badge continuous & scroll speedup */
        gsap.to('.hero__badge-ring', {
          rotation: '+=720',
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
          }
        });

        /* Hero desktop figure parallax scrub */
        gsap.to('.hero__figure img', {
          yPercent: 16,
          scale: 1.08,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });
      } else {
        tl.from('.hero__img', { scale: 1.12, autoAlpha: 0, duration: 1.3, ease: 'power2.out' }, 0)
          .from('.hero__eyebrow', { y: 24, autoAlpha: 0, duration: 0.7 }, 0.3)
          .from('.hero__title .line__inner', { yPercent: 115, duration: 1.1, stagger: 0.14, ease: 'power4.out' }, 0.45)
          .from('.hero__copy', { y: 25, autoAlpha: 0 }, 0.9)
          .from('.hero__ctas', { y: 20, autoAlpha: 0, duration: 0.7 }, 1.0)
          .from('.hero__meta', { y: 15, autoAlpha: 0, duration: 0.6 }, 1.15)
          .from('.hero__scroll', { autoAlpha: 0, y: -8, duration: 0.6 }, 1.3);

        /* Mobile hero background parallax */
        gsap.to('.hero__img', {
          yPercent: 15,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });
      }
    }

    /* --- Subpage hero entrance --- */
    var subheroEl = $('.subhero');
    if (subheroEl) {
      var stl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.85 } });
      stl.from('.subhero__eyebrow', { y: 20, autoAlpha: 0, duration: 0.6 }, 0.1)
        .from('.subhero__title', { y: 28, autoAlpha: 0, duration: 0.8 }, 0.25)
        .from('.subhero__lede', { y: 20, autoAlpha: 0 }, 0.45)
        .from('.subhero__chip', { y: 15, autoAlpha: 0, stagger: 0.08, duration: 0.5 }, 0.6);

      gsap.to('.subhero__media img', {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: '.subhero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    /* --- Eyebrow gold rule reveal --- */
    $$('.eyebrow__rule').forEach(function (rule) {
      gsap.fromTo(rule,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: rule, start: 'top 92%', once: true }
        }
      );
    });

    /* --- Parallax on all framed photographs (.frame img) --- */
    $$('.frame').forEach(function (frame) {
      var img = frame.querySelector('img');
      if (!img) return;
      gsap.fromTo(img,
        { yPercent: -7, scale: 1.08 },
        {
          yPercent: 7, scale: 1.08, ease: 'none',
          scrollTrigger: {
            trigger: frame,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6
          }
        }
      );
    });

    /* --- Generic scroll reveals for text / containers --- */
    gsap.utils.toArray('[data-reveal]:not(.menu-card):not(.drink-card):not(.story-pillar):not(.why-card)').forEach(function (el) {
      gsap.from(el, {
        y: 28, autoAlpha: 0, duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    /* --- Alternating featured menu rows (Left / Right entrances) --- */
    gsap.utils.toArray('[data-slide]').forEach(function (row) {
      var fromLeft = row.getAttribute('data-slide') === 'left';
      var x = isDesktop() ? (fromLeft ? -70 : 70) : (fromLeft ? -25 : 25);
      gsap.from(row, {
        x: x, autoAlpha: 0, scale: 0.96, duration: 1.05, ease: 'power3.out',
        scrollTrigger: { trigger: row, start: 'top 85%', once: true }
      });
    });

    /* --- Drink cards stagger entrance --- */
    var drinksCards = $('.drinks__cards');
    if (drinksCards) {
      gsap.from('.drink-card', {
        y: 35, autoAlpha: 0, scale: 0.96, duration: 0.8, stagger: 0.08, ease: 'power3.out',
        clearProps: 'all',
        scrollTrigger: { trigger: drinksCards, start: 'top 88%', once: true }
      });
    }

    /* --- Floating decorative elements (Coffee & Beverages) --- */
    if (isDesktop()) {
      var drinksSec = $('.drinks');
      if (drinksSec) {
        gsap.to('.drinks__float--bean', {
          y: -60, rotation: 30, ease: 'none',
          scrollTrigger: { trigger: drinksSec, start: 'top bottom', end: 'bottom top', scrub: 1.2 }
        });
        gsap.to('.drinks__float--leaf', {
          y: 65, rotation: -28, ease: 'none',
          scrollTrigger: { trigger: drinksSec, start: 'top bottom', end: 'bottom top', scrub: 1.6 }
        });
        gsap.to('.drinks__float--spark', {
          y: -40, scale: 1.3, ease: 'none',
          scrollTrigger: { trigger: drinksSec, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
        });
      }
    }

    /* --- Bite chips stagger --- */
    var biteChips = $('.bite-chips');
    if (biteChips) {
      gsap.from('.bite-chip', {
        y: 25, autoAlpha: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out',
        clearProps: 'all',
        scrollTrigger: { trigger: biteChips, start: 'top 90%', once: true }
      });
    }

    /* --- Why Visit cards stagger --- */
    var whyGrid = $('.why__grid');
    if (whyGrid) {
      gsap.from('.why-card', {
        y: 40, autoAlpha: 0, duration: 0.85, stagger: 0.12, ease: 'power3.out',
        clearProps: 'all',
        scrollTrigger: { trigger: whyGrid, start: 'top 86%', once: true }
      });
    }

    /* --- Gallery stagger --- */
    var grid = $('.gallery__grid');
    if (grid) {
      gsap.from('.gallery-item', {
        y: 42, autoAlpha: 0, duration: 0.8, stagger: 0.07, ease: 'power3.out',
        clearProps: 'all',
        scrollTrigger: { trigger: grid, start: 'top 86%', once: true }
      });
    }

    /* --- Story pillars stagger --- */
    var storyPillars = $('.story-pillars');
    if (storyPillars) {
      gsap.from('.story-pillar', {
        y: 35, autoAlpha: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
        clearProps: 'all',
        scrollTrigger: { trigger: storyPillars, start: 'top 88%', once: true }
      });
    }

    /* --- Footer entrance --- */
    var footer = $('.footer');
    if (footer) {
      gsap.from('.footer__wordmark, .footer__tagline', {
        y: 28, autoAlpha: 0, duration: 0.85, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: footer, start: 'top 92%', once: true }
      });
    }

    /* --- ScrollSpy Navigation for index.html --- */
    var sections = $$('main section[id]');
    if (sections.length > 2) {
      sections.forEach(function (sec) {
        window.ScrollTrigger.create({
          trigger: sec,
          start: 'top 40%',
          end: 'bottom 40%',
          onEnter: function () { highlightNavLink(sec.id); },
          onEnterBack: function () { highlightNavLink(sec.id); }
        });
      });
    }

    function highlightNavLink(id) {
      $$('.nav__links a:not(.btn)').forEach(function (link) {
        var href = link.getAttribute('href') || '';
        if (href === '#' + id || href === './#' + id || href === 'index.html#' + id) {
          link.classList.add('is-active');
        } else if (href.indexOf('#') !== -1) {
          link.classList.remove('is-active');
        }
      });
    }

    /* Refresh triggers after media assets finish loading */
    window.addEventListener('load', function () {
      window.ScrollTrigger.refresh();
      updateScrollProgress();
    });
  }

  /* Fallback: if GSAP is absent, ensure no elements stay hidden */
  if (!animate) {
    document.documentElement.classList.add('no-anim');
  }
})();
