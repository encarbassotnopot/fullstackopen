import { getAll, createNew, update } from "../services/anecdotes";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useAnecdote = () => {
	const queryClient = useQueryClient();

	const result = useQuery({
		queryKey: ["anecdotes"],
		queryFn: getAll,
		refetchOnWindowFocus: false,
	});

	const newAnecdoteMutation = useMutation({
		mutationFn: createNew,
		onSuccess: (newAnecdote) => {
			const anecdotes = queryClient.getQueryData(["anecdotes"]);
			queryClient.setQueryData(
				["anecdotes"],
				anecdotes.concat(newAnecdote)
			);
		},
	});

	const updateAnecdoteMutation = useMutation({
		mutationFn: update,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
		},
	});

	return {
		anecdotes: result.data,
		isPending: result.isPending,
		isError: result.isError,
		addAnecdote: (content) =>
			newAnecdoteMutation.mutate({ content, votes: 0 }),
		vote: (anecdote) =>
			updateAnecdoteMutation.mutate({
				...anecdote,
				votes: anecdote.votes + 1,
			}),
	};
};
