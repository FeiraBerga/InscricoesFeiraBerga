/* Feira Bêrga — service worker mínimo: permite instalar como app no Android.
   Não guarda nada em cache: tudo continua vindo da internet, sempre atualizado. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
