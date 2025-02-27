import DateCounter from "./DateCounter";
import './index.css'
import Header from "./Header";
import Main from "./Main";
import {useEffect, useReducer} from "react";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";

const initialState = {
  questions: [],
  status: "loading"
}

function reducer(state, action) {
  switch(action.type) {
    case "dataReceived":
      return {questions: action.payload, status: "ready"}
    case "dataFailed":
      return {...state, status: "error"}
    case "start":
      return {...state, status: "active"}
    default:
      throw new Error("Unknown type!!!")
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {questions, status} = state;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:8000/questions");
        const data = await response.json();
        dispatch({type: "dataReceived", payload: data});
      } catch(e) {
        dispatch({type: "dataFailed"})
      }
    }
    fetchData();
  }, [])

  return (
    <div className="block-center">
    <div className="App">
      <Header/>
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <StartScreen numQuestions={questions.length} dispatch={dispatch} />}
        {status === "active" && <Question />}
      </Main>
    </div>
    </div>
  )
}

export default App;