// PAADI minimal service worker — enables Android Chrome install criteria.
// Network-first for navigations; no aggressive caching.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  event.respondWith(fetch(req).catch(() => caches.match(req).then((r) => r || Response.error())));
});
