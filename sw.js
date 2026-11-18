const CACHE = 'music-pwa-v49';
const ASSETS = ['./', 'index.html', 'style.css', 'app.js', 'lib/components.js', 'lib/liquid-glass.js', 'img/apple-park.jpg', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {})).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// 同一オリジンのみ: ネットワーク優先、失敗したらキャッシュ(オフライン起動用)
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // blob:/data: は SW で扱わない(blob:はoriginが同一に見えるため、ネットワーク失敗時にHTMLが返ってしまう)
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return;
  if (url.origin !== self.location.origin) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res && res.ok && res.status === 200) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}); }
      return res;
    }).catch(async () => (await caches.match(req)) || (req.mode === 'navigate' && (await caches.match('index.html'))) || Response.error())
  );
});
