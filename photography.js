(function () {
  var heroImg = document.getElementById('photography-hero-img');
  var heroTitle = document.getElementById('photography-hero-title');
  var locationLinks = document.querySelectorAll('.photography-location-link');
  var grids = document.querySelectorAll('.photography-grid[data-location]');

  var locations = {
    'united-states': {
      title: 'UNITED STATES',
      heroSrc: 'https://placehold.co/1600x600/f5f5f7/86868b?text=United+States+Landscape',
      others: ['botswana', 'zimbabwe']
    },
    botswana: {
      title: 'BOTSWANA',
      heroSrc: 'https://placehold.co/1600x600/f5f5f7/86868b?text=Botswana+Landscape',
      others: ['united-states', 'zimbabwe']
    },
    zimbabwe: {
      title: 'ZIMBABWE',
      heroSrc: 'https://placehold.co/1600x600/f5f5f7/86868b?text=Zimbabwe+Landscape',
      others: ['united-states', 'botswana']
    }
  };

  var labels = {
    'united-states': 'UNITED STATES',
    botswana: 'BOTSWANA',
    zimbabwe: 'ZIMBABWE'
  };

  function showLocation(id) {
    var loc = locations[id];
    if (!loc) return;

    heroImg.src = loc.heroSrc;
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

  function init() {
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
