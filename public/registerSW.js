const CACHE_NAME = 'zync-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/masked-icon.svg',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/manifest.webmanifest',
  //TODO: add other assets you want to pre-cache
];

self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  console.log('Fetching:', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return the response from the cache
        if (response) {
          return response;
        }
        // IMPORTANT: Clone the request. A request is a stream and can only be consumed once.
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          (response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream and can only be consumed once.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
  });
  
  // Handle offline/online events
  self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'OFFLINE') {
      // Handle offline state
      console.log('App is offline');
    } else if (event.data && event.data.type === 'ONLINE') {
      // Handle online state
      console.log('App is online');
    }
  });
  