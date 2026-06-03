import Weather from "./Weather";

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

export default Country;
