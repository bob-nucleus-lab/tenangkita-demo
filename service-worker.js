const CACHE_NAME = 'tenangkita-v0-1-premium-myds';
const APP_SHELL = [
  './', './index.html', './styles.css', './app.js', './manifest.json', './assets/icon.svg',
  './assets/hero-family.png', './assets/family-today.png', './assets/family-market.png',
  './assets/family-fuel-planning.png', './assets/family-checklist.png', './assets/family-tablet-planning.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const clone = response.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
    return response;
  }).catch(() => caches.match('./index.html'))));
});
