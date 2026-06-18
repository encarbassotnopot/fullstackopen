import { useAnecdoteActions } from "../store";

const Filter = () => {
	const { updateFilter } = useAnecdoteActions();

	const handleChange = (e) => updateFilter(e.target.value);

	const style = {
		marginBottom: 10,
	};

	return (
		<div style={style}>
			filter <input onChange={handleChange} />
		</div>
	);
};

export default Filter;
