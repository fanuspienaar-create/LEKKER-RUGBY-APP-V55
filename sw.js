// LEKKER RUGBY APP - safe player/logo build v25
const VERSION='lekker-rugby-v25-world-xv-logo-players-20260909';
const CACHE=VERSION;
const ASSETS=['./','./index.html','./style.css','./app.js','./manifest-v10.webmanifest','./api-config.js','./apple-touch-icon.png','./apple-touch-icon-precomposed.png','./assets/lekker-rugby-icon-120x120.png','./assets/lekker-rugby-icon-152x152.png','./assets/lekker-rugby-icon-167x167.png','./assets/lekker-rugby-icon-180x180.png','./assets/lekker-rugby-icon-192x192.png','./assets/lekker-rugby-icon-512x512.png','./assets/lekker-rugby-icon-1024x1024.png','./assets/lekker-fm-logo.jpg','./assets/lekker-rugby-hero.png','./assets/lekker-rugby-voorspel-logo.png','./assets/scotland-saltire.png','./assets/england-st-george.png','./assets/wales-flag.png','./assets/flags/ar.svg','./assets/flags/au.svg','./assets/flags/bw.svg','./assets/flags/ca.svg','./assets/flags/eng.svg','./assets/flags/es.svg','./assets/flags/fj.svg','./assets/flags/fr.svg','./assets/flags/ga.svg','./assets/flags/ge.svg','./assets/flags/hk.svg','./assets/flags/ie.svg','./assets/flags/it.svg','./assets/flags/jp.svg','./assets/flags/ke.svg','./assets/flags/na.svg','./assets/flags/nz.svg','./assets/flags/pt.svg','./assets/flags/ru.svg','./assets/flags/sco.svg','./assets/flags/to.svg','./assets/flags/ug.svg','./assets/flags/us.svg','./assets/flags/uy.svg','./assets/flags/wal.svg','./assets/flags/ws.svg','./assets/flags/za.svg','./assets/flags/zm.svg','./assets/flags/zw.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  if(e.request.mode==='navigate'||e.request.url.endsWith('/index.html')){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{caches.open(CACHE).then(c=>c.put('./index.html',r.clone()));return r}).catch(()=>caches.match('./index.html')));return;
  }
  e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request)));
});
