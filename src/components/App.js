import '../index.css'
import Header from "./Header";
import Main from "./Main";
import {useEffect} from "react";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import Progress from "./Progress";
import NextButton from "./NextButton";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";
import {useQuiz} from "../contexts/QuizContext";

function App() {
  const {status} = useQuiz();

  return (<div className="block-center">
    <div className="App">
      <Header/>
      <Main>
        {status === "loading" && <Loader/>}
        {status === "error" && <Error/>}
        {status === "ready" && <StartScreen/>}
        {status === "active" && (<>
            <Progress/>
            <Question/>
            <Footer>
              <Timer/>
              <NextButton/>
            </Footer>
          </>
        )}
        {status === "finished" &&
          <FinishScreen/>}
      </Main>
    </div>
  </div>)
}

export default App;