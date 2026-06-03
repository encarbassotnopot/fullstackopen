const Filter = (props) => {
	const { filterText, setFilterText } = props;

	const handleFilterChange = (event) => {
		setFilterText(event.target.value);
	};

	return (
		<div>
			filter shown with:{" "}
			<input value={filterText} onChange={handleFilterChange} />
		</div>
	);
};

export default Filter;
