const CACHE_NAME = "the-cube-v1";

const LOCAL_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// Three.js CDN লিংক — নেট চালু থাকাকালীন SW নিজে ক্যাশে করে নেবে
const CDN_FILES = [
  "https://cdnjs.cloudflare.com/ajax/libs/three.js/95/three.min.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(LOCAL_FILES).then(() => {
        return Promise.all(
          CDN_FILES.map((url) =>
            cache.add(new Request(url, { mode: "no-cors" })).catch(() => {})
          )
        );
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
