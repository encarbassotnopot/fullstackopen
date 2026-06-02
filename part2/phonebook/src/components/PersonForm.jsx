import { useState } from "react";

export const PersonForm = (props) => {
	const { persons, setPersons } = props;
	const [newName, setNewName] = useState("");
	const [newNum, setNewNum] = useState("");

	const handleNameChange = (event) => {
		setNewName(event.target.value);
	};
	const handleNumChange = (event) => {
		setNewNum(event.target.value);
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		if (persons.some((p) => p.name === newName))
			alert(`${newName} is already added to phonebook`);
		else {
			const newPerson = {
				name: newName,
				num: newNum,
				id: persons.length + 1,
			};

			setPersons(persons.concat(newPerson));
		}
		setNewName("");
		setNewNum("");
	};

	return (
		<form onSubmit={handleSubmit}>
			<div>
				name: <input value={newName} onChange={handleNameChange} />
			</div>
			<div>
				number: <input value={newNum} onChange={handleNumChange} />
			</div>
			<div>
				<button type="submit">add</button>
			</div>
		</form>
	);
};
