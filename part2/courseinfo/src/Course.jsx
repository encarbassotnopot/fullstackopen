const Header = (props) => <h1>{props.name}</h1>;

const Content = (props) => {
	const { parts } = props;

	return (
		<div>
			{parts.map((part) => (
				<Part part={part} key={part.id} />
			))}
		</div>
	);
};

const Part = (props) => {
	const { name, exercises } = props.part;

	return (
		<p>
			{name} {exercises}
		</p>
	);
};

const Total = (props) => {
	const { parts } = props;
	const total = parts.reduce((acc, cur) => (acc += cur.exercises), 0);

	return <p>Number of exercises {total}</p>;
};

export const Course = (props) => {
	const { name, parts } = props.course;

	return (
		<div>
			<Header name={name} />
			<Content parts={parts} />
			<Total parts={parts} />
		</div>
	);
};
