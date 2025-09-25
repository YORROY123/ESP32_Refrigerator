// 定義快取名稱和需要快取的檔案清單
const CACHE_NAME = 'esp32-refrigerator-cache-v1';
const urlsToCache = [
  './', // 代表根目錄，也就是 index.html
  './index.html',
  './css/tailwind.css',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
  // 注意：請確保您的專案中確實有 'icons/icon-512x512.png' 這個檔案，
  // 如果沒有，請從 manifest.json 中也移除它，或在這裡移除這一行。
];

// Service Worker 安裝事件
self.addEventListener('install', event => {
  // 執行安裝步驟
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Failed to cache files during install:', err);
      })
  );
});

// 監聽 fetch 事件，從快取中提供資源
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果快取中有對應的資源，就直接回傳
        if (response) {
          return response;
        }
        // 否則，就透過網路去請求
        return fetch(event.request);
      })
  );
});

// Service Worker 啟用事件，用於清理舊的快取
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
