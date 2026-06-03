const Notification = (props) => {
	const { content } = props;
	if (!content) return null;
	return <div className={`notification ${content.type}`}>{content.text}</div>;
};

export default Notification;
