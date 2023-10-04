import { useEffect, useState } from "react"
import axios from "axios";
import CountryDescription from "./CountryDescription";
import Timer from "./Timer";
import Header from "./Header";
import Final from "./Final";
import Record from "./Record";
import { useParams } from "react-router-dom";

import '../style/style.css'
import Question2 from "./Question2";

function Quiz2() {
    var [quiz, setQuiz] = useState([]);
    var [countries, setCountries] = useState([]);
    var [answers, setAnswers] = useState([]);
    var [records, setRecords] = useState([]);
    var [currQuestion, setCurrQuestion] = useState(1);
    var [goodanswer, setGoodanswer] = useState(0);
    var [good, setGood] = useState(false)
    var [time, setTime] = useState("");
    var [currRecord, setCurrRecord] = useState("");


    const { id } = useParams();

    useEffect(() => {
        axios
            // Get our quiz options
            .get(`https://${process.env.REACT_APP_API_DNS}/quiz/`)
            .then(res => {

                setQuiz(res.data.filter(q => q.pk == id)[0])
            })
    }, [id])

    useEffect(() => {

        axios.get(`https://${process.env.REACT_APP_API_DNS}/country/?continent=` + quiz.continents)
            .then(res => {
                setCountries(res.data)
            })
            .catch((err) => { })
        axios.get(`https://${process.env.REACT_APP_API_DNS}/record/?quiz=${id}`)
            .then(res => {
                setRecords(res.data);
            })
            .catch((err) => { })
    }, [quiz, id])

    const shuffleQuestions = (countries) => {
        const nbrQuestions = Math.min(quiz.nbr_question, countries.length);
        // We chose an answer for each question

        var answerCountries = gogoShuff([...countries]).slice(0, nbrQuestions);

        setAnswers(answerCountries);

    }

    useEffect(() => {
        shuffleQuestions(countries);
    }, [countries])

    const gogoShuff = xx => xx.map(x => [x, Math.random()]).sort((a, b) => a[1] - b[1]).map(x => x[0]);

    const handleAnwser = () => { setCurrQuestion(currQuestion + 1) };
    const handleGoodAnswer = () => {
        setGoodanswer(goodanswer + 1);
        setGood(true);
    };
    const handleWrongAnswer = () => { setGood(false) };

    const saveTime = (timeParam) => {
        setTime(timeParam);

    }
    const updateRecord = (record) => {
        setRecords(records.concat(record));
        setCurrRecord(record)
    }

    const reset = () => {


        shuffleQuestions(countries);

        setCurrQuestion(1);
        setGoodanswer(0);
        setGood(false);
        setTime("");
        setCurrRecord("");
    }

    const type_question = String(quiz.type_questions).split('_');


    var pay = answers && currQuestion ? answers[currQuestion - 2] : "Wait";
    const nbrQuestions = Math.min(quiz.nbr_question, countries.length);
    var contentRender = currQuestion <= nbrQuestions ? (

        <div className="container w-100 h-75 d-flex flex-column justify-content-between align-items-center">

            <div className="row w-100"><Header /></div>
            <div className="row">
                <Timer active={currQuestion <= nbrQuestions} saveTime={saveTime} />
            </div>
            <h2>{currQuestion + "/" + nbrQuestions}</h2>
            <>
                <Question2 type_question={type_question} handleWrongAnswer={handleWrongAnswer} handleGoodAnswer={handleGoodAnswer} handleAnwser={currQuestion <= nbrQuestions ? handleAnwser : () => ""} answer={answers[currQuestion - 1]} countries={countries} />
                <div className={good ? "fixed-bottom d-flex justify-content-center bg-success" : "bg-danger text-light fixed-bottom d-flex justify-content-center"}>{pay && 2 <= currQuestion && currQuestion <= nbrQuestions + 1 ? <CountryDescription iso={pay.pk} name={pay.name} flag={pay.flag.slice(0, -2)} shape={pay.shape} cap={pay.capitale} key={pay.pk} cont={pay.continent} /> : ""}</div>
            </>

        </div>
    ) : (
        <div className="container w-100 h-75 d-flex flex-column justify-content-start align-items-center">

            <div className="row w-100"><Header /></div>
            <Final updateRecord={updateRecord} goodanswer={goodanswer} nbrQuestions={nbrQuestions} time={time} id={id} handleAnwser={handleAnwser} />
            <Record records={records} currRecord={currRecord} />
            <button type="button" className="btn btn-secondary" onClick={reset}>REJOUER</button>
            <div className={good ? "fixed-bottom d-flex justify-content-center bg-success" : "bg-danger text-light fixed-bottom d-flex justify-content-center"}>{pay && 2 <= currQuestion && currQuestion <= nbrQuestions + 1 ? <CountryDescription iso={pay.pk} name={pay.name} flag={pay.flag.slice(0, -2)} shape={pay.shape} cap={pay.capitale} key={pay.pk} cont={pay.continent} /> : ""}</div>
        </div>
    );

    return (
        <>
            {contentRender}
        </>
    )
}




export default Quiz2