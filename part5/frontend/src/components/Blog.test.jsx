import { render, screen } from "@testing-library/react";
import Blog from "./Blog";

test("renders content", () => {
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
