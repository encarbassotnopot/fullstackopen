import { useAnecdoteActions } from "../stores/anecdoteStore";
import { useNotificationAction } from "../stores/notificationStore";

const AnecdoteForm = () => {
	const { create } = useAnecdoteActions();
	const notify = useNotificationAction();

	const handleCreate = async (e) => {
		e.preventDefault();
		const content = e.target.anecdote.value;
		await create(content);
		notify(`You created '${content}'`);
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
