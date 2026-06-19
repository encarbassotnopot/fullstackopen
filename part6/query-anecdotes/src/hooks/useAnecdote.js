import { getAll, createNew, update } from "../services/anecdotes";
import useNotification from "../hooks/useNotification";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useAnecdote = () => {
	const queryClient = useQueryClient();
	const { setNotification } = useNotification();

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
			setNotification(`anecdote ${newAnecdote.content} created`);
		},
		onError: () =>
			setNotification(
				"error creating anecdote. minimum length 5 characters"
			),
	});

	const updateAnecdoteMutation = useMutation({
		mutationFn: update,
		onSuccess: (anecdote) => {
			queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
			setNotification(`anecdote '${anecdote.content}' voted`);
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
