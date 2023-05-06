import { useEffect, useState } from "react"
import axios from "axios";
import CountryDescription from "./CountryDescription";
import Timer from "./Timer";
import Question from "./Question";
import Header from "./Header";
import Final from "./Final";
import { useParams } from "react-router-dom";

function Quiz2() {
    var [quiz, setQuiz] = useState([]);
    var [countries, setCountries] = useState([]);
    var [answers, setAnswers] = useState([]);
    var [choices, setChoices] = useState([]);
    var [records, setRecords] = useState([]);
    var [currQuestion, setCurrQuestion] = useState(1);
    var [goodanswer, setGoodanswer] = useState(0);
    var [good, setGood] = useState(false)
    var [time, setTime] = useState("");

    const { id } = useParams();


    const sortCountry = (arr, answer) => {
        return arr.filter(pay => pay !== answer)
    }

    useEffect(() => {
        axios
            // Get our quiz options
            .get('http://localhost:8000/quiz/')
            .then(res => {
                setQuiz(res.data[id - 1])
            })
    }, [id])

    useEffect(() => {

        axios.get('http://localhost:8000/country/?continent=' + quiz.continents)
            .then(res => {
                setCountries(res.data)
            })
            .catch((err) => { })
        axios.get(`http://localhost:8000/record/?quiz=${id}`)
            .then(res => {
                setRecords(res.data);
            })
            .catch((err) => { })
    }, [quiz, id])

    useEffect(() => {
        const nbrQuestions = Math.min(quiz.nbr_question, countries.length);
        // We chose an answer for each question

        var answerCountries = gogoShuff([...countries]).slice(0, nbrQuestions);
        var choicesArr = [];
        for (var i = 0; i < nbrQuestions; i++) {
            // We chose 3 other countries to populate the answers, the 3 can't be the answer
            var choices = gogoShuff(sortCountry(countries, answerCountries[i])).slice(0, 3);
            choicesArr.push(choices);
        }
        setAnswers(answerCountries);
        setChoices(choicesArr);
    }, [countries, quiz.nbr_question])

    const gogoShuff = xx => xx.map(x => [x, Math.random()]).sort((a, b) => a[1] - b[1]).map(x => x[0]);

    const handleAnwser = () => { setCurrQuestion(currQuestion + 1) };
    const handleGoodAnswer = () => {
        setGoodanswer(goodanswer + 1);
        setGood(true);
    };
    const handleWrongAnswer = () => { setGood(false) };
    const convertTime = (time) => {

        var mili = time % 100;
        var nbrSeconds = Math.floor(time / 100);


        var minutes = Math.floor(nbrSeconds / 60);
        var seconds = nbrSeconds % 60;
        if (String(minutes).length === 1) {
            if (String(seconds).length === 1) {
                return <>{String(mili).length === 1 ? `0${minutes}:0${seconds}:0${mili}` : `0${minutes}:0${seconds}:${mili}`}</>
            }
            return <>{String(mili).length === 1 ? `0${minutes}:${seconds}:0${mili}` : `0${minutes}:${seconds}:${mili}`}</>
        }
        if (String(seconds).length === 1) {
            return <>{String(mili).length === 1 ? `${minutes}:0${seconds}:0${mili}` : `${minutes}:0${seconds}:${mili}`}</>
        }
        return <>{String(mili).length === 1 ? `${minutes}:${seconds}:0${mili}` : `${minutes}:${seconds}:${mili}`}</>
    }
    const saveTime = (timeParam) => {
        setTime(timeParam);

    }
    const updateRecord = (record) => {
        setRecords(records.concat(record))
    }

    const type_question = String(quiz.type_questions).split('_');

    const name = quiz.name;
    var pay = choices && currQuestion ? answers[currQuestion - 2] : "Wait";

    records.sort((a, b) => {
        return a.points === b.points ? Number(a.time) - Number(b.time) : b.points - a.points;
    })

    let recordTable = <table>
        <tbody>
            <tr>
                <td>User</td>
                <td>Points</td>
                <td>Temps</td>
            </tr>
            {records.map((record, i) => {
                return (
                    <tr key={`record-${i}`}>
                        <td>{record.user}</td>
                        <td>{record.points}</td>
                        <td>{convertTime(Number(record.time))}</td>
                    </tr>
                )
            })}
        </tbody>
    </table>
    return (
        <div className="container h-75 d-flex flex-column justify-content-between align-items-center">
            <div className="row"><Header /></div>
            <div className="row">
                {currQuestion <= choices.length ? <Timer active={currQuestion <= choices.length} saveTime={saveTime} /> : ""}
            </div>
            <h2>{currQuestion <= choices.length ? currQuestion + "/" + choices.length : ""}</h2>
            <>

                {currQuestion <= choices.length ?
                    <Question type_question={type_question} handleWrongAnswer={handleWrongAnswer} handleGoodAnswer={handleGoodAnswer} handleAnwser={currQuestion <= choices.length ? handleAnwser : ""} choice={choices[currQuestion - 1]} answer={answers[currQuestion - 1]} /> :
                    <>{time ? <Final updateRecord={updateRecord} goodanswer={goodanswer} nbrQuestions={choices.length} time={time} id={id} handleAnwser={handleAnwser} /> : "Wait"}
                        {time ? <div>{convertTime(time)}</div> : "Wait"}
                        {recordTable}</>}
                <div className={good ? "green fixed-bottom d-flex justify-content-center" : "red fixed-bottom d-flex justify-content-center"}>{pay && 2 <= currQuestion && currQuestion <= choices.length + 1 ? <CountryDescription iso={pay.pk} name={pay.name} flag={pay.flag.slice(0, -2)} shape={pay.shape} cap={pay.capitale} key={pay.pk} cont={pay.continent} /> : ""}</div>
            </>

        </div>
    )
}




export default Quiz2