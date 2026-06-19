const baseUrl = "http://localhost:3001/anecdotes";

export const getAll = async () => {
	const response = await fetch(baseUrl);

	if (!response.ok) {
		throw new Error("Failed to fetch anecdote");
	}

	const data = await response.json();
	return data;
};

export const createNew = async (anecdote) => {
	const options = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(anecdote),
	};

	const response = await fetch(baseUrl, options);

	if (!response.ok) {
		throw new Error("Failed to create anecdote");
	}

	return await response.json();
};

export const update = async (anecdote) => {
	const response = await fetch(`${baseUrl}/${anecdote.id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(anecdote),
	});

	if (!response.ok) {
		throw new Error("Failed to update anecdote");
	}

	return await response.json();
};

export const remove = async (id) => {
	const response = await fetch(`${baseUrl}/${id}`, {
		method: "DELETE",
	});

	if (!response.ok) {
		throw new Error("Failed to delete anecdote");
	}

	return await response.json();
};
