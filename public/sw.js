const CACHE_NAME = 'wisheshub-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/style-ui.css',
  '/js/main-assembly.js',
  '/features/storage/feat-storage.js'
];

// Website ko offline bhi chalne layak banana
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
