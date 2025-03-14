import {useQuiz} from "../contexts/QuizContext";

function Progress() {
  const {index, questions, answer, points, maxPossiblePoints} = useQuiz();
  const numQuestions = questions.length;
  return (
    <header className="progress">
      <progress value={answer ? index + 1 : index} max={numQuestions}></progress>
      <p>Question <strong>{index + 1}</strong> / {numQuestions}</p>
      <p>{points} / {maxPossiblePoints} points</p>
    </header>
  )
}

export default Progress;