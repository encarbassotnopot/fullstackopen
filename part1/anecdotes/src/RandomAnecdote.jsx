const RandomAnecdote = ({ anecdote, votes, getRandomAnecdote, handleVote }) => {
	return (
		<div>
			<h1>Anecdote of the day</h1>
			{anecdote}
			<br />
			<br />
			This anecdote has {votes} votes.
			<br />
			<br />
			<button onClick={getRandomAnecdote}>Get Random Anecdote</button>
			<button onClick={handleVote}>Vote for this Anecdote</button>
		</div>
	);
};

export default RandomAnecdote;
