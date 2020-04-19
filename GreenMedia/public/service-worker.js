var dataCacheName = 'releaseData-v1';
var cacheName = 'releasePWA';
var filesToCache = [
    '/',
    '/fonts/glyphicons-halflings-regular.woff2',
    '/fonts/glyphicons-halflings-regular.woff',
    '/fonts/glyphicons-halflings-regular.ttf',
    '/images/icons/user.svg',
    '/styles/style.css',
    '/styles/bootstrap.min.css',
    '/scripts/bootstrap.min.js',
    '/scripts/jquery.min.js',
    '/scripts/init-service-worker.js',
    '../controllers/release.js',
    '../databases/green-media.js',
    '../models/release.js',
    '../scripts/index.js',
    '../controllers/index.js',
    '../models/index.js',
    '../scripts/head.js',
    '../scripts/release.js',
    '../scripts/show-story.js',
];

/**
 * installation event: it adds all the files to be cached
 */
self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

/**
 * activation of service worker: it removes all cashed files if necessary
 */
self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName && key !== dataCacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function (e) {
    console.log('[Service Worker] Fetch', e.request.url);
    var dataUrl = '/';
    //if the request is '/', post to the server - do nit try to cache it
    if (e.request.url.indexOf(dataUrl) > -1) {
        return fetch(e.request).then(function (response) {
            // note: it the network is down, response will contain the error
            // that will be passed to Ajax
            return response;
        })
    } else {
        e.respondWith(
            caches.match(e.request).then(function (response) {
                return response
                    || fetch(e.request)
                        .then(function (response) {
                            if (!response.ok) {
                                console.log("error: " + response.error());
                            }
                        })
                        .catch(function (e) {
                            console.log("error: " + err);
                        })
            })
        );
    }
});
