/* ============================================================
   REYNALD D. NOGALIZA — SERVICE WORKER
   PWA Caching Strategy
   ============================================================ */

const CACHE_NAME = 'rn-portfolio-v1';
const ASSETS = [
  '/portfolio_web/',
  '/portfolio_web/index.html',
  '/portfolio_web/style.css',
  '/portfolio_web/script.js',
  '/portfolio_web/manifest.json',
  '/portfolio_web/icon-512.png',
  '/portfolio_web/photofinal.jpg'
];

// Install — cache all assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch — serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
