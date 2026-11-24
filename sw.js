// Dutchline driver app – keeps the app opening even without signal. Data calls always go to the network.
const CACHE = 'dutchline-v4';
const SHELL = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png', 'logo-wordmark.png', 'logo-full.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.hostname.endsWith('script.google.com') || u.hostname.endsWith('googleusercontent.com')) return;
  e.respondWith(caches.open(CACHE).then(c => c.match(e.request).then(hit => {
    const net = fetch(e.request).then(r => { if (r && r.status === 200) c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  })));
});
