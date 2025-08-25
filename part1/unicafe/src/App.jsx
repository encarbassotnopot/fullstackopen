import { useState } from "react";

const FeedbackButton = ({ handleClick, text }) => (
	<button onClick={handleClick}>{text}</button>
);

const Statistics = ({ goodCount, neutralCount, badCount }) => {
	const total = goodCount + neutralCount + badCount || 1; // defaults to 1 to avoid divisions by zero
	const average = (goodCount - badCount) / total;
	const percent = goodCount / total;
	return (
		<table>
			<tbody>
				<StatisticsLine name="good" value={goodCount} />
				<StatisticsLine name="neutral" value={neutralCount} />
				<StatisticsLine name="bad" value={badCount} />
				<StatisticsLine
					name="average"
					value={Number(average).toLocaleString(undefined, {
						maximumFractionDigits: 2,
					})}
				/>
				<StatisticsLine
					name="positive"
					value={Number(percent).toLocaleString(undefined, {
						style: "percent",
						minimumFractionDigits: 2,
					})}
				/>
			</tbody>
		</table>
	);
};

const StatisticsLine = ({ name, value }) => (
	<tr>
		<td>{name}</td>
		<td>{value}</td>
	</tr>
);

const App = () => {
	// save clicks of each button to its own state
	const [good, setGood] = useState(0);
	const [neutral, setNeutral] = useState(0);
	const [bad, setBad] = useState(0);

	return (
		<div>
			<h1>give feedback</h1>
			<FeedbackButton
				handleClick={() => setGood((prev) => prev + 1)}
				text="Good"
			/>
			<FeedbackButton
				handleClick={() => setNeutral((prev) => prev + 1)}
				text="Neutral"
			/>
			<FeedbackButton
				handleClick={() => setBad((prev) => prev + 1)}
				text="Bad"
			/>

			<h1>statistics</h1>
			<Statistics
				goodCount={good}
				neutralCount={neutral}
				badCount={bad}
			/>
		</div>
	);
};

export default App;
