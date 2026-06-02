const Person = (props) => {
	const { name, num } = props.person;

	return (
		<li>
			{name} - {num}
		</li>
	);
};

export const Numbers = (props) => {
	const { persons } = props;

	return (
		<ul>
			{persons.map((p) => (
				<Person person={p} key={p.id} />
			))}
		</ul>
	);
};
