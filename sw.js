/* Bump this number every time you upload new files, so phones pick up the update. */
const CACHE = 'xenwinx-v2.9.5';
const FILES = ['./', 'index.html', 'renderer.js', 'config.js', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'assets/xenwinx-logo.png', 'assets/forest-bg-wide.jpg', 'assets/forest-bg-tall.jpg', 'assets/splash-cottage.jpg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname.endsWith('supabase.co')) return;            // sync always goes to the network
  if (url.origin === location.origin) {                          // app files: cache first, refresh in background
    e.respondWith(caches.match(req).then(hit => {
      const net = fetch(req).then(r => { if (r.ok) caches.open(CACHE).then(c => c.put(req, r.clone())); return r; }).catch(() => hit);
      return hit || net;
    }));
  } else if (url.hostname.includes('fonts.g')) {                // Google Fonts: cache so it works offline
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { caches.open(CACHE).then(c => c.put(req, r.clone())); return r; })));
  }
});
