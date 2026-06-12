const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (req, res) => {
	const blogs = await Blog.find({}).populate("user", {
		username: 1,
		name: 1,
	});

	res.json(blogs);
});

blogsRouter.post("/", async (req, res) => {
	const blog = new Blog(req.body);

	const decodedToken = jwt.verify(req.token, process.env.SECRET);
	if (!decodedToken.id)
		return res.status(401).json({ error: "token invalid" });

	const user = await User.findById(decodedToken.id);
	if (!user)
		return res.status(400).json({ error: "UserId missing or not valid" });

	blog.user = decodedToken.id;
	const result = await blog.save();

	user.blogs = user.blogs.concat(result._id);
	await user.save();

	res.status(201).json(result);
});

blogsRouter.put("/:id", async (req, res) => {
	const blog = await Blog.findById(req.params.id);

	if (!blog) return res.status(404).end();

	blog.title = req.body.title;
	blog.author = req.body.author;
	blog.url = req.body.url;
	blog.likes = req.body.likes;

	res.json(await blog.save());
});

blogsRouter.delete("/:id", async (req, res) => {
	await Blog.findByIdAndDelete(req.params.id);
	res.status(204).end();
});

module.exports = blogsRouter;
