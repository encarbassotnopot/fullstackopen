const logger = require("./logger");

const requestLogger = (req, res, next) => {
	logger.info("---");
	logger.info("Method:", req.method);
	logger.info("Path:  ", req.path);
	if (req.body) logger.info("Body:  ", req.body);
	next();
};
const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (err, req, res, next) => {
	logger.error("---");
	logger.error("Method:", req.method);
	logger.error("Path:  ", req.path);
	if (req.body) logger.error("Body:  ", req.body);

	logger.error(err.message);

	if (err.name === "CastError")
		return res.status(400).json({ error: "malformatted id" });
	else if (err.name === "ValidationError")
		return res.status(400).json({ error: err.message });
	else if (err.name === "SyntaxError")
		return res.status(400).json({ error: err.message });
	else if (
		err.name === "MongoServerError" &&
		err.message.includes("E11000 duplicate key error")
	)
		return res.status(400).json({ error: "username must be unique" });
	else if (err.name === "JsonWebTokenError")
		return res.status(401).json({ error: "token invalid" });

	next(err);
};

module.exports = {
	requestLogger,
	unknownEndpoint,
	errorHandler,
};
