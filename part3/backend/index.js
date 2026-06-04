require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const Person = require("./models/person");

const PORT = process.env.PORT;

app.use(express.static("dist"));
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

app.get("/info", (req, res) => {
	res.send(
		`Phonebook has info for ${phoneBook.length} people<br/>${Date(Date.now())}`
	);
});

app.get("/api/persons", (req, res) => {
	Person.find({}).then((people) => res.json(people));
});

app.get("/api/persons/:id", (req, res) => {
	Person.findById(req.params.id).then((p) => res.json(p));
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
	//if (phoneBook.some((e) => e.name === data.name))
	//	return res.status(400).json({ error: "name must be unique" });

	const person = new Person({ name: data.name, number: data.number });
	person.save().then((savedPerson) => res.json(savedPerson));
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
