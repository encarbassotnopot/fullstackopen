const express = require("express");
const app = express();
const morgan = require("morgan");

const PORT = 3001;

app.use(express.json());
app.use(
	morgan("tiny", {
		skip: function (req, res) {
			return req.method === "POST";
		},
	})
);
app.use(
	morgan(
		":method :url :status :res[content-length] - :response-time ms :posts",
		{
			skip: function (req, res) {
				return req.method !== "POST";
			},
		}
	)
);
morgan.token("posts", (req, res) => JSON.stringify(req.body));

let phoneBook = [
	{
		id: "1",
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: "2",
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: "3",
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: "4",
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
];

app.get("/info", (req, res) => {
	res.send(
		`Phonebook has info for ${phoneBook.length} people<br/>${Date(Date.now())}`
	);
});

app.get("/api/persons", (req, res) => {
	res.json(phoneBook);
});

app.get("/api/persons/:id", (req, res) => {
	const id = req.params.id;
	const entry = phoneBook.find((e) => e.id === id);

	if (entry) res.json(entry);
	else res.status(404).end();
});

app.delete("/api/persons/:id", (req, res) => {
	const id = req.params.id;
	phoneBook = phoneBook.filter((e) => e.id !== id);

	res.status(204).end();
});

const genId = () => {
	return String(Math.floor(Math.random() * 1_000_000_000_000));
};

app.post("/api/persons", (req, res) => {
	const data = req.body;

	if (!data.name) return res.status(400).json({ error: "missing name" });
	if (!data.number) return res.status(400).json({ error: "missing number" });
	if (phoneBook.some((e) => e.name === data.name))
		return res.status(400).json({ error: "name must be unique" });

	const entry = { name: data.name, number: data.number, id: genId() };
	phoneBook = phoneBook.concat(entry);
	res.json(entry);
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
