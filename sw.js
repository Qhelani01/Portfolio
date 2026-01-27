// Service Worker for Portfolio Caching
const CACHE_NAME = 'portfolio-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/photography.html',
  '/CSS.css',
  '/JS.js',
  '/IMG_9375.jpg',
  '/photos/seattle-sunset.jpg',
  '/photos/golden-gate.jpg',
  '/photos/zambezi-river.jpg',
  '/photos/california-quail.jpg',
  '/photos/ellie.jpg',
  '/photos/safari.jpg',
  '/photos/roller.jpg',
  '/photos/lion.jpg',
  '/photos/lion16x9.jpg',
  '/photos/baboon16x9.jpg',
  '/photos/pumba&pumba.jpg',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
