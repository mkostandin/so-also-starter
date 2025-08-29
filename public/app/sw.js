// Service Worker for So Also PWA
const CACHE_NAME = 'so-also-v1';

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/app/manifest.json',
  '/app/icon-192.png',
  '/app/icon-512.png'
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch event - handle navigation and app resources
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Handle navigation requests (when user clicks app icon)
  if (event.request.mode === 'navigate') {
    // For any navigation request to the app, serve the main index.html
    // React Router will handle the routing from there
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Fallback to cached version
          return caches.match('/') || caches.match('/index.html') || new Response(`
            <!DOCTYPE html>
            <html>
              <head><title>So Also</title></head>
              <body style="font-family: system-ui; text-align: center; padding: 2rem; background: #0b1220; color: #e6edf8;">
                <h1>So Also</h1>
                <p>Discover and share events</p>
                <a href="/" style="color: #0ea5e9;">Open App</a>
              </body>
            </html>
          `, {
            headers: { 'Content-Type': 'text/html' }
          });
        })
    );
    return;
  }

  // Only handle GET requests for app resources
  if (event.request.method !== 'GET' || !url.pathname.startsWith('/app/')) return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Return cached version if available
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise fetch from network and cache
      return fetch(event.request).then(networkResponse => {
        if (networkResponse.ok) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        }
        return networkResponse;
      }).catch(() => {
        // Return offline fallback for navigation requests
        if (event.request.mode === 'navigate') {
          return new Response(`
            <!DOCTYPE html>
            <html>
              <head><title>Offline - So Also</title></head>
              <body style="font-family: system-ui; text-align: center; padding: 2rem; background: #0b1220; color: #e6edf8;">
                <h1>You're Offline</h1>
                <p>Please check your internet connection and try again.</p>
                <button onclick="window.location.reload()" style="background: #0ea5e9; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">Retry</button>
              </body>
            </html>
          `, {
            headers: { 'Content-Type': 'text/html' }
          });
        }
      });
    })
  );
});
