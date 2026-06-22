import { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";

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

	const style = { marginTop: 5, marginBottom: 5 };

	return (
		<div>
			<Typography variant="h2" sx={{ fontSize: 30 }}>
				add new blog
			</Typography>
			<form onSubmit={handleSubmit}>
				<div>
					<TextField
						type="text"
						style={style}
						value={title}
						label="title"
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>
				<div>
					<TextField
						type="text"
						style={style}
						label="author"
						value={author}
						onChange={(e) => setAuthor(e.target.value)}
					/>
				</div>
				<div>
					<TextField
						type="text"
						style={style}
						label="url"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
					/>
				</div>
				<Button type="submit" variant="contained" style={style}>
					create
				</Button>
			</form>
		</div>
	);
};

export default AddBlog;
