import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import anecdoteService from "./services/anecdotes";

const useAnecdoteStore = create((set, get) => ({
	anecdotes: [],
	filter: "",
	actions: {
		vote: async (id) => {
			const anecdote = get().anecdotes.find((a) => a.id === id);

			const updated = await anecdoteService.update(id, {
				...anecdote,
				votes: anecdote.votes + 1,
			});

			set((state) => ({
				anecdotes: state.anecdotes.map((a) =>
					a.id === id ? updated : a
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
