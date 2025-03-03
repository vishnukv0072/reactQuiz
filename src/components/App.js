import DateCounter from "./DateCounter";
import '../index.css'
import Header from "./Header";
import Main from "./Main";
import {useEffect, useReducer} from "react";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import Progress from "./Progress";
import NextButton from "./NextButton";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const SEC_PER_QUESTION = 30;
const initialState = {
  questions: [], status: "loading", index: 0, answer: null, points: 0, highScore: 0, secondsRemaining: null
}

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {...state, questions: action.payload, status: "ready"}
    case "dataFailed":
      return {...state, status: "error"}
    case "start":
      return {...state, status: "active", secondsRemaining: state.questions.length * SEC_PER_QUESTION}
    case "newAnswer":
      const question = state.questions.at(state.index);
      const newScore = question.correctOption === action.payload ? question.points : 0
      return {...state, answer: action.payload, points: state.points + newScore}
    case "nextQuestion":
      return {...state, answer: null, index: state.index + 1}
    case "finish":
      return {...state, status: "finished", highScore: state.points > state.highScore ? state.points : state.highScore}
    case "restart":
      return {...initialState, questions: state.questions, status: "ready", highScore: state.highScore}
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status
      }
    default:
      throw new Error("Unknown type!!!")
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {questions, status, index, points, answer, highScore, secondsRemaining} = state;
  const maxPossiblePoints = questions.reduce((acc, obj) => acc + obj.points, 0);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:8000/questions");
        const data = await response.json();
        dispatch({type: "dataReceived", payload: data});
      } catch (e) {
        dispatch({type: "dataFailed"})
      }
    }

    fetchData();
  }, [])

  return (<div className="block-center">
    <div className="App">
      <Header/>
      <Main>
        {status === "loading" && <Loader/>}
        {status === "error" && <Error/>}
        {status === "ready" && <StartScreen numQuestions={questions.length} dispatch={dispatch}/>}
        {status === "active" && (<>
            <Progress index={index} numQuestions={questions.length} answer={answer} points={points}
                      maxPossiblePoints={maxPossiblePoints}/>
            <Question question={questions.at(index)} index={index} numQuestions={questions.length}
                      maxPossiblePoints={maxPossiblePoints} points={points} answer={answer}
                      dispatch={dispatch}/>
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining}/>
              <NextButton answer={answer} dispatch={dispatch} index={index} numQuestions={questions.length}/>
            </Footer>
          </>
        )}
        {status === "finished" &&
          <FinishScreen points={points} maxPossiblePoints={maxPossiblePoints} highScore={highScore}
                        dispatch={dispatch}/>}
      </Main>
    </div>
  </div>)
}

export default App;