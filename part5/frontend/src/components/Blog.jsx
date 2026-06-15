import { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ user, blog, setBlogs, setNotification }) => {
	const [hidden, setHidden] = useState(true);
	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: "solid",
		borderWidth: 1,
		marginBottom: 5,
	};

	const willHideStyle = {
		display: hidden ? "none" : "",
	};

	const handleLike = async () => {
		const updBlog = { ...blog, likes: blog.likes + 1 };
		try {
			const res = await blogService.update(updBlog);
			setBlogs((blogs) =>
				blogs.map((b) => {
					if (b.id !== blog.id) return b;
					else return res;
				})
			);
		} catch {
			setNotification({ type: "error", text: "could not like post" });
		}
	};

	const handleDelete = async () => {
		if (confirm(`Delete ${blog.title} by ${blog.author}?`))
			try {
				await blogService.deleteBlog(blog.id);
				setBlogs((blogs) => blogs.filter((b) => b.id !== blog.id));
			} catch {
				setNotification({
					type: "error",
					text: "could not delete post",
				});
			}
	};

	const deleteButton = () => {
		if (user.id === blog.user.id)
			return <button onClick={handleDelete}>remove</button>;
	};

	return (
		<div style={blogStyle}>
			{blog.title} {blog.author}{" "}
			<button onClick={() => setHidden((value) => !value)}>view</button>
			<div style={willHideStyle}>
				<div>{blog.url}</div>
				<div>
					Likes {blog.likes}{" "}
					<button onClick={handleLike}>like</button>
				</div>
				<div>{blog.user.name}</div>
				{deleteButton()}
			</div>
		</div>
	);
};
export default Blog;
