var dataCacheName = 'releaseData-v1';
var cacheName = 'releasePWA';
var filesToCache = [
    '/',
    '/favicon.ico',
    '/fonts/glyphicons-halflings-regular.woff2',
    '/fonts/glyphicons-halflings-regular.woff',
    '/fonts/glyphicons-halflings-regular.ttf',
    '/fonts/glyphicons-halflings-regular.eot',
    '/fonts/glyphicons-halflings-regular.svg',
    '/images/icons/user.svg',
    '/stylesheets/style.css',
    '/stylesheets/bootstrap.min.css',
    '/scripts/bootstrap.min.js',
    '/scripts/jquery.min.js',
    '/scripts/app.js',
    '/scripts/idb.js',
    '/scripts/idb-function.js',
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
    let isDataUrl=false;
    var dataUrl = ['/get-comments','/get_user','/release-moments','/show-story','/add-comment','/get-star','/update-star'];
    //if the request is '/', post to the server - do nit try to cache it
    dataUrl.forEach(item=>{
        let url="https://localhost:3000"+item;
        if(url===e.request.url){
            isDataUrl=true;
        }
    });
    if(e.request.url.includes("socket")){
        isDataUrl=true;
    }
    if (isDataUrl) {

        return fetch(e.request).then(function (response) {
            // note: it the network is down, response will contain the error
            // that will be passed to Ajax

            return response;
        }).catch(function (e) {
            console.log("service worker error 1: " + e.message);
        })
    } else {
        e.respondWith(async function () {
            const cache = await caches.open('mysite-dynamic');
            const cachedResponse = await cache.match(e.request);
            const networkResponsePromise = fetch(e.request);

            e.waitUntil(async function () {
                const networkResponse = await networkResponsePromise;
                await cache.put(e.request, networkResponse.clone());
            }());

            // Returned the cached response if we have one, otherwise return the network response.
            return cachedResponse || networkResponsePromise;
        }());
    }
});
