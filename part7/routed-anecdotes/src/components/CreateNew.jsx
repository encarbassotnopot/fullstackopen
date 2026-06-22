import { useField } from "../hooks";
import { useNavigate } from "react-router-dom";

const CreateNew = ({ addAnecdote }) => {
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

	return (
		<div>
			<h2>create a new anecdote</h2>
			<form onSubmit={handleSubmit}>
				<div>
					content
					<input
						name="content"
						value={content.value}
						type={content.type}
						onChange={content.onChange}
					/>
				</div>
				<div>
					author
					<input
						name="author"
						value={author.value}
						type={author.type}
						onChange={author.onChange}
					/>
				</div>
				<div>
					url for more info
					<input
						name="info"
						value={info.value}
						type={info.type}
						onChange={info.onChange}
					/>
				</div>
				<button>create</button>
			</form>
		</div>
	);
};

export default CreateNew;
