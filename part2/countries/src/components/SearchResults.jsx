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

export default SearchResults;
