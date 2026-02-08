const CACHE_NAME = 'fittracker-v1';
const STATIC_CACHE = 'fittracker-static-v1';
const DYNAMIC_CACHE = 'fittracker-dynamic-v1';

// Файлы для кэширования при установке
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('[SW] Installed successfully');
        return self.skipWaiting();
      })
      .catch((err) => {
        console.log('[SW] Install failed:', err);
      })
  );
});

// Активация и очистка старых кэшей
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys()
      .then((keys) => {
        return Promise.all(
          keys.filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
            .map((key) => {
              console.log('[SW] Removing old cache:', key);
              return caches.delete(key);
            })
        );
      })
      .then(() => {
        console.log('[SW] Activated successfully');
        return self.clients.claim();
      })
  );
});

// Стратегия: сначала сеть, потом кэш (для HTML)
// Стратегия: сначала кэш, потом сеть (для статических файлов)
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Пропускаем не-GET запросы
  if (request.method !== 'GET') return;

  // Пропускаем chrome-extension и другие не-http запросы
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Если есть в кэше - возвращаем
        if (cachedResponse) {
          // Обновляем кэш в фоне
          fetch(request)
            .then((response) => {
              if (response && response.status === 200) {
                caches.open(DYNAMIC_CACHE)
                  .then((cache) => cache.put(request, response));
              }
            })
            .catch(() => {});
          
          return cachedResponse;
        }

        // Если нет в кэше - загружаем из сети
        return fetch(request)
          .then((response) => {
            // Кэшируем успешные ответы
            if (response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE)
                .then((cache) => cache.put(request, responseClone));
            }
            return response;
          })
          .catch(() => {
            // Офлайн - возвращаем главную страницу для навигации
            if (request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            return new Response('Offline', { status: 503 });
          });
      })
  );
});

// Обработка push-уведомлений (для будущего)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Новое уведомление',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100]
  };

  event.waitUntil(
    self.registration.showNotification('FitTracker', options)
  );
});
