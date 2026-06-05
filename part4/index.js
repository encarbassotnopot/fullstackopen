require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const log = require("./utils/logger");
const blogsRouter = require("./controllers/blogs");

const app = express();

mongoose
	.connect(process.env.MONGO_URI, { family: 4 })
	.catch((e) => log.e("error connection to MongoDB:", error.message));

app.use(express.json());
app.use("/api/blogs", blogsRouter);

const PORT = 3003;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
