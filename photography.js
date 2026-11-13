/* Photography page — location tabs, masonry grid, lightbox. Depends on main.js (window.Site). */
(() => {
  'use strict';

  const { $, esc, imgTag, lightbox } = window.Site;
  const locations = window.SITE_CONTENT?.photography?.locations || [];
  const heroImg = $('#ph-hero-img');
  const heroTitle = $('#ph-hero-title');
  const tabs = $('#ph-tabs');
  const grid = $('#ph-grid');
  if (!locations.length || !tabs || !grid) return;

  let current = null;

  tabs.innerHTML = locations.map((loc) => `
    <button type="button" role="tab" class="ph-tab" id="tab-${esc(loc.id)}"
            aria-controls="ph-grid" data-id="${esc(loc.id)}">${esc(loc.title)}</button>`).join('');

  function show(id, { focusTab = false } = {}) {
    const loc = locations.find((l) => l.id === id) || locations[0];
    if (loc === current) return;
    current = loc;

    heroImg.srcset = loc.hero.srcset;
    heroImg.src = loc.hero.src;
    heroImg.alt = `${loc.title} landscape`;
    heroTitle.textContent = loc.title;
    document.title = `${loc.title} · Photography — Qhelani Moyo`;

    tabs.querySelectorAll('.ph-tab').forEach((tab) => {
      const selected = tab.dataset.id === loc.id;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focusTab) tab.focus();
    });

    grid.setAttribute('aria-labelledby', `tab-${loc.id}`);
    grid.innerHTML = loc.images.map((img, i) => `
      <button type="button" class="ph-item" data-index="${i}"
              aria-label="Open photo ${i + 1} of ${loc.images.length}: ${esc(img.alt)}">
        ${imgTag(img, { sizes: '(min-width: 1120px) 360px, (min-width: 640px) 50vw, 100vw' })}
      </button>`).join('');

    if (location.hash.slice(1) !== loc.id) history.replaceState(null, '', `#${loc.id}`);
  }

  tabs.addEventListener('click', (e) => {
    const tab = e.target.closest('.ph-tab');
    if (tab) show(tab.dataset.id);
  });

  // Arrow-key navigation between tabs (WAI-ARIA tabs pattern)
  tabs.addEventListener('keydown', (e) => {
    const i = locations.indexOf(current);
    const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: locations.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    show(locations[(next + locations.length) % locations.length].id, { focusTab: true });
  });

  grid.addEventListener('click', (e) => {
    const item = e.target.closest('.ph-item');
    if (!item) return;
    const slides = current.images.map((image) => ({ image, alt: `${image.alt}, ${current.title}` }));
    lightbox().open(slides, Number(item.dataset.index));
  });

  window.addEventListener('hashchange', () => show(location.hash.slice(1)));
  show(location.hash.slice(1));
})();
