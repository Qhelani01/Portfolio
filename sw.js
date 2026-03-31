// Service Worker for Portfolio Caching
const CACHE_NAME = 'portfolio-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/photography.html',
  '/content.json',
  '/CSS.css',
  '/JS.js',
  '/photography.js',
  '/IMG_9375.jpg',
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
  self.skipWaiting();
});

// Fetch event - cache-first for static shell, network-first for JSON/photos
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // Always try network first for content so updates appear immediately.
  const isContentJson = url.origin === self.location.origin && url.pathname.endsWith('/content.json');
  const isPhoto = url.origin === self.location.origin && url.pathname.startsWith('/photos/');

  if (isContentJson || isPhoto) {
    event.respondWith(
      fetch(req)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
          return response;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  event.respondWith(
    caches.match(req)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(req);
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
  self.clients.claim();
});
