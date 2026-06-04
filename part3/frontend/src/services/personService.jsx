import axios from "axios";

const baseUrl = "/api/persons";

const getAll = () => {
	const request = axios.get(baseUrl);
	return request.then((response) => response.data);
};

const addEntry = (newEntry) => {
	const request = axios.post(baseUrl, newEntry);
	return request.then((response) => response.data);
};

const updateEntry = (updEntry) => {
	const request = axios.put(`${baseUrl}/${updEntry.id}`, updEntry);
	return request.then((response) => response.data);
};

const deleteEntry = (id) => {
	const request = axios.delete(`${baseUrl}/${id}`);
	return request.then((response) => response.data);
};

export { getAll, addEntry, updateEntry, deleteEntry };
