const { test, expect, beforeEach, describe } = require("@playwright/test");
const helper = require("./helper");

describe("Blog app", () => {
	beforeEach(async ({ page, request }) => {
		await request.post("/api/testing/reset");
		await request.post("/api/users", {
			data: {
				name: "my test user",
				username: "testuser",
				password: "password",
			},
		});

		await page.goto("/");
	});
	describe("Login", () => {
		test("form is shown", async ({ page }) => {
			await expect(page.getByText("Log in to application")).toBeVisible();

			await expect(page.getByLabel("username")).toBeVisible();
			await expect(page.getByLabel("password")).toBeVisible();
		});

		test("succeeds with correct credentials", async ({ page }) => {
			await helper.loginWith(page, "testuser", "password");

			const currentUser = await page.getByText("my test user logged in");
			await expect(currentUser).toBeVisible();
		});

		test("fails with wrong credentials", async ({ page }) => {
			await helper.loginWith(page, "wronguser", "wrongpassword");
			const notification = await page.locator(".notification.error");
			await expect(notification).toBeVisible();
			await expect(notification).toHaveText("wrong credentials");
		});
	});

	describe("When logged in", () => {
		beforeEach(async ({ page }) => {
			await helper.loginWith(page, "testuser", "password");
		});

		test("a new blog can be created", async ({ page }) => {
			await helper.createNote(
				page,
				"my title",
				"the author",
				"example.com"
			);

			const notification = await page.locator(".notification.ok");
			await expect(notification).toBeVisible();
			await expect(notification).toHaveText(
				"a new blog my title by the author added"
			);

			const blog = await page.locator(".blog-item");
			await expect(blog).toBeVisible();
			await expect(blog).toHaveText(/my title the author/);
		});

		test("a blog entry can be liked", async ({ page }) => {
			await helper.createNote(
				page,
				"my title",
				"the author",
				"example.com"
			);

			await page
				.locator(".blog-item")
				.getByRole("button")
				.getByText("view")
				.click();

			await page
				.locator(".blog-item")
				.getByRole("button")
				.getByText("like")
				.click();

			await expect(page.locator(".blog-item")).toHaveText(/Likes 1/);
		});

		test("a blog entry can be deleted", async ({ page }) => {
			await helper.createNote(
				page,
				"my title",
				"the author",
				"example.com"
			);

			await page
				.locator(".blog-item")
				.getByRole("button")
				.getByText("view")
				.click();

			page.on("dialog", async (dialog) => await dialog.accept());

			await page
				.locator(".blog-item")
				.getByRole("button")
				.getByText("remove")
				.click();

			await expect(page.locator(".blog-item")).not.toBeVisible();
		});

		test("only a blog's creator can delete it", async ({
			page,
			request,
		}) => {
			await helper.createNote(
				page,
				"my title",
				"the author",
				"example.com"
			);

			await page.getByRole("button").getByText("logout").click();

			await request.post("/api/users", {
				data: {
					name: "my other test user",
					username: "testuser2",
					password: "password",
				},
			});

			await helper.loginWith(page, "testuser2", "password");

			await page
				.locator(".blog-item")
				.getByRole("button")
				.getByText("view")
				.click();

			const deleteButton = await page
				.locator(".blog-item")
				.getByRole("button")
				.getByText("delete");

			await expect(deleteButton).not.toBeVisible();
		});

		test("blogs are sorted by likes", async ({ page }) => {
			await helper.createNote(
				page,
				"first note",
				"the author",
				"example.com"
			);
			await helper.createNote(
				page,
				"second note",
				"the author",
				"example.com"
			);
			await helper.createNote(
				page,
				"third note",
				"the author",
				"example.com"
			);

			await helper.likeNoteByTitle(page, "first note", 2);
			await helper.likeNoteByTitle(page, "second note", 1);
			await helper.likeNoteByTitle(page, "third note", 3);

			const entries = await page.locator(".blog-item").all();
			expect(entries[0]).toContainText("third note");
			expect(entries[1]).toContainText("first note");
			expect(entries[2]).toContainText("second note");
		});
	});
});
