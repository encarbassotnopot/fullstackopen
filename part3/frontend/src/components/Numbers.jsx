import { deleteEntry } from "../services/personService";

const Person = (props) => {
	const { name, number } = props.person;
	const { handleClick } = props;

	return (
		<li>
			{name} - {number} <button onClick={handleClick}>delete</button>
		</li>
	);
};

const Numbers = (props) => {
	const { persons, setPersons, filterText, notify } = props;

	if (!persons) return null;

	const shownPersons = persons.filter((p) =>
		p.name.toLowerCase().includes(filterText.toLowerCase())
	);

	const handleDelete = (toDelete) => () => {
		if (confirm(`do you wanna delete ${toDelete.name}?`))
			deleteEntry(toDelete.id)
				.then(() => {
					notify(`${toDelete.name} has been deleted`, "ok");
				})
				.catch((e) => notify(e.response.data.error, "error"))
				.finally(() =>
					setPersons(persons.filter((p) => p.id !== toDelete.id))
				);
	};

	return (
		<ul>
			{shownPersons.map((p) => (
				<Person person={p} key={p.id} handleClick={handleDelete(p)} />
			))}
		</ul>
	);
};

export default Numbers;
