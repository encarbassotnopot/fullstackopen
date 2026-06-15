const Notification = ({ content }) => {
	if (!content) return null;
	return <div className={`notification ${content.type}`}>{content.text}</div>;
};

export default Notification;
