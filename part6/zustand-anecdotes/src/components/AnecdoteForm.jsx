import { useAnecdoteActions } from "../store";

const AnecdoteForm = () => {
	const { create } = useAnecdoteActions();

	const handleCreate = async (e) => {
		e.preventDefault();
		const content = e.target.anecdote.value;
		await create(content);
		e.target.reset();
	};

	return (
		<div>
			<h2>create new</h2>
			<form onSubmit={handleCreate}>
				<div>
					<input name="anecdote" />
				</div>
				<button>create</button>
			</form>
		</div>
	);
};

export default AnecdoteForm;
