const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const helper = require("./test_helper");
const Blog = require("../models/blog");
const User = require("../models/user");

const api = supertest(app);

describe("with blogs already present", async () => {
	let jwt;

	beforeEach(async () => {
		await Blog.deleteMany({});
		await User.deleteMany({});

		const passwordHash = await bcrypt.hash("password", 10);
		const user = new User({ username: "user", passwordHash });
		await user.save();

		const blogs = helper.initialBlogs;
		blogs.forEach((b) => (b.user = user._id));
		await Blog.insertMany(blogs);

		jwt = (
			await api
				.post("/api/login")
				.send({ username: "user", password: "password" })
		).body.token;
	});

	describe("when fetching blogs", async () => {
		test("blogs are returned as json", async () => {
			await api
				.get("/api/blogs")
				.expect(200)
				.expect("Content-Type", /application\/json/);
		});

		test("all blogs are returned", async () => {
			const response = await api.get("/api/blogs");

			assert.strictEqual(
				response.body.length,
				helper.initialBlogs.length
			);
		});

		test("blogs have a property named id", async () => {
			const response = await api.get("/api/blogs");
			const body = response.body;

			assert.ok(body.every((blog) => blog.id !== undefined));
		});
	});

	describe("creating new blogs", async () => {
		test("fails if not logged in", async () => {
			await api.post("/api/blogs").send(helper.singleBlog).expect(401);
		});

		describe("when logged in", async () => {
			test("works via POST", async () => {
				const preCount = (await api.get("/api/blogs")).body.length;
				const response = await api
					.post("/api/blogs")
					.auth(jwt, { type: "bearer" })
					.send(helper.singleBlog)
					.expect(201);

				const id = response.body.id;
				const newBlogs = await helper.blogsInDb();

				// check there is exactly one new blog
				assert.strictEqual(preCount + 1, newBlogs.length);

				// check newly created blog's content
				const newBlog = newBlogs.find((b) => b.id === id);
				delete newBlog.id;
				delete newBlog.user;
				delete helper.singleBlog.user;
				assert.deepStrictEqual(newBlog, helper.singleBlog);
			});

			test("the likes property defaults 0 if not present", async () => {
				const newBlog = helper.singleBlog;
				delete newBlog.likes;

				const response = await api
					.post("/api/blogs")
					.auth(jwt, { type: "bearer" })
					.send(newBlog)
					.expect(201);
				assert.strictEqual(response.body.likes, 0);
			});

			test("fails and returns 400 if no title is given", async () => {
				const noTitle = helper.singleBlog;
				delete noTitle.title;

				await api
					.post("/api/blogs")
					.auth(jwt, { type: "bearer" })
					.send(noTitle)
					.expect(400);
			});

			test("fails and returns 400 if no url is given", async () => {
				const noUrl = helper.singleBlog;
				delete noUrl.title;

				await api
					.post("/api/blogs")
					.auth(jwt, { type: "bearer" })
					.send(noUrl)
					.expect(400);
			});
		});
	});

	describe("deleting blogs", async () => {
		test("fails if not logged in", async () => {
			const blogs = await helper.blogsInDb();
			const blogToDelete = blogs[0];
			await api
				.delete(`/api/blogs/${blogToDelete.id}`)
				.send(helper.singleBlog)
				.expect(401);
		});

		describe("when logged in", async () => {
			test("when they exist are deleted", async () => {
				const blogs = await helper.blogsInDb();
				const blogToDelete = blogs[0];

				await api
					.delete(`/api/blogs/${blogToDelete.id}`)
					.auth(jwt, { type: "bearer" })
					.send()
					.expect(204);

				assert.strictEqual(
					blogs.length,
					(await helper.blogsInDb()).length + 1
				);
			});

			test("when they don't exist returns no error", async () => {
				const idToDelete = await helper.nonExistingId();

				await api
					.delete(`/api/blogs/${idToDelete}`)
					.auth(jwt, { type: "bearer" })
					.send()
					.expect(204);
			});
		});
	});

	describe("replacing existing blogs (PUT)", async () => {
		test("fails if not logged in", async () => {
			const blogs = await helper.blogsInDb();
			const blogToModify = blogs[0];

			blogToModify.title = "test";
			blogToModify.url = "newurl.example";
			blogToModify.likes = 1234;

			await api
				.put(`/api/blogs/${blogToModify.id}`)
				.send(blogToModify)
				.expect(401);
		});

		describe("when logged in", async () => {
			test("works properly for an existing entry", async () => {
				const blogs = await helper.blogsInDb();
				const blogToModify = blogs[0];

				blogToModify.title = "test";
				blogToModify.url = "newurl.example";
				blogToModify.likes = 1234;

				const res = await api
					.put(`/api/blogs/${blogToModify.id}`)
					.auth(jwt, { type: "bearer" })
					.send(blogToModify)
					.expect(200);

				delete blogToModify.user;
				delete res.body.user;
				assert.deepStrictEqual(blogToModify, res.body);
			});

			test("when they don't exist returns a 404 code", async () => {
				const nonExistingId = await helper.nonExistingId();

				const blogs = await helper.blogsInDb();
				const blogToModify = blogs[0];

				blogToModify.title = "test";
				blogToModify.url = "newurl.example";
				blogToModify.likes = 1234;

				await api
					.put(`/api/blogs/${nonExistingId}`)
					.auth(jwt, { type: "bearer" })
					.send(blogToModify)
					.expect(404);
			});

			test("with an empty title fails with code 400", async () => {
				const blogs = await helper.blogsInDb();
				const blogToModify = blogs[0];

				delete blogToModify.title;

				await api
					.put(`/api/blogs/${blogToModify.id}`)
					.auth(jwt, { type: "bearer" })
					.send(blogToModify)
					.expect(400);
			});

			test("with an empty url fails with code 400", async () => {
				const blogs = await helper.blogsInDb();
				const blogToModify = blogs[0];

				delete blogToModify.url;

				await api
					.put(`/api/blogs/${blogToModify.id}`)
					.auth(jwt, { type: "bearer" })
					.send(blogToModify)
					.expect(400);
			});
		});
	});
});

describe("when there is initially one user in db", () => {
	beforeEach(async () => {
		await User.deleteMany({});

		const passwordHash = await bcrypt.hash("password", 10);
		const user = new User({ username: "user", passwordHash });

		await user.save();
	});

	test("creation succeeds with a fresh username", async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			username: "mluukkai",
			name: "Matti Luukkainen",
			password: "salainen",
		};

		await api
			.post("/api/users")
			.send(newUser)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		const usersAtEnd = await helper.usersInDb();
		assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

		const usernames = usersAtEnd.map((u) => u.username);
		assert(usernames.includes(newUser.username));
	});

	test("creation fails with a repeated username", async () => {
		const newUser = {
			username: "user",
			name: "Matti Luukkainen",
			password: "salainen",
		};

		await api.post("/api/users").send(newUser).expect(400);
	});

	test("creation fails when no username is given", async () => {
		const newUser = {
			name: "Matti Luukkainen",
			password: "salainen",
		};

		await api.post("/api/users").send(newUser).expect(400);
	});

	test("creation fails when a invalid username is given", async () => {
		const newUser = {
			username: "ml",
			name: "Matti Luukkainen",
			password: "salainen",
		};

		await api.post("/api/users").send(newUser).expect(400);
	});

	test("creation fails when a weak password username is given", async () => {
		const newUser = {
			username: "mluukkai2",
			name: "Matti Luukkainen",
			password: "sa",
		};

		await api.post("/api/users").send(newUser).expect(400);
	});
});

after(async () => {
	await mongoose.connection.close();
});
