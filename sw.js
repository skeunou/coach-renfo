/* P.P.L — Service Worker (notifications push uniquement) */
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });

self.addEventListener('push', function(event){
  var data = {};
  try { data = event.data ? event.data.json() : {}; }
  catch(e){ data = { title: "P.P.L", body: event.data ? event.data.text() : "" }; }

  var title = data.title || "P.P.L — Plan Perso Localisé";
  var opts = {
    body: data.body || "",
    tag: data.tag || "ppl-daily",
    renotify: true,
    requireInteraction: false,
    data: { url: data.url || "https://skeunou.github.io/trail-v2/trail-v2.html" }
  };
  event.waitUntil(self.registration.showNotification(title, opts));
});

self.addEventListener('notificationclick', function(event){
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || "https://skeunou.github.io/trail-v2/trail-v2.html";
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list){
      for (var i = 0; i < list.length; i++){
        if (list[i].url.indexOf('trail-v2') !== -1 && 'focus' in list[i]) return list[i].focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
