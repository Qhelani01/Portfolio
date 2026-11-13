/* Portfolio — shared behaviour for all pages. No dependencies. */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
  const icon = (name, cls = 'icon') => `<svg class="${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

  /** Responsive <img> markup from an image object built by scripts/optimize_images.py */
  const imgTag = (img, { sizes = '100vw', alt = img.alt || '', cls = '', lazy = true, style = '' } = {}) =>
    `<img src="${esc(img.src)}" srcset="${esc(img.srcset)}" sizes="${esc(sizes)}"` +
    ` width="${img.w}" height="${img.h}" alt="${esc(alt)}"` +
    (cls ? ` class="${cls}"` : '') +
    (style ? ` style="${esc(style)}"` : '') +
    (lazy ? ' loading="lazy" decoding="async"' : '') + '>';

  /* ---------- Theme ---------- */
  function initTheme() {
    const btn = $('.theme-toggle');
    if (!btn) return;
    const sync = () => {
      const dark = root.dataset.theme === 'dark';
      btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    };
    sync();
    btn.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('theme', root.dataset.theme); } catch (e) { /* storage unavailable */ }
      sync();
    });
  }

  /* ---------- Mobile navigation ---------- */
  function initNav() {
    const toggle = $('.nav-toggle');
    const menu = $('#nav-menu');
    if (!toggle || !menu) return;
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.classList.toggle('open', open);
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
    document.addEventListener('click', (e) => {
      if (menu.classList.contains('open') && !e.target.closest('.navbar')) setOpen(false);
    });
  }

  /* ---------- Scroll effects (one rAF-batched handler) ---------- */
  function initScroll() {
    const nav = $('.navbar');
    const bar = $('.scroll-progress');
    const toTop = $('.back-to-top');
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const max = root.scrollHeight - window.innerHeight;
      nav?.classList.toggle('scrolled', y > 8);
      if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
      toTop?.classList.toggle('visible', y > 600);
    };

    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();

    toTop?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Active nav link while scrolling (home page) ---------- */
  function initActiveSection() {
    const links = $$('.nav-link[href^="#"]');
    if (!links.length || !('IntersectionObserver' in window)) return;
    const byId = new Map(links.map((l) => [l.getAttribute('href').slice(1), l]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) => l.classList.remove('active'));
        byId.get(entry.target.id)?.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach((s) => io.observe(s));
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    const els = $$('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Typing animation ---------- */
  function initTyping() {
    const el = $('#typing-text');
    if (!el || reduceMotion) return;
    let words;
    try { words = JSON.parse(el.dataset.words); } catch (e) { return; }
    if (!Array.isArray(words) || words.length < 2) return;

    let w = 0;
    let c = words[0].length;
    let deleting = true;
    const tick = () => {
      const word = words[w];
      c += deleting ? -1 : 1;
      el.textContent = word.slice(0, c);
      let delay = deleting ? 45 : 85;
      if (!deleting && c === word.length) { deleting = true; delay = 2200; }
      else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 350; }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 2200);
  }

  /* ---------- Lightbox (shared by home + photography page) ---------- */
  let lightboxApi = null;
  function getLightbox() {
    if (lightboxApi) return lightboxApi;

    const dlg = document.createElement('dialog');
    dlg.className = 'lightbox';
    dlg.setAttribute('aria-label', 'Photo viewer');
    dlg.innerHTML = `
      <button type="button" class="lb-btn lb-close" aria-label="Close">${icon('x')}</button>
      <button type="button" class="lb-btn lb-prev" aria-label="Previous photo">${icon('chevron-left')}</button>
      <figure class="lb-figure">
        <img class="lb-img" alt="" sizes="100vw">
        <figcaption class="lb-caption"></figcaption>
      </figure>
      <button type="button" class="lb-btn lb-next" aria-label="Next photo">${icon('chevron-right')}</button>
      <p class="lb-count" aria-live="polite"></p>`;
    document.body.append(dlg);

    const img = $('.lb-img', dlg);
    const caption = $('.lb-caption', dlg);
    const count = $('.lb-count', dlg);
    let items = [];
    let index = 0;
    let opener = null;

    const preload = (item) => {
      if (!item) return;
      const p = new Image();
      p.sizes = '100vw';
      p.srcset = item.image.srcset;
    };

    const show = (i) => {
      index = (i + items.length) % items.length;
      const item = items[index];
      img.classList.add('loading');
      img.onload = () => img.classList.remove('loading');
      img.srcset = item.image.srcset;
      img.src = item.image.src;
      img.alt = item.alt || item.image.alt || '';
      caption.innerHTML = item.caption || '';
      caption.hidden = !item.caption;
      count.textContent = items.length > 1 ? `${index + 1} / ${items.length}` : '';
      if (items.length > 1) {
        preload(items[(index + 1) % items.length]);
        preload(items[(index - 1 + items.length) % items.length]);
      }
    };
    const step = (d) => { if (items.length > 1) show(index + d); };

    $('.lb-close', dlg).addEventListener('click', () => dlg.close());
    $('.lb-prev', dlg).addEventListener('click', () => step(-1));
    $('.lb-next', dlg).addEventListener('click', () => step(1));
    dlg.addEventListener('click', (e) => { if (e.target === dlg || e.target.classList.contains('lb-figure')) dlg.close(); });
    dlg.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
    dlg.addEventListener('close', () => { opener?.focus({ preventScroll: true }); });

    // Swipe left/right on touch screens
    let startX = null;
    dlg.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    dlg.addEventListener('touchend', (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
      startX = null;
    }, { passive: true });

    lightboxApi = {
      open(list, i = 0) {
        if (!list?.length) return;
        items = list;
        opener = document.activeElement;
        dlg.classList.toggle('single', items.length < 2);
        show(i);
        if (!dlg.open) dlg.showModal();
      },
    };
    return lightboxApi;
  }

  /* ---------- "Through My Lens" cards (home page) ---------- */
  function initLensGallery() {
    const grid = $('#lens-gallery');
    const items = window.SITE_CONTENT?.throughMyLens;
    if (!grid || !items?.length) return;

    grid.innerHTML = items.map((it, i) => `
      <button type="button" class="photo-card reveal" data-index="${i}" style="--i:${i % 3}"
              aria-label="${esc(it.title)}, ${esc(it.location)}. Open photo">
        ${imgTag(it.image, {
          alt: it.title,
          sizes: '(min-width: 1120px) 360px, (min-width: 640px) 50vw, 100vw',
          style: it.focus ? `object-position: ${it.focus}` : '',
        })}
        <span class="photo-caption">
          <span class="photo-title">${esc(it.title)}</span>
          <span class="photo-meta">${icon('map-pin')} ${esc(it.location)}</span>
          <span class="photo-story">${esc(it.story)}</span>
        </span>
      </button>`).join('');

    const slides = items.map((it) => ({
      image: it.image,
      alt: it.title,
      caption: `<strong>${esc(it.title)}</strong> · ${esc(it.location)}<span>${esc(it.story)}</span>`,
    }));
    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.photo-card');
      if (card) getLightbox().open(slides, Number(card.dataset.index));
    });
  }

  /* ---------- Misc ---------- */
  function initYear() {
    $$('.year').forEach((el) => { el.textContent = new Date().getFullYear(); });
  }

  function initServiceWorker() {
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
      window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
    }
  }

  // Shared helpers for page-specific scripts (photography.js)
  window.Site = { $, $$, esc, icon, imgTag, lightbox: getLightbox };

  initTheme();
  initNav();
  initScroll();
  initActiveSection();
  initLensGallery(); // before initReveal so new cards get observed
  initReveal();
  initTyping();
  initYear();
  initServiceWorker();
})();
