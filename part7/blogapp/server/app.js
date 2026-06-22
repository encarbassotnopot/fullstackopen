const express = require("express");
const mongoose = require("mongoose");
const log = require("./utils/logger");
const config = require("./utils/config");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const middleware = require("./utils/middleware");
const path = require("path");

const app = express();

mongoose
	.connect(config.MONGO_URI, { family: 4 })
	.catch((e) => log.error("error connection to MongoDB:", e.message));

app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

if (process.env.NODE_ENV === "test") {
	const testingRouter = require("./controllers/testing");
	app.use("/api/testing", testingRouter);
}

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

// serve the built Vite frontend in production
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../client/dist")));
	app.get("/*splat", (req, res) => {
		res.sendFile(path.join(__dirname, "../client/dist/index.html"));
	});
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
