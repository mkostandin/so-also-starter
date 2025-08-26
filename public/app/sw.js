self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => self.clients.claim());

// Basic offline cache for /app/*
const CACHE = 'so-also-v1';
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (!url.pathname.startsWith('/app/')) return;
  if (event.request.method !== 'GET') return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(event.request);
    if (cached) return cached;
    try {
      const res = await fetch(event.request);
      cache.put(event.request, res.clone());
      return res;
    } catch {
      return cached || Response.error();
    }
  })());
});

// Hook for Firebase Messaging later:
// self.addEventListener('push', (evt) => { /* custom push */ });
