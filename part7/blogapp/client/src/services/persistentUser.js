import blogService from "./blogs";

const getUser = () => {
	const loggedUserJSON = window.localStorage.getItem("loggedBlogUser");

	if (loggedUserJSON) {
		const user = JSON.parse(loggedUserJSON);
		blogService.setToken(user.token);
		return user;
	}
};
const saveUser = (user) => {
	window.localStorage.setItem("loggedBlogUser", JSON.stringify(user));
};

const removeUser = () => {
	window.localStorage.removeItem("loggedBlogUser");
};

export default { getUser, saveUser, removeUser };
