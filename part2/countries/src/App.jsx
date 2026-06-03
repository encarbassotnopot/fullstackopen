import { useState, useEffect } from "react";
import axios from "axios";
import Country from "./components/Country";
import SearchResults from "./components/SearchResults";

const ALL_COUNTRIES = "https://studies.cs.helsinki.fi/restcountries/api/all";

const SearchBox = (props) => {
	const { search, onSearch } = props;

	return (
		<>
			find countries <input value={search} onChange={onSearch} />
		</>
	);
};

export const App = () => {
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
