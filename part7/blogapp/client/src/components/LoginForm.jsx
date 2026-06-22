import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography } from "@mui/material";

const LoginForm = ({ loginUser }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleLogin = async (event) => {
		event.preventDefault();

		const status = await loginUser(username, password);
		if (status === "ok") navigate("/");
	};

	const style = { marginTop: 5, marginBottom: 5 };

	return (
		<div>
			<Typography variant="h2" sx={{ fontSize: 30 }}>
				Log in to application
			</Typography>
			<form onSubmit={handleLogin}>
				<div>
					<TextField
						type="text"
						label="username"
						value={username}
						style={style}
						variant="standard"
						onChange={({ target }) => setUsername(target.value)}
					/>
				</div>
				<div>
					<TextField
						type="password"
						label="password"
						value={password}
						style={style}
						variant="standard"
						onChange={({ target }) => setPassword(target.value)}
					/>
				</div>
				<Button type="submit" variant="contained" style={style}>
					login
				</Button>
			</form>
		</div>
	);
};

export default LoginForm;
