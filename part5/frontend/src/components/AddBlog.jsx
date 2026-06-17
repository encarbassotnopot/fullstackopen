import { useState } from "react";

const AddBlog = ({ createBlog }) => {
	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [url, setUrl] = useState("");

	const handleSubmit = async (event) => {
		event.preventDefault();
		const newBlog = { title, author, url };
		await createBlog(newBlog);
		setTitle("");
		setAuthor("");
		setUrl("");
	};

	return (
		<div>
			<h2>add new blog</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label>
						title:
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
						/>
					</label>
				</div>
				<div>
					<label>
						author:
						<input
							type="text"
							value={author}
							onChange={(e) => setAuthor(e.target.value)}
						/>
					</label>
				</div>
				<div>
					<label>
						url:
						<input
							type="text"
							value={url}
							onChange={(e) => setUrl(e.target.value)}
						/>
					</label>
				</div>
				<button type="submit">create</button>
			</form>
		</div>
	);
};

export default AddBlog;
