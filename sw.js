const CACHE_NAME = 'rocatalog-cache-v1';
const ASSETS = [
  'index.html',
  'dashboard.html',
  'favicon.png',
  'manifest.json'
];

// Telepítés és a fájlok elmentése a gyorsítótárba (Cache)
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Fájlok kiszolgálása a gyorsítótárból, hogy offline is működjön
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});