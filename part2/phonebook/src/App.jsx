import { useState, useEffect } from "react";
import PersonForm from "./components/PersonForm";
import Numbers from "./components/Numbers";
import Filter from "./components/Filter";
import { getAll } from "./services/phonebookService";

const App = () => {
	const [persons, setPersons] = useState([]);
	const [filterText, setFilterText] = useState("");

	useEffect(() => {
		getAll().then((p) => setPersons(p));
	}, []);

	return (
		<div>
			<h2>Filter</h2>
			<Filter filterText={filterText} setFilterText={setFilterText} />
			<h2>Phonebook</h2>
			<PersonForm persons={persons} setPersons={setPersons} />
			<h2>Numbers</h2>
			<Numbers
				filterText={filterText}
				persons={persons}
				setPersons={setPersons}
			/>
		</div>
	);
};

export default App;
