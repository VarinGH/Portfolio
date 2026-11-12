/* Offline support. Online: always fetch the newest files and refresh the stored copy. Offline: serve the stored copy. */
var CACHE = 'portfolio-v65';
var FILES = ['./', 'index.html', 'app.css', 'app.js', 'version.js', 'content.js', 'content.th.js', 'anims.js', 'eyedrop3d.js', 'media/xiao.bin', 'lib/three.min.js', 'lib/RoomEnvironment.js', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png',
  'fonts/source-serif-4-latin-400-normal.woff2', 'fonts/source-serif-4-latin-400-italic.woff2', 'fonts/source-serif-4-latin-600-normal.woff2',
  'fonts/source-sans-3-latin-400-normal.woff2', 'fonts/source-sans-3-latin-600-normal.woff2', 'fonts/source-sans-3-latin-700-normal.woff2',
  'fonts/sarabun-latin-400.woff2', 'fonts/sarabun-latin-500.woff2', 'fonts/sarabun-latin-600.woff2',
  'fonts/sarabun-thai-400-normal.woff2', 'fonts/sarabun-thai-600-normal.woff2', 'fonts/sarabun-thai-700-normal.woff2',
  'fonts/sarabun-latin-700.woff2', 'fonts/sarabun-latin-800.woff2', 'fonts/sarabun-thai-800-normal.woff2', 'fonts/ibm-plex-mono-latin-400.woff2', 'fonts/ibm-plex-mono-latin-600.woff2'];
var MEDIA = ['media/photo.jpg', 'media/cv-01.jpg', 'media/cv-02.jpg', 'media/cv-03.jpg', 'media/cv-04.jpg', 'media/cv-05.jpg', 'media/cv-06.jpg', 'media/cv-07.jpg', 'media/cv-08.jpg', 'media/cv-09.jpg', 'media/cv-10.jpg', 'media/cv-11.jpg', 'media/cv-12.jpg', 'media/cv-13.jpg', 'media/hindsight-demo.mp4', 'media/globe-tracker.mp4', 'media/apacrs-film.mp4', 'media/forceps-assembly.mp4']; /* media files are added here as they arrive, so they are stored for offline use */
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES.concat(MEDIA).map(function (u) { return new Request(u, { cache: 'reload' }); })); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  if (/version\.json/.test(r.url)) return; /* the version check always goes to the server, never to the stored copy */
  if (r.headers.has('range')) { /* video seeking: answer from the stored copy when there is one */
    e.respondWith(caches.match(r.url, { ignoreSearch: true }).then(function (hit) { return hit || fetch(r); }));
    return;
  }
  e.respondWith(fetch(r, { cache: 'no-cache' }).then(function (res) {
    if (res && res.status === 200) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(r, copy); }); }
    return res;
  }).catch(function () { return caches.match(r, { ignoreSearch: true }).then(function (hit) { return hit || caches.match('index.html'); }); }));
});
