import {useEffect} from "react";
import {useQuiz} from "../contexts/QuizContext";

function Timer() {
  const {dispatch, secondsRemaining} = useQuiz();
  const min = Math.floor(secondsRemaining / 60);
  const sec = Math.floor(secondsRemaining % 60);
  useEffect(() => {
    const id = setInterval(() => {
      dispatch({type: "tick"});
    }, 1000);
    return () => clearInterval(id);
  }, [])

  return (
    <div className="timer">
      {min < 10 && "0"}{min}:{sec < 10 && "0"}{sec}
    </div>
  )
}

export default Timer;