import axios from "axios";
import { useState, useEffect } from "react";

const WEATHER_API = `https://api.openweathermap.org/data/2.5/weather`;

const Weather = (props) => {
	const { country } = props;
	const [weather, setWeather] = useState(null);
	const [lat, lon] = country.capitalInfo.latlng;

	useEffect(() => {
		axios
			.get(
				`${WEATHER_API}?appid=${import.meta.env.VITE_OWM_KEY}&lat=${lat}&lon=${lon}&units=metric`
			)
			.then((r) => setWeather(r.data));
	}, [country]);

	if (weather)
		return (
			<>
				<h2>Weather in {country.capital}</h2>
				<p>Temperature {weather.main.temp} Celsius</p>
				<img
					src={`https://openweathermap.org/payload/api/media/file/${weather.weather[0].icon}.png`}
					alt={`${weather.weather[0].description} icon`}
				/>
				<p>Wind {weather.wind.speed} m/s</p>
			</>
		);
};

export default Weather;
