const loginWith = async (page, username, password) => {
	await page.goto("/login");

	await page.getByLabel("username").fill(username);
	await page.getByLabel("password").fill(password);
	await page.getByRole("button", { name: "login" }).click();
};

const createNote = async (page, title, author, url) => {
	await page.goto("/create");

	await page.getByLabel("title:").fill(title);
	await page.getByLabel("author:").fill(author);
	await page.getByLabel("url:").fill(url);
	await page.getByRole("button", { name: "create" }).click();

	await page.waitForURL("/");
};

const likeNoteByTitle = async (page, title, likes) => {
	await page.goto("/");

	await page.getByRole("link").filter({ hasText: title }).click();

	await page.waitForURL("/blogs/*");

	for (let i = 1; i <= likes; i++) {
		const responsePromise = page.waitForResponse(
			(response) =>
				response.status() === 200 &&
				response.request().method() === "PUT"
		);
		await page.getByRole("button", { name: "like" }).click();
		await responsePromise;
	}
	await page.goto("/");
};

export { loginWith, createNote, likeNoteByTitle };
