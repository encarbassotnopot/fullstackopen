import { useAnecdotes, useAnecdoteActions } from "../stores/anecdoteStore";
import { useNotificationAction } from "../stores/notificationStore";

const AnecdoteList = () => {
	const anecdotes = useAnecdotes();
	const { vote } = useAnecdoteActions();
	const notify = useNotificationAction();

	const handleVote = (anecdote) => {
		vote(anecdote);
		notify(`You voted '${anecdote.content}'`);
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
						</div>
					</div>
				))}
		</div>
	);
};

export default AnecdoteList;
