import { useEffect } from "react";
import useNotification from "../hooks/useNotification";

const Notification = () => {
	const style = {
		border: "solid",
		padding: 10,
		borderWidth: 1,
		marginBottom: 5,
	};

	const { notification, setNotification } = useNotification();

	useEffect(() => {
		if (!notification) return;
		const timeout = setTimeout(() => setNotification(null), 5000);
		return () => clearTimeout(timeout);
	}, [notification, setNotification]);

	if (!notification) return;

	return <div style={style}>{notification}</div>;
};

export default Notification;
