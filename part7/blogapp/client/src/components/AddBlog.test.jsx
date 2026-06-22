import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddBlog from "./AddBlog";

test("the AddBlog component forwards all user input to the handler function", async () => {
	const mockHandler = vi.fn();
	const newBlog = { title: "my title", author: "my author", url: "my url" };

	render(<AddBlog createBlog={mockHandler} />);

	const testAgent = userEvent.setup();

	const expandButton = screen.getByText("add new blog");
	await testAgent.click(expandButton);

	const titleInput = screen.getByLabelText("title:");
	const authorInput = screen.getByLabelText("author:");
	const urlInput = screen.getByLabelText("url:");

	await testAgent.type(titleInput, newBlog.title);
	await testAgent.type(authorInput, newBlog.author);
	await testAgent.type(urlInput, newBlog.url);

	const createButton = screen.getByText("create");
	await testAgent.click(createButton);

	expect(mockHandler).toHaveBeenCalledWith(newBlog);
});
