const CACHE = 'renova-v9';
const ASSETS = [
  './renova_manutencao_app.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

self.addEventListener('install', e=>{
  e.waitUntil(
    caches.open(CACHE)
      .then(c=>c.addAll(ASSETS))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(
        keys.filter(k=>k!==CACHE).map(k=>{ console.log('Deletando cache antigo:',k); return caches.delete(k); })
      ))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch', e=>{
  // Sempre busca da rede primeiro, só usa cache se offline
  e.respondWith(
    fetch(e.request)
      .then(resp=>{
        if(resp && resp.status===200){
          const clone = resp.clone();
          caches.open(CACHE).then(c=>c.put(e.request, clone));
        }
        return resp;
      })
      .catch(()=>caches.match(e.request))
  );
});
