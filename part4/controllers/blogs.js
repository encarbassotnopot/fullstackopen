const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (req, res) => {
	const blogs = await Blog.find({});
	res.json(blogs);
});

blogsRouter.post("/", async (req, res) => {
	const blog = new Blog(req.body);

	const result = await blog.save();
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
