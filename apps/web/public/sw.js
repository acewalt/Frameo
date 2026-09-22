/**
 * Frameo Service Worker
 *
 * Handles offline functionality by caching application assets.
 * Implements a cache-first strategy for static assets and network-first for API calls.
 *
 * Requirements: 35.1, 35.2, 35.4
 * - 35.1: Cache all application assets on first load for offline use
 * - 35.2: Keep local editing functionality available offline
 * - 35.4: Keep remote services network-only
 */

const CACHE_NAME = "frameo-v1";
const STATIC_CACHE_NAME = "frameo-static-v1";
const DYNAMIC_CACHE_NAME = "frameo-dynamic-v1";

/**
 * Static assets to cache on install
 * These are the core application files needed for offline functionality
 */
const BASE_PATH = "/Frameo/";
const STATIC_ASSETS = [BASE_PATH, `${BASE_PATH}index.html`, `${BASE_PATH}manifest.json`];

/**
 * Patterns for assets that should be cached dynamically
 */
const CACHEABLE_PATTERNS = [
  /\.js$/,
  /\.css$/,
  /\.woff2?$/,
  /\.ttf$/,
  /\.eot$/,
  /\.svg$/,
  /\.png$/,
  /\.jpg$/,
  /\.jpeg$/,
  /\.gif$/,
  /\.webp$/,
  /\.ico$/,
];

/** API and remote requests are always network-only. */
const NO_CACHE_PATTERNS = [/\/api\//];

/**
 * Check if a URL should be cached
 */
function shouldCache(url) {
  const urlString = url.toString();

  // Never cache API/remote service requests
  if (NO_CACHE_PATTERNS.some((pattern) => pattern.test(urlString))) {
    return false;
  }

  // Cache if matches cacheable patterns
  return CACHEABLE_PATTERNS.some((pattern) => pattern.test(urlString));
}

/**
 * Install event - cache static assets
 */
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Installing...");

  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log("[ServiceWorker] Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log("[ServiceWorker] Static assets cached");
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("[ServiceWorker] Failed to cache static assets:", error);
      })
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              // Delete old versions of our caches
              return (
                name.startsWith("frameo-") &&
                name !== STATIC_CACHE_NAME &&
                name !== DYNAMIC_CACHE_NAME
              );
            })
            .map((name) => {
              console.log("[ServiceWorker] Deleting old cache:", name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log("[ServiceWorker] Activated");
        // Take control of all clients immediately
        return self.clients.claim();
      })
  );
});

/**
 * Fetch event - serve from cache or network
 */
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith("http")) {
    return;
  }

  // Handle remote/API requests as network-only.
  if (NO_CACHE_PATTERNS.some((pattern) => pattern.test(url.toString()))) {
    event.respondWith(
      fetch(request).catch(
        () =>
          new Response(
            JSON.stringify({
              message: "This online service is unavailable while offline.",
            }),
            {
              status: 503,
              statusText: "Service Unavailable",
              headers: {
                "Content-Type": "application/json",
              },
            },
          ),
      ),
    );
    return;
  }

  // For navigation requests (HTML pages), use network-first strategy
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache the response for offline use
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Fall back to cache
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Fall back to index.html for SPA routing
            return caches.match(`${BASE_PATH}index.html`);
          });
        })
    );
    return;
  }

  // For static assets, use cache-first strategy
  if (shouldCache(url)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached response and update cache in background
          event.waitUntil(
            fetch(request)
              .then((networkResponse) => {
                if (networkResponse.ok) {
                  caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
                    cache.put(request, networkResponse);
                  });
                }
              })
              .catch(() => {
                // Network failed, but we have cache - that's fine
              })
          );
          return cachedResponse;
        }

        // Not in cache, fetch from network
        return fetch(request).then((networkResponse) => {
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // For other requests, use network-first strategy
  event.respondWith(
    fetch(request)
      .then((response) => {
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

/**
 * Message event - handle messages from the main thread
 */
self.addEventListener("message", (event) => {
  const { type, payload } = event.data || {};

  switch (type) {
    case "SKIP_WAITING":
      self.skipWaiting();
      break;

    case "GET_CACHE_STATUS":
      getCacheStatus().then((status) => {
        event.ports[0].postMessage({ type: "CACHE_STATUS", payload: status });
      });
      break;

    case "CLEAR_CACHE":
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ type: "CACHE_CLEARED" });
      });
      break;

    case "CHECK_ONLINE":
      event.ports[0].postMessage({
        type: "ONLINE_STATUS",
        payload: { online: navigator.onLine },
      });
      break;
  }
});

/**
 * Get cache status information
 */
async function getCacheStatus() {
  const cacheNames = await caches.keys();
  let totalSize = 0;
  let totalEntries = 0;

  for (const name of cacheNames) {
    if (name.startsWith("frameo-")) {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      totalEntries += keys.length;
    }
  }

  return {
    cacheNames: cacheNames.filter((n) => n.startsWith("frameo-")),
    totalEntries,
    version: CACHE_NAME,
  };
}

/**
 * Clear all Frameo caches
 */
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames
      .filter((name) => name.startsWith("frameo-"))
      .map((name) => caches.delete(name))
  );
}

console.log("[ServiceWorker] Script loaded");
