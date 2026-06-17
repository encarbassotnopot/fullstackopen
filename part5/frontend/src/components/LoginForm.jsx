import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ loginUser }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleLogin = async (event) => {
		event.preventDefault();

		const status = await loginUser(username, password);
		if (status === "ok") navigate("/");
	};

	return (
		<div>
			<h2>Log in to application</h2>
			<form onSubmit={handleLogin}>
				<div>
					<label>
						username
						<input
							type="text"
							value={username}
							onChange={({ target }) => setUsername(target.value)}
						/>
					</label>
				</div>
				<div>
					<label>
						password
						<input
							type="password"
							value={password}
							onChange={({ target }) => setPassword(target.value)}
						/>
					</label>
				</div>
				<button type="submit">login</button>
			</form>
		</div>
	);
};

export default LoginForm;
