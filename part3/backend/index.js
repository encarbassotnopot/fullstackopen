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
			else res.status(404).send({ error: "not found" });
		})
		.catch((err) => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
	Person.findByIdAndDelete(req.params.id)
		.then((mongoRes) => res.status(204).end())
		.catch((err) => next(err));
});

app.post("/api/persons", (req, res, next) => {
	const data = req.body;
	const person = new Person({ name: data.name, number: data.number });
	person
		.save()
		.then((savedPerson) => res.json(savedPerson))
		.catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
	const data = req.body;

	Person.findById(req.params.id)
		.then((person) => {
			if (!person) res.status(404).send({ error: "not found" });
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

const errorHandler = (error, req, res, next) => {
	console.error(error.message);

	if (error.name === "CastError") {
		return res.status(400).send({ error: "malformatted id" });
	} else if (error.name === "ValidationError") {
		return res.status(400).json({ error: error.message });
	}

	next(error);
};
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
