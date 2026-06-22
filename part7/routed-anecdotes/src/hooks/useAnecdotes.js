import { useEffect, useState } from "react";
import anecdoteService from "../services/anecdotes";

export const useAnecdotes = () => {
	const [anecdotes, setAnecdotes] = useState([]);

	useEffect(() => {
		anecdoteService.getAll().then((a) => setAnecdotes(a));
	}, []);

	const addAnecdote = (anecdote) => {
		anecdoteService
			.createNew(anecdote)
			.then((a) => setAnecdotes(anecdotes.concat(a)));
	};

	const deleteAnecdote = (id) => {
		anecdoteService
			.deleteAnecdote(id)
			.then(() => setAnecdotes(anecdotes.filter((a) => a.id !== id)));
	};

	return { anecdotes, addAnecdote, deleteAnecdote };
};
