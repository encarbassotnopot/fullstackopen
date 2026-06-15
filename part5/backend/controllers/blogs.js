const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (req, res) => {
	const blogs = await Blog.find({}).populate("user", {
		username: 1,
		name: 1,
	});

	res.json(blogs);
});

blogsRouter.post("/", middleware.userExtractor, async (req, res) => {
	const blog = new Blog(req.body);

	blog.user = req.user.id;
	const result = await blog.save();

	req.user.blogs = req.user.blogs.concat(result._id);
	await req.user.save();

	res.status(201).json(
		await result.populate("user", {
			username: 1,
			name: 1,
		})
	);
});

blogsRouter.put("/:id", middleware.userExtractor, async (req, res) => {
	const blog = await Blog.findById(req.params.id);

	if (!blog) return res.status(404).end();
	if (blog.user.toString() !== req.user.id.toString())
		return res
			.status(401)
			.json({ error: "note not owned by logged in user" });

	blog.title = req.body.title;
	blog.author = req.body.author;
	blog.url = req.body.url;
	blog.likes = req.body.likes;

	await blog.save();

	res.json(
		await blog.populate("user", {
			username: 1,
			name: 1,
		})
	);
});

blogsRouter.delete("/:id", middleware.userExtractor, async (req, res) => {
	const blog = await Blog.findById(req.params.id);
	if (!blog) return res.status(204).end();
	if (blog.user.toString() !== req.user.id.toString())
		return res
			.status(401)
			.json({ error: "note not owned by logged in user" });

	await Blog.deleteOne();
	res.status(204).end();
});

module.exports = blogsRouter;
