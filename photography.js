(function () {
  var heroImg = document.getElementById('photography-hero-img');
  var heroTitle = document.getElementById('photography-hero-title');
  var locationLinks = document.querySelectorAll('.photography-location-link');
  var grids = document.querySelectorAll('.photography-grid[data-location]');

  var labels = {
    'united-states': 'UNITED STATES',
    botswana: 'BOTSWANA',
    zimbabwe: 'ZIMBABWE'
  };

  var fallbackLocations = {
    'united-states': {
      title: 'UNITED STATES',
      hero: 'https://placehold.co/1600x600/f5f5f7/86868b?text=United+States+Landscape',
      images: ['https://placehold.co/600x600/f5f5f7/86868b?text=US+1', 'https://placehold.co/600x600/f5f5f7/86868b?text=US+2', 'https://placehold.co/600x600/f5f5f7/86868b?text=US+3', 'https://placehold.co/600x600/f5f5f7/86868b?text=US+4', 'https://placehold.co/600x600/f5f5f7/86868b?text=US+5', 'https://placehold.co/600x600/f5f5f7/86868b?text=US+6', 'https://placehold.co/600x600/f5f5f7/86868b?text=US+7', 'https://placehold.co/600x600/f5f5f7/86868b?text=US+8'],
      others: ['botswana', 'zimbabwe']
    },
    botswana: {
      title: 'BOTSWANA',
      hero: 'https://placehold.co/1600x600/f5f5f7/86868b?text=Botswana+Landscape',
      images: ['https://placehold.co/600x600/f5f5f7/86868b?text=BW+1', 'https://placehold.co/600x600/f5f5f7/86868b?text=BW+2', 'https://placehold.co/600x600/f5f5f7/86868b?text=BW+3', 'https://placehold.co/600x600/f5f5f7/86868b?text=BW+4', 'https://placehold.co/600x600/f5f5f7/86868b?text=BW+5', 'https://placehold.co/600x600/f5f5f7/86868b?text=BW+6', 'https://placehold.co/600x600/f5f5f7/86868b?text=BW+7', 'https://placehold.co/600x600/f5f5f7/86868b?text=BW+8'],
      others: ['united-states', 'zimbabwe']
    },
    zimbabwe: {
      title: 'ZIMBABWE',
      hero: 'https://placehold.co/1600x600/f5f5f7/86868b?text=Zimbabwe+Landscape',
      images: ['https://placehold.co/600x600/f5f5f7/86868b?text=ZW+1', 'https://placehold.co/600x600/f5f5f7/86868b?text=ZW+2', 'https://placehold.co/600x600/f5f5f7/86868b?text=ZW+3', 'https://placehold.co/600x600/f5f5f7/86868b?text=ZW+4', 'https://placehold.co/600x600/f5f5f7/86868b?text=ZW+5', 'https://placehold.co/600x600/f5f5f7/86868b?text=ZW+6', 'https://placehold.co/600x600/f5f5f7/86868b?text=ZW+7', 'https://placehold.co/600x600/f5f5f7/86868b?text=ZW+8'],
      others: ['united-states', 'botswana']
    }
  };

  var locations = {};

  function fillGrid(el, imagePaths, locationLabel, locId) {
    el.innerHTML = '';
    (imagePaths || []).forEach(function (src, i) {
      var wrap = document.createElement('div');
      wrap.className = 'photography-grid-item';
      wrap.setAttribute('data-index', i);
      wrap.setAttribute('data-location', locId);
      var img = document.createElement('img');
      img.src = src;
      img.alt = locationLabel + ' — photo ' + (i + 1);
      img.loading = 'lazy';
      var zoomIcon = document.createElement('span');
      zoomIcon.className = 'photography-grid-zoom-icon';
      zoomIcon.setAttribute('aria-hidden', 'true');
      zoomIcon.innerHTML = '<i class="fas fa-search-plus"></i>';
      wrap.appendChild(img);
      wrap.appendChild(zoomIcon);
      wrap.addEventListener('click', function () { openLightbox(locId, i); });
      el.appendChild(wrap);
    });
  }

  function showLocation(id) {
    var loc = locations[id];
    if (!loc) return;

    heroImg.src = loc.hero;
    heroImg.alt = loc.title + ' — landscape';
    heroTitle.textContent = loc.title;

    locationLinks[0].setAttribute('data-location', loc.others[0]);
    locationLinks[0].textContent = labels[loc.others[0]];
    locationLinks[0].href = '#' + loc.others[0];

    locationLinks[1].setAttribute('data-location', loc.others[1]);
    locationLinks[1].textContent = labels[loc.others[1]];
    locationLinks[1].href = '#' + loc.others[1];

    grids.forEach(function (el) {
      if (el.getAttribute('data-location') === id) {
        el.removeAttribute('hidden');
        el.classList.add('photography-grid-visible');
      } else {
        el.setAttribute('hidden', '');
        el.classList.remove('photography-grid-visible');
      }
    });

    if (history.replaceState) {
      history.replaceState(null, '', '#' + id);
    }
  }

  function applyLocations(locs) {
    locs.forEach(function (loc) {
      var others = locs.map(function (l) { return l.id; }).filter(function (lid) { return lid !== loc.id; });
      locations[loc.id] = {
        title: loc.title,
        hero: loc.hero,
        images: loc.images || [],
        others: others
      };
    });
    grids.forEach(function (el) {
      var locId = el.getAttribute('data-location');
      var loc = locations[locId];
      if (loc && loc.images && loc.images.length) {
        fillGrid(el, loc.images, loc.title, locId);
      }
    });
  }

  var lightbox = document.getElementById('photography-lightbox');
  var lightboxImg = document.getElementById('photography-lightbox-img');
  var lightboxClose = document.getElementById('photography-lightbox-close');
  var lightboxPrev = document.getElementById('photography-lightbox-prev');
  var lightboxNext = document.getElementById('photography-lightbox-next');
  var lightboxZoneLeft = document.getElementById('photography-lightbox-zone-left');
  var lightboxZoneRight = document.getElementById('photography-lightbox-zone-right');
  var lightboxImageWrap = document.getElementById('photography-lightbox-image-wrap');

  var currentLightboxLocation = null;
  var currentLightboxIndex = 0;

  function getLightboxImages() {
    if (!currentLightboxLocation || !locations[currentLightboxLocation]) return [];
    return locations[currentLightboxLocation].images || [];
  }

  function showLightboxImage() {
    var imgs = getLightboxImages();
    if (imgs.length === 0) return;
    var idx = ((currentLightboxIndex % imgs.length) + imgs.length) % imgs.length;
    currentLightboxIndex = idx;
    lightboxImg.src = imgs[idx];
    lightboxImg.alt = locations[currentLightboxLocation].title + ' — photo ' + (idx + 1);
  }

  function openLightbox(locId, index) {
    if (!locations[locId] || !locations[locId].images || locations[locId].images.length === 0) return;
    currentLightboxLocation = locId;
    currentLightboxIndex = index;
    showLightboxImage();
    if (lightbox) {
      lightbox.classList.add('photography-lightbox-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('photography-lightbox-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  function lightboxPrevImage() {
    var imgs = getLightboxImages();
    if (imgs.length === 0) return;
    currentLightboxIndex = (currentLightboxIndex - 1 + imgs.length) % imgs.length;
    showLightboxImage();
  }

  function lightboxNextImage() {
    var imgs = getLightboxImages();
    if (imgs.length === 0) return;
    currentLightboxIndex = (currentLightboxIndex + 1) % imgs.length;
    showLightboxImage();
  }

  function initLightbox() {
    if (!lightbox || !lightboxImg) return;
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', lightboxPrevImage);
    if (lightboxNext) lightboxNext.addEventListener('click', lightboxNextImage);
    if (lightboxZoneLeft) lightboxZoneLeft.addEventListener('click', lightboxPrevImage);
    if (lightboxZoneRight) lightboxZoneRight.addEventListener('click', lightboxNextImage);
    if (lightboxImageWrap) {
      lightboxImageWrap.addEventListener('click', function (e) {
        if (e.target === lightboxImg) {
          var rect = lightboxImg.getBoundingClientRect();
          var mid = rect.left + rect.width / 2;
          if (e.clientX < mid) lightboxPrevImage();
          else lightboxNextImage();
        }
      });
    }
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (!lightbox || !lightbox.classList.contains('photography-lightbox-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lightboxPrevImage();
      if (e.key === 'ArrowRight') lightboxNextImage();
    });
  }

  function runUI() {
    var hash = (window.location.hash || '#united-states').slice(1);
    var id = locations[hash] ? hash : 'united-states';
    showLocation(id);
    locationLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        showLocation(link.getAttribute('data-location'));
      });
    });
    window.addEventListener('hashchange', function () {
      var h = (window.location.hash || '#united-states').slice(1);
      if (locations[h]) showLocation(h);
    });
  }

  function init() {
    initLightbox();
    fetch('content.json')
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (content) {
        var locs = (content && content.photography && content.photography.locations) || [];
        applyLocations(locs);
        runUI();
      })
      .catch(function () {
        applyLocations([
          { id: 'united-states', title: 'UNITED STATES', hero: fallbackLocations['united-states'].hero, images: fallbackLocations['united-states'].images },
          { id: 'botswana', title: 'BOTSWANA', hero: fallbackLocations.botswana.hero, images: fallbackLocations.botswana.images },
          { id: 'zimbabwe', title: 'ZIMBABWE', hero: fallbackLocations.zimbabwe.hero, images: fallbackLocations.zimbabwe.images }
        ]);
        runUI();
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
