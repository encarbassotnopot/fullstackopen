import Blog from "./Blog";
import { Link } from "react-router-dom";
{
	/* <Blog
						key={blog.id}
						user={user}
						blog={blog}
						handleLike={handleLike}
						handleDelete={handleDelete}
					/> */
}
const BlogList = ({ blogs }) => {
	return (
		<>
			<h2>blogs</h2>
			<ul>
				{blogs
					.sort((a, b) => b.likes - a.likes)
					.map((blog) => (
						<li key={blog.id}>
							<Link to={`/blogs/${blog.id}`}>
								{blog.title} by {blog.author}
							</Link>
						</li>
					))}
			</ul>
		</>
	);
};

export default BlogList;
