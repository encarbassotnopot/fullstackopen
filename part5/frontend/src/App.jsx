import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import AddBlog from "./components/AddBlog";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [user, setUser] = useState(null);
	const [notification, setNotification] = useState(null);

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

	const handleLogin = async (event) => {
		event.preventDefault();
		try {
			const user = await loginService.login({ username, password });
			blogService.setToken(user.token);
			window.localStorage.setItem("loggedBlogUser", JSON.stringify(user));

			setUser(user);
			setUsername("");
			setPassword("");
		} catch {
			setNotification({ type: "error", text: "wrong credentials" });
		}
	};

	const handleLogout = () => {
		window.localStorage.removeItem("loggedBlogUser");
		setUser(null);
	};

	if (user === null) {
		return (
			<div>
				<Notification content={notification} />
				<h2>Log in to application</h2>
				<LoginForm
					username={username}
					setUsername={setUsername}
					password={password}
					setPassword={setPassword}
					handleLogin={handleLogin}
				/>
			</div>
		);
	}

	return (
		<div>
			<Notification content={notification} />
			<h2>blogs</h2>
			<p>
				{user.name} logged in{" "}
				<button onClick={handleLogout}>logout</button>
			</p>
			<AddBlog setNotification={setNotification} setBlogs={setBlogs} />
			{blogs
				.sort((a, b) => b.likes - a.likes)
				.map((blog) => (
					<Blog
						key={blog.id}
						user={user}
						blog={blog}
						setBlogs={setBlogs}
						setNotification={setNotification}
					/>
				))}
		</div>
	);
};

export default App;
