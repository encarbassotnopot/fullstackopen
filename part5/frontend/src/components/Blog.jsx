const Blog = ({ user, blog, handleLike, handleDelete }) => {
	const deleteButton = () => {
		if (user?.id === blog.user.id)
			return <button onClick={() => handleDelete(blog)}>remove</button>;
	};

	if (!blog) return null;

	return (
		<div>
			<h2>
				{blog.author}: {blog.title}
			</h2>
			<div>
				<a href={blog.url}>{blog.url}</a>
			</div>
			<div>
				Likes {blog.likes}{" "}
				{user && <button onClick={() => handleLike(blog)}>like</button>}
			</div>
			<div>Added By {blog.user.name}</div>
			<div>{deleteButton()}</div>
		</div>
	);
};
export default Blog;
