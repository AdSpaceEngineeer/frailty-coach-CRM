const CACHE_NAME = "frailty-coach-v60";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=60",
  "./manifest.webmanifest",
  "./src/app.js?v=60",
  "./src/logic.js?v=60",
  "./src/data.js?v=60",
  "./assets/illustrations/coach-avatar.png",
  "./assets/illustrations/coach-avatar-female-east-asian.png",
  "./assets/illustrations/coach-avatar-male-east-asian.png",
  "./assets/illustrations/supported-sit-to-stand.png",
  "./assets/illustrations/weight-shifts.png",
  "./assets/illustrations/wall-pushups.png",
  "./assets/illustrations/hallway-walk.png",
  "./assets/illustrations/progress-success.png",
  "./assets/illustrations/male-supported-sit-to-stand.png",
  "./assets/illustrations/male-weight-shifts.png",
  "./assets/illustrations/male-wall-pushups.png",
  "./assets/illustrations/male-hallway-walk.png",
  "./assets/illustrations/male-progress-success.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
