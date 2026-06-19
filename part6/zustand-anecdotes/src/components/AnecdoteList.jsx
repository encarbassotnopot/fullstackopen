import { useAnecdotes, useAnecdoteActions } from "../stores/anecdoteStore";
import { useNotificationAction } from "../stores/notificationStore";

const AnecdoteList = () => {
	const anecdotes = useAnecdotes();
	const { vote, remove } = useAnecdoteActions();
	const notify = useNotificationAction();

	const handleVote = (anecdote) => {
		vote(anecdote);
		notify(`You voted '${anecdote.content}'`);
	};

	const handleDelete = (anecdote) => {
		remove(anecdote);
		notify(`You deleted '${anecdote.content}'`);
	};

	return (
		<div>
			{anecdotes
				.toSorted((a, b) => b.votes - a.votes)
				.map((anecdote) => (
					<div key={anecdote.id}>
						<div>{anecdote.content}</div>
						<div>
							has {anecdote.votes}
							<button onClick={() => handleVote(anecdote)}>
								vote
							</button>
							{anecdote.votes === 0 && (
								<button onClick={() => handleDelete(anecdote)}>
									delete
								</button>
							)}
						</div>
					</div>
				))}
		</div>
	);
};

export default AnecdoteList;
