import useField from "../hooks/useField";
import { useNavigate } from "react-router-dom";
import { useAnecdotes } from "../hooks/useAnecdotes";

const CreateNew = () => {
	const { addAnecdote } = useAnecdotes();

	const content = useField("text");
	const author = useField("text");
	const info = useField("text");
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();
		addAnecdote({
			content: content.value,
			author: author.value,
			info: info.value,
			votes: 0,
		});
		navigate("/");
	};

	const handleReset = (e) => {
		e.preventDefault();
		content.onReset();
		author.onReset();
		info.onReset();
	};

	return (
		<div>
			<h2>create a new anecdote</h2>
			<form onSubmit={handleSubmit}>
				<div>
					content
					<input name="content" {...content} />
				</div>
				<div>
					author
					<input name="author" {...author} />
				</div>
				<div>
					url for more info
					<input name="info" {...info} />
				</div>
				<button>create</button>
				<button onClick={(e) => handleReset(e)}>reset</button>
			</form>
		</div>
	);
};

export default CreateNew;
