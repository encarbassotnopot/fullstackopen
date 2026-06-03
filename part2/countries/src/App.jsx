import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

const ALL_COUNTRIES = "https://studies.cs.helsinki.fi/restcountries/api/all";
const WEATHER_API = `https://api.openweathermap.org/data/2.5/weather`;

const SearchBox = (props) => {
	const { search, onSearch } = props;

	return (
		<>
			find countries <input value={search} onChange={onSearch} />
		</>
	);
};

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
const Country = (props) => {
	const { country } = props;
	if (!country) return;

	const langs = Object.values(country.languages);

	return (
		<>
			<h1>{country.name.common}</h1>
			<p>Capital {country.capital}</p>
			<p>Area {country.area}</p>
			<h2>Languages</h2>
			<ul>
				{langs.map((l) => (
					<li key={l}>{l}</li>
				))}
			</ul>
			<img
				style={{ maxWidth: "100%" }}
				src={country.flags.svg}
				alt={country.flags.alt}
			/>
			<Weather country={country} />
		</>
	);
};

const SearchResults = (props) => {
	const { countries, setShown } = props;

	if (!countries || countries.length === 0) return "No results found";

	if (countries.length > 10)
		return "Too many matches. Narrow down the search.";
	else if (countries.length > 1)
		return (
			<>
				{countries.map((c) => (
					<p key={c.name.common}>
						{c.name.common}{" "}
						<button onClick={() => setShown(c)}>show</button>
					</p>
				))}
			</>
		);
};

const App = () => {
	const [search, setSearch] = useState("");
	const [countries, setCountries] = useState(null);
	const [results, setResults] = useState(null);
	const [shownCountry, setShownCountry] = useState(null);

	useEffect(() => {
		axios.get(ALL_COUNTRIES).then((res) => {
			setCountries(res.data);
		});
	}, []);

	const onSearch = (e) => {
		setSearch(e.target.value);

		const filtered = countries
			? countries.filter((c) =>
					c.name.common
						.toLowerCase()
						.includes(e.target.value.toLowerCase())
				)
			: null;

		setResults(filtered);
		console.log(filtered);
		if (filtered && filtered.length === 1) setShownCountry(filtered[0]);
		else setShownCountry(null);
	};

	return (
		<>
			<SearchBox search={search} onSearch={onSearch} />
			<SearchResults countries={results} setShown={setShownCountry} />
			<Country country={shownCountry} />
		</>
	);
};

export default App;
