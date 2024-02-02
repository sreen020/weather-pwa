import React, { useEffect, useState } from 'react';

import './App.css';

const Detail = () => {
	const [weatherData, setWeatherData] = useState({});
	const [shownWeatherData, setShownWeatherData] = useState({});

	useEffect(() => {
		const fetchDataFromCache = async () => {
			const cache = await caches.open('weather-data');
			const allCacheKeys = await cache.keys();

			const cachedData = await Promise.all(
				allCacheKeys.map(async (cacheKey) => {
					const response = await cache.match(cacheKey);
					if (response) {
						const data = await response.json();
						return { key: cacheKey.url, data };
					}
					return null;
				})
			);

			// Remove null entries (failed matches)
			const filteredCachedData = cachedData.filter((entry) => entry !== null);

			// Now 'filteredCachedData' array contains objects with keys and corresponding data
			console.log('Cached data:', filteredCachedData);

			// You can set the data in your state or use it as needed
			if (filteredCachedData.length > 0) {
				setWeatherData(filteredCachedData);
			}
		};

		fetchDataFromCache();
	}, []);

	const showData = (key) => {
		const filteredCity = weatherData.filter((item) => item.key === key);
		setShownWeatherData(filteredCity);
		console.log('test', filteredCity);
	};

	const sendNotification = () => {
		if (Notification.permission === 'granted') {
			const options = {
				body: 'This is the notification body',
				icon: 'path/to/icon.png', // Replace with the path to your icon
			};

			const notification = new Notification('Notification Title', options);

			notification.addEventListener('click', () => {
				// Handle notification click event
				console.log('Notification clicked!');
			});
		}
	};

	return (
		<div className="main-container">
			{weatherData.length > 0 &&
				weatherData.map((city) => (
					<button key={city.key} onClick={() => showData(city.key)}>
						{city.data.name}
					</button>
				))}

			{/* {shownWeatherData.data.name} */}

			{shownWeatherData[0] && (
				<div className="city">
					<h2 className="city-name">
						<span>{shownWeatherData[0].data.name}</span>
						<sup>{shownWeatherData[0].data.sys.country}</sup>
					</h2>
					<div className="city-temp">
						{Math.round(shownWeatherData[0].data.main.temp)}
						<sup>&deg;C</sup>
					</div>
					<div className="info">
						<img
							className="city-icon"
							src={`https://openweathermap.org/img/wn/${shownWeatherData[0].data.weather[0].icon}@2x.png`}
							alt={shownWeatherData[0].data.weather[0].description}
						/>
						<p>{shownWeatherData[0].data.weather[0].description}</p>
					</div>
					<button onClick={sendNotification}>Show notification</button>
				</div>
			)}
		</div>
	);
};

export default Detail;
