import { useState } from "react";

const Blog = ({ user, blog, handleLike, handleDelete }) => {
	const [hidden, setHidden] = useState(true);
	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: "solid",
		borderWidth: 1,
		marginBottom: 5,
	};

	const deleteButton = () => {
		if (user?.id === blog.user.id)
			return <button onClick={() => handleDelete(blog)}>remove</button>;
	};

	const moreDetails = () => {
		if (!hidden)
			return (
				<div>
					<div>{blog.url}</div>
					<div>
						Likes {blog.likes}{" "}
						<button onClick={() => handleLike(blog)}>like</button>
					</div>
					<div>{blog.user.name}</div>
					{deleteButton()}
				</div>
			);
	};

	return (
		<div style={blogStyle} className="blog-item">
			{blog.title} {blog.author}{" "}
			<button onClick={() => setHidden((value) => !value)}>view</button>
			{moreDetails()}
		</div>
	);
};
export default Blog;
