const CACHE = 'jl-trainer-v4';
const PRECACHE = ['/manifest.json'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;
  const path = requestUrl.pathname;
  const networkFirst = path === '/' || path.endsWith('.html') || path.startsWith('/assets/') || path === '/sw.js' || path.startsWith('/exercises/');
  event.respondWith(
    networkFirst
      ? fetch(event.request, { cache: 'no-store' }).then(response => {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
          return response;
        }).catch(() => caches.match(event.request).then(cached => cached || caches.match('/')))
      : caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
          return response;
        }))
  );
});
