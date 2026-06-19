import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

vi.mock("../services/anecdotes", () => ({
	default: {
		getAll: vi.fn(),
		createNew: vi.fn(),
		update: vi.fn(),
	},
}));

import anecdoteService from "../services/anecdotes";
import useAnecdoteStore, {
	useAnecdoteActions,
	useAnecdotes,
} from "./anecdoteStore";

beforeEach(() => {
	useAnecdoteStore.setState({ anecdotes: [], filter: "" });
	vi.clearAllMocks();
});

describe("useAnecdoteActions", () => {
	it("initializes state with the anecdotes returned by the backend", async () => {
		const mockAnecdotes = [{ id: 1, content: "Test", votes: 0 }];
		anecdoteService.getAll.mockResolvedValue(mockAnecdotes);

		const { result } = renderHook(() => useAnecdoteActions());

		await act(async () => {
			await result.current.initialize();
		});

		const { result: anecdotesResult } = renderHook(() => useAnecdotes());
		expect(anecdotesResult.current).toEqual(mockAnecdotes);
	});

	it("returns anecdotes sorted by votes", async () => {
		const mockAnecdotes = [
			{ id: 1, content: "Third", votes: 1 },
			{ id: 2, content: "First", votes: 3 },
			{ id: 3, content: "Second", votes: 2 },
		];
		anecdoteService.getAll.mockResolvedValue(mockAnecdotes);

		const { result } = renderHook(() => useAnecdoteActions());

		await act(async () => {
			await result.current.initialize();
		});

		const { result: anecdotesResult } = renderHook(() => useAnecdotes());
		expect(anecdotesResult.current).toEqual(
			mockAnecdotes.toSorted((a, b) => b.votes - a.votes)
		);
	});

	it("returns anecdotes properly filtered", async () => {
		const mockAnecdotes = [{ id: 1, content: "Test", votes: 0 }];
		anecdoteService.getAll.mockResolvedValue(mockAnecdotes);

		const { result } = renderHook(() => useAnecdoteActions());

		await act(async () => {
			await result.current.initialize();
			await result.current.updateFilter("ir");
		});

		const { result: anecdotesResult } = renderHook(() => useAnecdotes());
		expect(anecdotesResult.current).toEqual(
			mockAnecdotes
				.toSorted((a, b) => b.votes - a.votes)
				.filter((a) => a.content.includes("ir"))
		);
	});

	it("increases votes when an anecdote is voted", async () => {
		const mockAnecdotes = [{ id: 1, content: "Test", votes: 0 }];

		anecdoteService.getAll.mockResolvedValue(mockAnecdotes);
		anecdoteService.update.mockResolvedValue({
			...mockAnecdotes[0],
			votes: 1,
		});

		const { result } = renderHook(() => useAnecdoteActions());

		await act(async () => {
			await result.current.initialize();
			await result.current.vote(mockAnecdotes[0]);
		});

		const { result: anecdotesResult } = renderHook(() => useAnecdotes());

		expect(anecdotesResult.current).toEqual([
			{
				...mockAnecdotes[0],
				votes: 1,
			},
		]);
	});
});
