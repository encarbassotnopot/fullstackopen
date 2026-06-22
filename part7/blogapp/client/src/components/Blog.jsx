import {
	Button,
	Card,
	CardContent,
	CardActions,
	Typography,
	Link,
} from "@mui/material";

const Blog = ({ user, blog, handleLike, handleDelete }) => {
	if (!blog) return null;

	return (
		<Card style={{ marginTop: 20, padding: 10 }}>
			<CardContent>
				<Typography variant="h2" sx={{ fontSize: 30 }}>
					{blog.title}
				</Typography>
				<Typography sx={{ color: "text.secondary" }}>
					{blog.author}
				</Typography>
				<Link href={blog.url}>{blog.url}</Link>
				<Typography sx={{ color: "text.secondary" }}>
					Added by {blog.user.name}
				</Typography>
			</CardContent>
			<CardActions>
				<Typography>Likes {blog.likes}</Typography>
				{user && (
					<Button
						color="primary"
						variant="outlined"
						onClick={() => handleLike(blog)}
					>
						like
					</Button>
				)}
				{user?.id === blog.user.id && (
					<Button
						color="error"
						variant="outlined"
						onClick={() => handleDelete(blog)}
					>
						remove
					</Button>
				)}
			</CardActions>
		</Card>
	);
};
export default Blog;
