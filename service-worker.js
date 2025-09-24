const CACHE_NAME = 'dj-salgados-v5'; // mude a versão sempre que atualizar
const urlsToCache = [
  '/',
  '/index.html',
  '/splash.html',
  '/css/style.css',
  '/css/splash.css',
  '/js/carrinho.js',
  '/manifest.json',
  
];

// Instalando e armazenando arquivos no cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()) // ativa imediatamente
  );
});

// Ativando e removendo caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) return caches.delete(name);
        })
      );
    }).then(() => self.clients.claim()) // assume controle das páginas
  );
});

// Escutando mensagem do navegador para atualizar imediatamente
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Interceptando requisições
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;

      return fetch(event.request).then(fetchResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
        return new Response(
          'Você está offline e o recurso não está em cache.',
          { status: 503, statusText: 'Service Unavailable' }
        );
      });
    })
  );
});
