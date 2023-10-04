import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

import axios from "axios";

import Header from "./Header";


import '../style/style.css'

function Menu2() {
    var [countries, setCountries] = useState([]);
    var [quiz, setQuiz] = useState([]);
    var [types, setTypes] = useState("");
    useEffect(() => {
        axios
            .get(`https://${process.env.REACT_APP_API_DNS || "api.webigeo-pre.dcpepper.cloudns.ph"}/country/`)
            .then(res => {
                setCountries(res.data)
            })
        axios
            .get(`https://${process.env.REACT_APP_API_DNS}/quiz/`)
            .then(res => {
                setQuiz(res.data)
            })
    }, [])
    let navigator = useNavigate();



    const quizChoice = (q) => {
        let path = `../quiz/${q.pk}`;
        navigator(path)
        console.log(q)
    }

    var quizNames = quiz ? quiz.map(q => q.name) : [];
    var quizTypes = quizNames ? new Set(quizNames.map(name => name.split('_')[1].toUpperCase())) : [];
    var quesionnaries = quizTypes ? Object.fromEntries([...quizTypes].map(type => [type, quizNames.filter(name => name.split('_')[1].toUpperCase() === type).map(name => name.split('_')[0].toUpperCase())])) : {};


    var contientDict = {
        "all": "monde",
        "europe": "europe",
        "asia": "asie",
        "oceania": "oceanie",
        "namerica": "Amérique du nord",
        "samerica": "amérique du sud",
        "africa": "afrique"
    }

    var typeDict = {
        "FLAG": "DRAPEAU",
        "ALL": "MIXTE",
        "CAPITALE": "CAPITALE",
        "SHAPE": "FORME"
    }

    const handleType = (ev) => {
        setTypes(Object.entries(typeDict).filter(item => item[1] === ev.target.textContent)[0][0]);
    }

    console.log(process.env.REACT_APP_API_DNS)
    console.log(process.env)
    return <div className="bg-dark d-flex flex-column align-items-center h-100">
        <Header />
        {Object.keys(quesionnaries).map((type, i) => {
            if (types === "") { return <div className={`${type} w-50 h-25 bg-warning text-dark m-2 d-flex justify-content-center align-items-center`} key={`type-${i}`} onClick={handleType}><h1>{typeDict[type]}</h1></div> }
            else {
                if (type === types) {
                    var names = quesionnaries[types].map((name, j) => {
                        return <div className={`name${name} w-50 h-25 bg-warning text-dark m-2 d-flex justify-content-center align-items-center`} key={`type-${types}-name-${j}`} onClick={() => quizChoice(quiz.filter(q => q.name.toUpperCase() === `${name}_${types}`.toUpperCase())[0])}>{contientDict[name.toLowerCase()].toUpperCase()}</div>
                    })
                    return <>
                        {names}
                        <button type="button" className="mb-2 btn btn-secondary" onClick={() => setTypes("")}>↩</button>
                    </>
                }
            }
        })}


    </div>;

}

export default Menu2