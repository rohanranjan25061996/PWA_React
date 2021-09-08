const CACHE_NAME = 'version-1' // here we can put images link etc so every time we don't have to load or featch
const urlsToCache = ['index.html', 'offline.html']

// self => this means service worker itself, if we get any error in writting self directly we can put const self = this;

// Insatll Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log('Open Cache => ', cache)
            return cache.addAll(urlsToCache)
        })
    )
})

// Listen for request
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
        .then(() => {
            return fetch(event.request)
            .catch(() => caches.match('offline.html'))
        })
    )
})

// Activate the Service Worker
self.addEventListener('activate', (event) => {
    const cacheWhiteList = []
    cacheWhiteList.push(CACHE_NAME)
    event.waitUntil(
        caches.keys()
        .then((cacheNames) => {
            Promise.all(
                cacheNames.map((cacheName) => {
                    if(!cacheWhiteList.includes(cacheName)){
                        return caches.delete(cacheName)
                    }
                })
            )
        })
    )
})