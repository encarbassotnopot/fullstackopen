import { useState, useEffect } from "react";
import BlogList from "./components/BlogList";
import LoginForm from "./components/LoginForm";
import AddBlog from "./components/AddBlog";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

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
		const loggedUserJSON = window.localStorage.getItem("loggedBlogUser");
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON);
			blogService.setToken(user.token);
			setUser(user);
		}
	}, []);

	const handleLogin = async (username, password) => {
		try {
			const user = await loginService.login({ username, password });
			blogService.setToken(user.token);
			window.localStorage.setItem("loggedBlogUser", JSON.stringify(user));

			setUser(user);
			return "ok";
		} catch {
			setNotification({ type: "error", text: "wrong credentials" });
			return "ko";
		}
	};

	const handleLogout = () => {
		window.localStorage.removeItem("loggedBlogUser");
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
	};

	const padding = {
		padding: 5,
	};

	return (
		<>
			<div>
				<Link style={padding} to="/">
					blogs
				</Link>
				{/* <Link style={padding} to="/create">
					new blog
				</Link> */}
				{user ? (
					<button onClick={handleLogout}>logout</button>
				) : (
					<Link style={padding} to="/login">
						login
					</Link>
				)}
			</div>

			<Notification content={notification} />
			<Routes>
				<Route
					path="/"
					element={
						<BlogList
							user={user}
							blogs={blogs}
							handleLike={handleLike}
							handleDelete={handleDelete}
						/>
					}
				/>
				<Route
					path="/create"
					element={<AddBlog createBlog={createBlog} />}
				/>
				<Route
					path="/login"
					element={<LoginForm loginUser={handleLogin} />}
				/>
			</Routes>
		</>
	);
};

export default App;
