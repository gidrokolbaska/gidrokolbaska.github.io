'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "009c9e65172e010890f7f65fde438006",
"favicon.ico": "f55fc14a5aacfc43e10d62eae5df16a6",
"index.html": "909f966273d43036f82e53c509d6ee06",
"/": "909f966273d43036f82e53c509d6ee06",
"main.dart.js": "90778cc8b8f74d1b254fe9e4ea030b06",
"flutter.js": "f85e6fb278b0fd20c349186fb46ae36d",
"favicon.png": "205eca7e52964535a43c423b9e35d580",
"icons/icon-192.png": "0dd77d550db90a9d13272a6d24cd6e58",
"icons/icon-512.png": "9c4aaf69cef019b189b6abb8fbbac627",
"manifest.json": "1716d7e1f6f013fc84ffaf09848e0454",
"assets/AssetManifest.json": "e4295a2e284104b303a2518c52872114",
"assets/NOTICES": "42c14086b1c78fa55a21ec3a9dc8fb1d",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/shaders/ink_sparkle.frag": "bd3eee64bd2b94dca42dfc6603e48948",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/assets/images/hexamerge.png": "2229ee22de578d67af7210e40825c5f9",
"assets/assets/images/playstorebadge.png": "13dde4d193393f5fdbc0fe0f470979d6",
"assets/assets/images/flutter_circle.png": "59abe6cc666a648c33f9488e53663858",
"assets/assets/images/python.png": "64aeac68d191109b6041934d98b8847c",
"assets/assets/images/flutter.png": "7a48d7c8f2d7f65d904aaa538e7252ca",
"assets/assets/images/lasertag.png": "13df3ac27e0d905dc9bc265919d05edf",
"assets/assets/images/flutter.svg": "faf8f499559f6b2f815f454a5794eae3",
"assets/assets/images/spheresoverlord.png": "6fb50d983121eb9d92fea8328f09783c",
"assets/assets/images/github.png": "b17444f181dfac9004b1138776afc162",
"assets/assets/images/java.png": "8f7e4cc176298fd0724a1fe3b1c3f18e",
"assets/assets/images/mylogo.png": "6c6db0da311d2cd6b6779fa747e5f1cf",
"assets/assets/images/GitHub_Logo_White.png": "064ace4777ac86d7627f455f36975452",
"assets/assets/images/weather-app.png": "f5af46939c76f38de71d85aa39599c5a",
"assets/assets/images/unity.svg": "23d1fdd50793a0f55a7c86018a5c2362",
"assets/assets/images/myImage.png": "de5bad1e1aec992c617dd924aa0ec765",
"assets/assets/images/python_circle.png": "b85d209d9c34e721a8f420175edf1a04",
"assets/assets/images/dart.svg": "384ad99903293e87f01f49214db88050",
"assets/assets/images/linkedIn.png": "539e826d2e9efd907a4a487e3fd4c27a",
"assets/assets/images/appstorebadge.svg": "2928664fe1fc6aca88583a6f606d60ba",
"assets/assets/images/backend_icon.png": "a9f40c5e289f8a24b377154ee3f61af9",
"assets/assets/images/snowlogo.png": "2006f478a10cb03306009334d6ee64fe",
"assets/assets/images/facebook.png": "1c131dbd08b8636ada8dbd9758b57ddb",
"assets/assets/images/csharp.svg": "bdaccca278378c33d51a37613e6acd09",
"assets/assets/images/java_circle.png": "cb18683cd0bb39f5ea863c4fe9ee2b2c",
"assets/assets/images/todozoid_icon.png": "d7c5ea0cef6dc771ccc7c073353a41a9",
"canvaskit/canvaskit.js": "9d49083c3442cfc15366562eb578b5f3",
"canvaskit/profiling/canvaskit.js": "dfb57a8542220c772374503baaf2632c",
"canvaskit/profiling/canvaskit.wasm": "2c16ab2af3d4fbad52da379264e260e8",
"canvaskit/canvaskit.wasm": "e58017ff67dd1419dbd7b720458fb1af"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
