import { deleteEntry } from "../services/phonebookService";

const Person = (props) => {
	const { name, num, id } = props.person;
	const { handleClick } = props;

	return (
		<li>
			{name} - {num} <button onClick={handleClick}>delete</button>
		</li>
	);
};

export const Numbers = (props) => {
	const { persons, setPersons, filterText } = props;
	const shownPersons = persons.filter((p) =>
		p.name.toLowerCase().includes(filterText.toLowerCase())
	);

	const handleDelete = (p) => () => {
		if (confirm(`do you wanna delete ${p.name}?`))
			deleteEntry(p.id)
				.then(setPersons(persons.filter((per) => per.id !== p.id)))
				.catch(() => alert(`${p.name} has already deleted`));
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
