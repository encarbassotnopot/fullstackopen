import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import anecdoteService from "../services/anecdotes";

const useAnecdoteStore = create((set) => ({
	anecdotes: [],
	filter: "",
	actions: {
		vote: async (anecdote) => {
			const updated = await anecdoteService.update(anecdote.id, {
				...anecdote,
				votes: anecdote.votes + 1,
			});

			set((state) => ({
				anecdotes: state.anecdotes.map((a) =>
					a.id === anecdote.id ? updated : a
				),
			}));
		},

		create: async (content) => {
			const anecdote = await anecdoteService.createNew(content);

			set((state) => ({
				anecdotes: state.anecdotes.concat(anecdote),
			}));
		},

		updateFilter: (text) =>
			set(() => ({
				filter: text,
			})),

		initialize: async () => {
			const anecdotes = await anecdoteService.getAll();
			set(() => ({ anecdotes }));
		},
	},
}));

export const useAnecdotes = () =>
	useAnecdoteStore(
		useShallow(({ anecdotes, filter }) =>
			anecdotes.filter((a) => a.content.includes(filter))
		)
	);
export const useAnecdoteActions = () =>
	useAnecdoteStore((state) => state.actions);
