import { useState } from "react";
import { addEntry, updateEntry } from "../services/phonebookService";

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
		const newPerson = {
			name: newName,
			num: newNum,
		};

		if (persons.some((p) => p.name === newName)) {
			newPerson.id = persons.find((p) => p.name === newName).id;
			if (
				confirm(
					`${newName} is already added to phonebook. Do you want to update their phone number?`
				)
			) {
				updateEntry(newPerson).then((updEntry) =>
					setPersons(
						persons.map((p) =>
							p.id === updEntry.id ? updEntry : p
						)
					)
				);
			}
		} else
			addEntry(newPerson).then((newEntry) =>
				setPersons(persons.concat(newEntry))
			);

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

export default PersonForm;
