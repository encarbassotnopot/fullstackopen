import { Alert } from "@mui/material";

const Notification = ({ content }) => {
	if (!content) return null;
	const severity = content.type === "ok" ? "success" : "error";
	return <Alert severity={severity}>{content.text}</Alert>;
};

export default Notification;
