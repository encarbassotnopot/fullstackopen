import { useState } from 'react'

const RandomAnecdote = ({ anecdotes, votes, selected, newAnecdote, handleVote }) => {

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}
      <br />
      <br />
      This anecdote has {votes[selected]} votes.
      <br />
      <br />
      <button onClick={newAnecdote}>Get Random Anecdote</button>
      <button onClick={() => handleVote(selected)}>Vote for this Anecdote</button>
    </div>
  )
}

const TopAnecdote = ({ anecdotes, votes }) => {

  const mostVoted = votes.indexOf(Math.max(...votes));
  return (
    <div>
      <h1>Top-voted anecdote</h1>
      {anecdotes[mostVoted]}
      <br />
      <br />
      This anecdote has {votes[mostVoted]} votes.
    </div>
  )
}


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [votes, setVotes] = useState(() => Array(anecdotes.length).fill(0))

  const [selected, setSelected] = useState(() => Math.floor(Math.random() * anecdotes.length))

  const newAnecdote = () => { setSelected(Math.floor(Math.random() * anecdotes.length)) }
  const handleVote = (selected) => { const newVotes = [...votes]; newVotes[selected] += 1, setVotes(newVotes); console.log(votes) }


  return (
    <div>
      <RandomAnecdote anecdotes={anecdotes} handleVote={handleVote} newAnecdote={newAnecdote} selected={selected} votes={votes} />
      <TopAnecdote anecdotes={anecdotes} votes={votes} />
    </div>
  )
}

export default App