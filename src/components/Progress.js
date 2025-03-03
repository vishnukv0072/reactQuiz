function Progress({index, numQuestions, answer, points, maxPossiblePoints}) {
  return (
    <header className="progress">
      <progress value={answer ? index + 1 : index} max={numQuestions}></progress>
      <p>Question <strong>{index + 1}</strong> / {numQuestions}</p>
      <p>{points} / {maxPossiblePoints} points</p>
    </header>
  )
}

export default Progress;