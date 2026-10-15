/* Feira Bêrga — service worker.
   Não guarda nada em cache: tudo continua vindo da internet, sempre atualizado.
   Recebe as notificações (push) e mostra a bolinha no ícone. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});

self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch { d = { body: e.data && e.data.text() }; }
  const titulo = d.title || 'Feira Bêrga';
  const tarefas = [self.registration.showNotification(titulo, {
    body: d.body || '',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    tag: d.tag || undefined,
    data: { url: d.url || './' }
  })];
  if (typeof d.badge === 'number' && self.navigator && self.navigator.setAppBadge) {
    tarefas.push((d.badge > 0 ? self.navigator.setAppBadge(d.badge) : self.navigator.clearAppBadge()).catch(() => {}));
  }
  e.waitUntil(Promise.all(tarefas));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const alvo = new URL((e.notification.data && e.notification.data.url) || './', self.registration.scope).href;
  e.waitUntil((async () => {
    const abertas = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of abertas) {
      if (c.url.startsWith(self.registration.scope)) {
        try { await c.navigate(alvo); } catch {}
        return c.focus();
      }
    }
    return self.clients.openWindow(alvo);
  })());
});
