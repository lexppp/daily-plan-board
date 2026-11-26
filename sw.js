/* 已回退到 v1.2.0（单文件、无 Service Worker 版本）。
   本文件仅用于让浏览器里残留的 v2.0.0 Service Worker 自毁：
   清空所有缓存 -> 注销自身 -> 刷新已打开的页面。
   页面本身不再注册任何 Service Worker。 */
self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.registration.unregister(); })
      .then(function () { return self.clients.matchAll({ type: 'window' }); })
      .then(function (clients) {
        clients.forEach(function (c) {
          try { c.navigate(c.url); } catch (e) { /* 忽略跨域/受限页面 */ }
        });
      })
      .catch(function () { /* 自毁失败不影响页面正常打开 */ })
  );
});
