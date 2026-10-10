/* Vantage Class: keeps a copy of the pages on the phone so repeat visits are
   instant and the site still opens on a weak or dropped signal. Pages: the
   network first, but if it hasn't answered in 1.6s the saved copy is shown
   (and quietly refreshed). Photos and icons: the saved copy. A new upload
   changes the version below, which clears the old copies. */
var V="vc-bef9e25ebf";
var CORE=["./","services","fleet","coverage","favicon.svg","apple-touch-icon.png","manifest.webmanifest"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(V).then(function(c){return Promise.all(CORE.map(function(u){return c.add(u).catch(function(){})}))}).then(function(){return self.skipWaiting()}))});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==V}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
function page(req){return caches.open(V).then(function(c){
  var net=fetch(req).then(function(r){if(r&&r.ok)c.put(req,r.clone());return r});
  return new Promise(function(res){var done=false;var fin=function(r){if(!done&&r){done=true;res(r)}};
    net.then(fin,function(){c.match(req,{ignoreSearch:true}).then(function(m){if(m)fin(m);else c.match("./").then(function(i){fin(i||Response.error())})})});
    setTimeout(function(){c.match(req,{ignoreSearch:true}).then(fin)},1600)})})}
function saved(req){return caches.open(V).then(function(c){return c.match(req).then(function(m){return m||fetch(req).then(function(r){
  if(r&&(r.ok||r.type==="opaque"))c.put(req,r.clone());return r})})})}
self.addEventListener("fetch",function(e){var req=e.request;if(req.method!=="GET")return;var u=new URL(req.url);
  if(u.origin===location.origin){if(req.mode==="navigate"||/(\.html|\/|\/[^.\/]+)$/.test(u.pathname))e.respondWith(page(req));else e.respondWith(saved(req));return}
  if(/^fonts\.(googleapis|gstatic)\.com$/.test(u.hostname))e.respondWith(saved(req))});
