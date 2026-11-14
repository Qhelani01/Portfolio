// Service worker: fast repeat visits without ever serving a stale site.
// - Pages: network first, cached copy only when offline.
// - CSS/JS/content: stale-while-revalidate (instant, refreshed in background).
// - Generated photos (photos/web/): cache first (file names are stable per size).
const VERSION = 'v4';
const CACHE = `portfolio-${VERSION}`;
const PRECACHE = ['./', 'index.html', 'photography.html', 'styles.css', 'main.js', 'photography.js', 'content.js', 'favicon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const put = (req, res) => {
  if (res && res.ok && res.type === 'basic') {
    const copy = res.clone();
    caches.open(CACHE).then((c) => c.put(req, copy));
  }
  return res;
};

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // let the browser handle fonts etc.

  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).then((res) => put(req, res)).catch(() => caches.match(req).then((r) => r || caches.match('index.html'))));
    return;
  }

  if (url.pathname.includes('/photos/web/')) {
    event.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => put(req, res))));
    return;
  }

  event.respondWith(
    caches.match(req).then((hit) => {
      const network = fetch(req).then((res) => put(req, res)).catch(() => hit);
      return hit || network;
    })
  );
});
