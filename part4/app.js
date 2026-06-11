const express = require("express");
const mongoose = require("mongoose");
const log = require("./utils/logger");
const config = require("./utils/config");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const middleware = require("./utils/middleware");

const app = express();

mongoose
	.connect(config.MONGO_URI, { family: 4 })
	.catch((e) => log.error("error connection to MongoDB:", e.message));

app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
