import { useState } from "react";
import { PersonForm } from "./components/PersonForm";
import { Numbers } from "./components/Numbers";
import { Filter } from "./components/Filter";

const App = () => {
	const [persons, setPersons] = useState([
		{ name: "Arto Hellas", num: "040-123456", id: 1 },
		{ name: "Ada Lovelace", num: "39-44-5323523", id: 2 },
		{ name: "Dan Abramov", num: "12-43-234345", id: 3 },
		{ name: "Mary Poppendieck", num: "39-23-6423122", id: 4 },
	]);

	const [filterText, setFilterText] = useState("");

	const shownPersons = persons.filter((p) =>
		p.name.toLowerCase().includes(filterText.toLowerCase())
	);

	return (
		<div>
			<h2>Filter</h2>
			<Filter filterText={filterText} setFilterText={setFilterText} />
			<h2>Phonebook</h2>
			<PersonForm persons={persons} setPersons={setPersons} />
			<h2>Numbers</h2>
			<Numbers persons={shownPersons} />
		</div>
	);
};

export default App;
