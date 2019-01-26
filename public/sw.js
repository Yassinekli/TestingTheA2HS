const cacheName = 'cache-v1';
const staticAssets = [
    './',
    './index.html',
    './manifest.json',
    './images/icons-192.png',
    './images/icons-512.png'
];

self.addEventListener('install', async e => {
    console.log('Service Worker Installed');
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
    return self.skipWaiting();
});

self.addEventListener('activate', e => {
    console.log('Service Worker Activate');
    self.clients.claim();
});

self.addEventListener('fetch', async e => {
    console.log('Service Worker Fetching');
    const req = e.request;
    const url = new URL(req.url);

    if(url.origin === location.origin)
        e.respondWith(cacheFirst(req));
    else
        e.respondWith(networkAndCache(req));
});

async function cacheFirst(req) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(req);
    return cached || fetch(req);
}

async function networkAndCache(req) {
    const cache = await caches.open(cacheName);
    try{
        const fresh = await fetch(req);
        await cache.put(req, fresh.clone());
        return fresh;
    }catch{
        const cached = await cache.match(req);
        return cached;
    }
}