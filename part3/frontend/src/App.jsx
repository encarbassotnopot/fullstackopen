import { useState, useEffect } from "react";
import PersonForm from "./components/PersonForm";
import Numbers from "./components/Numbers";
import Filter from "./components/Filter";
import Notification from "./components/Notification";
import { getAll } from "./services/personService";

const App = () => {
	const [persons, setPersons] = useState(null);
	const [notification, setNotification] = useState(null);
	const [filterText, setFilterText] = useState("");

	useEffect(() => {
		getAll().then((p) => setPersons(p));
	}, []);

	const notify = (text, type) => {
		setNotification({ text, type });
	};

	useEffect(() => {
		if (!notification) return;
		const timeout = setTimeout(() => setNotification(null), 5000);
		return () => clearTimeout(timeout);
	}, [notification]);

	return (
		<div>
			<h2>Filter</h2>
			<Notification content={notification} />
			<Filter filterText={filterText} setFilterText={setFilterText} />
			<h2>Phonebook</h2>
			<PersonForm
				persons={persons}
				setPersons={setPersons}
				notify={notify}
			/>
			<h2>Numbers</h2>
			<Numbers
				filterText={filterText}
				persons={persons}
				setPersons={setPersons}
				notify={notify}
			/>
		</div>
	);
};

export default App;
