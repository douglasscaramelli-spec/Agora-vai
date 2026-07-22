// Genesis 3D — service worker
// Only becomes active when these files are hosted on a real https:// server
// (see README.md). It is ignored safely when the app is opened as a local
// file or previewed inside Claude — the calculator works fine either way,
// this just adds true offline caching once published.

const CACHE = 'genesis3d-v1';
const ASSETS = ['./genesis-3d.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(event.request, clone));
          return res;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
