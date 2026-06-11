const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const Blog = require("../models/blog");

const api = supertest(app);

beforeEach(async () => {
	await Blog.deleteMany({});
	await Blog.insertMany(helper.initialBlogs);
});

describe("with blogs already present", async () => {
	test("blogs are returned as json", async () => {
		await api
			.get("/api/blogs")
			.expect(200)
			.expect("Content-Type", /application\/json/);
	});

	test("all blogs are returned", async () => {
		const response = await api.get("/api/blogs");

		assert.strictEqual(response.body.length, helper.initialBlogs.length);
	});

	test("blogs have a property named id", async () => {
		const response = await api.get("/api/blogs");
		const body = response.body;

		assert.ok(body.every((blog) => blog.id !== undefined));
	});
});

describe("creating new blogs", async () => {
	test("works via POST", async () => {
		const preCount = (await api.get("/api/blogs")).body.length;
		const response = await api
			.post("/api/blogs")
			.send(helper.singleBlog)
			.expect(201);

		const id = response.body.id;
		const newBlogs = (await api.get("/api/blogs")).body;

		// check there is exactly one new blog
		assert.strictEqual(preCount + 1, newBlogs.length);

		// check newly created blog's content
		const newBlog = newBlogs.find((b) => b.id === id);
		delete newBlog.id;
		assert.deepStrictEqual(newBlog, helper.singleBlog);
	});

	test("the likes property defaults 0 if not present", async () => {
		const newBlog = helper.singleBlog;
		delete newBlog.likes;

		const response = await api.post("/api/blogs").send(newBlog).expect(201);
		assert.strictEqual(response.body.likes, 0);
	});

	test("fails and returns 400 if no title is given", async () => {
		const noTitle = helper.singleBlog;
		delete noTitle.title;

		await api.post("/api/blogs").send(noTitle).expect(400);
	});

	test("fails and returns 400 if no url is given", async () => {
		const noUrl = helper.singleBlog;
		delete noUrl.title;

		await api.post("/api/blogs").send(noUrl).expect(400);
	});
});

after(async () => {
	await mongoose.connection.close();
});
