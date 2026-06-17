const loginWith = async (page, username, password) => {
	await page.getByLabel("username").fill(username);
	await page.getByLabel("password").fill(password);
	await page.getByRole("button", { name: "login" }).click();
};

const createNote = async (page, title, author, url) => {
	await page.getByRole("button", { name: "add new blog" }).click();
	await page.getByLabel("title:").fill(title);
	await page.getByLabel("author:").fill(author);
	await page.getByLabel("url:").fill(url);
	await page.getByRole("button", { name: "create" }).click();
	await page.getByText(title);
};

const likeNoteByTitle = async (page, title, likes) => {
	let entry = await page.locator(".blog-item").filter({ hasText: title });

	await entry.getByRole("button", { name: "view" }).click();

	for (let i = 1; i <= likes; i++) {
		const responsePromise = page.waitForResponse(
			(response) =>
				response.status() === 200 &&
				response.request().method() === "PUT"
		);
		await entry.getByRole("button", { name: "like" }).click();
		await responsePromise;
	}
};

export { loginWith, createNote, likeNoteByTitle };
