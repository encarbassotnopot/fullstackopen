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
	Person.find({}).then((people) => {
		const len = people.length;
		res.send(
			`Phonebook has info for ${len} people<br/>${Date(Date.now())}`
		);
	});
});

app.get("/api/persons", (req, res) => {
	Person.find({}).then((people) => res.json(people));
});

app.get("/api/persons/:id", (req, res, next) => {
	Person.findById(req.params.id)
		.then((person) => {
			if (person) res.json(person);
			else res.status(404).end();
		})
		.catch((err) => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
	Person.findByIdAndDelete(req.params.id)
		.then((mongoRes) => res.status(204).end())
		.catch((err) => next(err));
});

app.post("/api/persons", (req, res) => {
	const data = req.body;

	if (data.name === undefined)
		return res.status(400).json({ error: "missing name" });
	if (data.number === undefined)
		return res.status(400).json({ error: "missing number" });

	const person = new Person({ name: data.name, number: data.number });
	person.save().then((savedPerson) => res.json(savedPerson));
});

app.put("/api/persons/:id", (req, res) => {
	const data = req.body;

	if (data.name === undefined)
		return res.status(400).json({ error: "missing name" });
	if (data.number === undefined)
		return res.status(400).json({ error: "missing number" });

	Person.findById(req.params.id)
		.then((person) => {
			if (!person) res.status(404).end();
			person.name = data.name;
			person.number = data.number;
			return person.save().then((savedPerson) => res.json(savedPerson));
		})
		.catch((err) => next(err));
});

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const errorHandler = (err, req, res, next) => {
	console.error(err.message);

	if (err.name === "CastError") {
		return res.status(400).send({ error: "malformatted id" });
	}

	next(err);
};
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
