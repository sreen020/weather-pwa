import React, { useState, useEffect } from 'react';

import { fetchWeather } from './api/fetchWeather';
import './App.css';

const App = () => {
	const [query, setQuery] = useState('Amsterdam');
	const [weather, setWeather] = useState({});

	// const search = async (e) => {
	// 	if (e.key === 'Enter') {
	// 		const data = await fetchWeather(query);

	// 		const cache = await caches.open('weather-data');
	// 		await cache.put(
	// 			'https://api.openweathermap.org/data/2.5/weather',
	// 			new Response(JSON.stringify(data))
	// 		);

	// 		setWeather(data);
	// 		setQuery('');
	// 	}
	// };

	useEffect(() => {
		const fetchData = async () => {
			try {
				const cache = await caches.open('weather-data-1.26');
				const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather';

				// const cachedResponse = await cache.match(weatherApiUrl);
				const cachedResponse = await cache.match(weatherApiUrl);
				console.log('AAAAAAA', cachedResponse);

				if (cachedResponse) {
					const cachedData = await cachedResponse.json();
					console.log('cachedData', cachedData);
					setWeather(cachedData);
				}

				// Check if the page is offline
				if (navigator.onLine === false) {
					const cachedResponse = await cache.match(weatherApiUrl);
					const cachedData = await cachedResponse.json();
					console.log('CCCCCCC', cachedData);

					// If offline, use the cached data
					console.log('Offline mode');
					return;
				}

				// Fetch fresh data only when online
				const freshData = await fetchWeather(query);

				// Cache the new data with the correct cache key (weather API URL)
				await cache.put(weatherApiUrl, new Response(JSON.stringify(freshData)));

				// Update the component state with the fresh data
				setWeather(freshData);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
	}, []);

	return (
		<div className="main-container">
			<input
				type="text"
				className="search"
				placeholder="Search..."
				value={query}
				onChange={(e) => setQuery(e.target.value)}
			/>
			{weather.main && (
				<div className="city">
					<h2 className="city-name">
						<span>{weather.name}</span>
						<sup>{weather.sys.country}</sup>
					</h2>
					<div className="city-temp">
						{Math.round(weather.main.temp)}
						<sup>&deg;C</sup>
					</div>
					<div className="info">
						<img
							className="city-icon"
							src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
							alt={weather.weather[0].description}
						/>
						<p>{weather.weather[0].description}</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default App;
