const CACHE_NAME = 'version-1.42';
const dynamicCache = 'dynamic-version-1.42';
const urlsToCache = [
	'/',
	'/detail',
	'index.html',
	'manifest.json',
	'/images/bg.jpg',
	'/images/logo.png',
	'../src/App.css',
	'../src/Detail.jsx',
	'../src/error-page.jsx',
	'../src/Home.jsx',
	'../src/index.js',
	'../src/routes/root.jsx',
	'../src/api/fetchWeather.js',
];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			console.log('Opened cache');
			return cache.addAll(urlsToCache);
		})
	);
});

self.addEventListener('fetch', (event) => {
	const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather';

	event.respondWith(
		// Handle caching and offline for weather API requests
		caches
			.match(event.request)
			.then((response) => {
				return (
					response ||
					fetch(event.request).then((response) => {
						return caches.open(dynamicCache).then((cache) => {
							cache.put(event.request.url, response.clone());
							return response;
						});
					})
				);
			})
			.catch(() => {
				return caches.match('offline.html');
			})
	);
});

self.addEventListener('activate', (event) => {
	const cacheWhitelist = [CACHE_NAME, dynamicCache, 'weather-data'];

	event.waitUntil(
		caches.keys().then((cacheNames) =>
			Promise.all(
				cacheNames.map((cacheName) => {
					if (!cacheWhitelist.includes(cacheName)) {
						return caches.delete(cacheName);
					}
				})
			)
		)
	);
});
