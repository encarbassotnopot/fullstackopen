import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

describe("a blog entry", () => {
	const user = {
		name: "my name",
		username: "myusername",
		id: "123",
	};

	const blog = {
		title: "Go To Statement Considered Harmful",
		author: "Edsger W. Dijkstra",
		url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
		likes: 5,
		user: user,
	};

	test("shows only title and author by default", () => {
		render(<Blog blog={blog} user={user} />);

		const title = screen.queryByText(blog.title);
		const author = screen.queryByText(blog.author);
		const url = screen.queryByText(blog.url);
		const likes = screen.queryByText(blog.likes);

		expect(title).toBeDefined();
		expect(author).toBeDefined();
		expect(url).toBeNull();
		expect(likes).toBeNull();
	});

	test("can be expanded to show url and number of likes", async () => {
		render(<Blog blog={blog} user={user} />);

		const testAgent = userEvent.setup();
		const button = screen.getByText("view");
		await testAgent.click(button);

		const url = screen.queryByText(blog.url);
		const likes = screen.queryByText(`Likes ${blog.likes}`);

		expect(url).toBeDefined();
		expect(likes).toBeDefined();
	});

	test("has a like button that can be clicked twice", async () => {
		const mockHandler = vi.fn();

		render(<Blog blog={blog} user={user} handleLike={mockHandler} />);

		const testAgent = userEvent.setup();
		const viewButton = screen.getByText("view");
		await testAgent.click(viewButton);
		const likeButton = screen.getByText("like");
		await testAgent.click(likeButton);
		await testAgent.click(likeButton);

		expect(mockHandler.mock.calls).toHaveLength(2);
	});
});
