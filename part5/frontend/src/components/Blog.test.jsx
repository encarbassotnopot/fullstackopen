import { render, screen } from "@testing-library/react";
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

	test("shows no buttons when not logged in", () => {
		render(<Blog blog={blog} user={null} />);

		const title = screen.queryByText(blog.title);
		const author = screen.queryByText(blog.author);
		const url = screen.queryByText(blog.url);
		const likes = screen.queryByText(blog.likes);

		const likeButton = screen.queryByText("like");
		const deleteButton = screen.queryByText("remove");

		expect(title).toBeDefined();
		expect(author).toBeDefined();
		expect(url).toBeDefined();
		expect(likes).toBeDefined();

		expect(likeButton).toBeNull();
		expect(deleteButton).toBeNull();
	});

	test("shows like button when logged in as a user other than the author", async () => {
		render(<Blog blog={blog} user={{ ...user, id: 456 }} />);

		const likeButton = screen.getByText("like");
		const deleteButton = screen.queryByText("remove");

		expect(likeButton).toBeDefined();
		expect(deleteButton).toBeNull();
	});

	test("shows both like and delete button when logged as the author", async () => {
		render(<Blog blog={blog} user={user} />);

		const likeButton = screen.getByText("like");
		const deleteButton = screen.getByText("remove");

		expect(likeButton).toBeDefined();
		expect(deleteButton).toBeDefined();
	});
});
