import Blog from "./Blog";

const BlogList = ({ blogs, user, handleDelete, handleLike }) => {
	return (
		<>
			<h2>blogs</h2>
			{blogs
				.sort((a, b) => b.likes - a.likes)
				.map((blog) => (
					<Blog
						key={blog.id}
						user={user}
						blog={blog}
						handleLike={handleLike}
						handleDelete={handleDelete}
					/>
				))}
		</>
	);
};

export default BlogList;
