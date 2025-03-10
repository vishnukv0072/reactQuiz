import {createContext, useContext, useEffect, useReducer} from 'react';
import Error from "../components/Error";

const QuizContext = createContext();
const SEC_PER_QUESTION = 30;
const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null,
  maxPossiblePoints: 0
}

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
        maxPossiblePoints: action.payload.reduce((acc, obj) => acc + obj.points, 0)
      }
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

function QuizProvider({children}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {questions, status, index, points, answer, highScore, secondsRemaining, maxPossiblePoints} = state;

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

  return (
    <QuizContext.Provider value={{
      questions,
      status,
      index,
      points,
      answer,
      highScore,
      secondsRemaining,
      maxPossiblePoints,
      dispatch
    }}>
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) throw new Error("QuizContext was called outside QuizProvider");
  return context;
}


export {QuizProvider, useQuiz};