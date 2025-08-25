const TopAnecdote = ({ anecdote, votes }) => {
	return (
		<div>
			<h1>Top-voted anecdote</h1>
			{anecdote}
			<br />
			<br />
			This anecdote has {votes} votes.
		</div>
	);
};

export default TopAnecdote;
