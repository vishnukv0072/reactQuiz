import {useQuiz} from "../contexts/QuizContext";

function Options() {
  const {questions, index, answer, dispatch} = useQuiz();
  const question = questions.at(index);
  const hasAnswered = answer !== null;
  return (<div className="options">
    {question.options.map((option, idx) =>
      <button
        className={`btn btn-option ${idx === answer ? 'answer' : ''} ${hasAnswered ? (idx === question.correctOption ? 'correct' : 'wrong') : ''}`}
        key={idx}
        disabled={hasAnswered}
        onClick={() => dispatch({type: "newAnswer", payload: idx})}>{option}
      </button>
    )}
  </div>)
}

export default Options;