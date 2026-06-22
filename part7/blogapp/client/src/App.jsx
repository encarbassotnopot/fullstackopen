import { useState, useEffect } from "react";
import BlogList from "./components/BlogList";
import LoginForm from "./components/LoginForm";
import AddBlog from "./components/AddBlog";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";
import persistentService from "./services/persistentUser";
import { Routes, Route, Link, useNavigate, useMatch } from "react-router-dom";
import Blog from "./components/Blog";
import { AppBar, Container, Toolbar, Button, Typography } from "@mui/material";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [user, setUser] = useState(null);
	const [notification, setNotification] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		blogService.getAll().then((blogs) => setBlogs(blogs));
	}, []);

	useEffect(() => {
		if (!notification) return;
		const timeout = setTimeout(() => setNotification(null), 5000);
		return () => clearTimeout(timeout);
	}, [notification]);

	useEffect(() => {
		const user = persistentService.getUser();
		if (user) setUser(user);
	}, []);

	const match = useMatch("/blogs/:id");
	const blog = match ? blogs.find((b) => b.id === match.params.id) : null;

	const handleLogin = async (username, password) => {
		try {
			const user = await loginService.login({ username, password });
			blogService.setToken(user.token);
			persistentService.saveUser(user);

			setUser(user);
			return "ok";
		} catch {
			setNotification({ type: "error", text: "wrong credentials" });
			return "ko";
		}
	};

	const handleLogout = () => {
		persistentService.removeUser("loggedBlogUser");
		setUser(null);
		navigate("/");
	};

	const createBlog = async (blog) => {
		try {
			const newBlog = await blogService.create(blog);

			setBlogs((blogs) => blogs.concat(newBlog));

			setNotification({
				type: "ok",
				text: `a new blog ${newBlog.title} by ${newBlog.author} added`,
			});
		} catch {
			setNotification({ type: "error", text: "cannot add entry" });
		}
		navigate("/");
	};

	const handleLike = async (blog) => {
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

	const handleDelete = async (blog) => {
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
		navigate("/");
	};

	const style = { "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } };

	return (
		<Container>
			<AppBar position="static">
				<Toolbar>
					<Typography
						variant="h6"
						component="div"
						sx={{ flexGrow: 1 }}
					>
						BlogApp
					</Typography>
					<Button color="inherit" component={Link} to="/" sx={style}>
						blogs
					</Button>
					{user && (
						<Button
							color="inherit"
							component={Link}
							to="/create"
							sx={style}
						>
							new blog
						</Button>
					)}
					{user ? (
						<Button
							color="inherit"
							component={Link}
							onClick={handleLogout}
							sx={style}
						>
							logout
						</Button>
					) : (
						<Button
							color="inherit"
							component={Link}
							to="/login"
							sx={style}
						>
							login
						</Button>
					)}
				</Toolbar>
			</AppBar>

			<Notification content={notification} />
			<Routes>
				<Route
					path="/"
					element={
						<ErrorBoundary>
							<BlogList blogs={blogs} />
						</ErrorBoundary>
					}
				/>
				<Route
					path="/blogs/:id"
					element={
						<Blog
							blog={blog}
							user={user}
							handleLike={handleLike}
							handleDelete={handleDelete}
						/>
					}
				/>
				<Route
					path="/create"
					element={
						<ErrorBoundary>
							<AddBlog createBlog={createBlog} />
						</ErrorBoundary>
					}
				/>
				<Route
					path="/login"
					element={
						<ErrorBoundary>
							<LoginForm loginUser={handleLogin} />
						</ErrorBoundary>
					}
				/>
				<Route path="*" element={<h2>route not found</h2>} />
			</Routes>
		</Container>
	);
};

export default App;
