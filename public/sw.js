const CACHE = "jl-trainer-v9";
const PRECACHE = ["/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const requestUrl = new URL(request.url);
  if (requestUrl.origin !== self.location.origin) return;

  const path = requestUrl.pathname;
  const isNavigation = request.mode === "navigate" || path === "/";
  const networkFirst =
    isNavigation ||
    path.endsWith(".html") ||
    path.startsWith("/assets/") ||
    path === "/sw.js" ||
    path.startsWith("/exercises/");

  if (networkFirst) {
    event.respondWith(
      fetch(request, { cache: "no-store" })
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          if (isNavigation) {
            const home = await caches.match("/");
            if (home) return home;
          }
          return new Response(
            isNavigation
              ? "O JL Trainer está temporariamente indisponível. Verifique a ligação e tente novamente."
              : "Recurso temporariamente indisponível.",
            { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } },
          );
        }),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    }),
  );
});
