import React, { useState, useEffect } from 'react';

import { fetchWeather } from './api/fetchWeather';
import './App.css';

const App = () => {
	const [query, setQuery] = useState('');
	const [weather, setWeather] = useState({});

	const submitForm = async (e) => {
		if (query.length < 2) {
			console.log('true');
			return;
		}
		const data = await fetchWeather(query);

		// Generate a unique key for each data object based on some identifier
		const cacheKey = `weather-data-${query}`;

		const cache = await caches.open('weather-data');
		await cache.put(cacheKey, new Response(JSON.stringify(data)));

		setWeather(data);
		setQuery('');
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const cache = await caches.open('weather-data');
				const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather';

				// Check if the page is offline
				if (navigator.onLine === false) {
					const cachedResponse = await cache.match(weatherApiUrl);
					const cachedData = await cachedResponse.json();
					setWeather(cachedData);
					// If offline, use the cached data
					return;
				}
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
			<button onClick={submitForm}>SUBMIT</button>
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
