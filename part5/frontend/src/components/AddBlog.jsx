import { useState } from "react";
import blogService from "../services/blogs";

const AddBlog = ({ setNotification, setBlogs }) => {
	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [url, setUrl] = useState("");

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const newBlog = await blogService.create({ title, author, url });
			console.log(newBlog);
			setTitle("");
			setAuthor("");
			setUrl("");

			setBlogs((blogs) => blogs.concat(newBlog));

			setNotification({
				type: "ok",
				text: `a new blog ${newBlog.title} by ${newBlog.author} added`,
			});
		} catch {
			setNotification({ type: "error", text: "cannot add entry" });
		}
	};

	return (
		<>
			<h2>add new</h2>
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
		</>
	);
};

export default AddBlog;
