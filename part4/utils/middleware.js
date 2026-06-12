const logger = require("./logger");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

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
	else if (err.name === "TokenExpiredError")
		return res.status(401).json({
			error: "token expired",
		});

	next(err);
};

const tokenExtractor = (req, res, next) => {
	const authorization = req.get("authorization");
	if (authorization && authorization.startsWith("Bearer "))
		req.token = authorization.replace("Bearer ", "");

	next();
};

const userExtractor = async (req, res, next) => {
	const decodedToken = jwt.verify(req.token, process.env.SECRET);
	if (!decodedToken.id)
		return res.status(401).json({ error: "token invalid" });

	req.user = await User.findById(decodedToken.id);
	if (!req.user)
		return res.status(400).json({ error: "UserId missing or not valid" });

	next();
};

module.exports = {
	requestLogger,
	unknownEndpoint,
	errorHandler,
	tokenExtractor,
	userExtractor,
};
