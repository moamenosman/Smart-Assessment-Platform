import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

function SolveExam() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [questions, setQuestions] = useState<any[]>([]);
    const [answers, setAnswers] = useState<{ [key: number]: number }>({});
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {

        api.get(`/Question/exam/${id}`)
            .then((res) => {
                setQuestions(res.data);
            })
            .catch((err) => {
                console.log(err);
            });

        api.get(`/Student/remaining-time/${id}`)
            .then((res) => {
                setTimeLeft(res.data.remainingSeconds);
            })
            .catch((err) => {
                console.log(err);
            });

    }, [id]);

    useEffect(() => {

        if (timeLeft === null || timeLeft <= 0 || submitted)
            return;

        const timer = setInterval(() => {

            setTimeLeft(prev => {

                if (prev === null)
                    return null;

                if (prev <= 1) {

                    clearInterval(timer);
                    return 0;

                }

                return prev - 1;

            });

        }, 1000);

        return () => clearInterval(timer);

    }, [timeLeft, submitted]);

    useEffect(() => {

        if (timeLeft !== 0 || submitted)
            return;

        handleSubmit(true);

    }, [timeLeft, submitted]);

    function handleSubmit(isAuto = false) {

        if (submitted)
            return;

        setSubmitted(true);

        const request = {
            examId: Number(id),
            answers: Object.entries(answers).map(([questionId, choiceId]) => ({
                questionId: Number(questionId),
                choiceId: choiceId
            }))
        };

        api.post("/Student/submit", request)
            .then((res) => {

                if (isAuto)
                    alert("Time Up!");

                sessionStorage.setItem(
                    "result",
                    JSON.stringify(res.data)
                );

                navigate("/result");

            })
            .catch((err) => {

                console.log(err.response?.data);

                setSubmitted(false);

            });

    }

    const minutes = Math.floor((timeLeft ?? 0) / 60);
    const seconds = (timeLeft ?? 0) % 60;

    return (

        <>

            <div className="solve-container">

                <div className="solve-header">

                    <h1 className="solve-title">
                        Solve Exam
                    </h1>

                    <div
                        className="solve-timer"
                        style={{
                            background:
                                (timeLeft ?? 0) <= 60
                                    ? "#dc2626"
                                    : (timeLeft ?? 0) <= 300
                                        ? "#f59e0b"
                                        : "#2563eb"
                        }}
                    >
                        ⏱ {minutes}:{seconds.toString().padStart(2, "0")}
                    </div>

                </div>

                {questions.map((question, index) => (

                    <div
                        key={question.id}
                        className="solve-question-card"
                    >

                        <div className="solve-question-top">

                            <span className="solve-question-number">
                                Question {index + 1}
                            </span>

                            <span className="solve-question-score">
                                {question.score} Points
                            </span>

                        </div>

                        <div className="solve-question-text">
                            {question.questionText}
                        </div>

                        <div className="solve-choices">

                            {question.choices.map((choice: any) => (

                                <label
                                    key={choice.id}
                                    className={
                                        answers[question.id] === choice.id
                                            ? "solve-choice solve-choice-active"
                                            : "solve-choice"
                                    }
                                >

                                    <input
                                        type="radio"
                                        name={`question-${question.id}`}
                                        checked={answers[question.id] === choice.id}
                                        onChange={() =>
                                            setAnswers({
                                                ...answers,
                                                [question.id]: choice.id
                                            })
                                        }
                                    />

                                    <span>{choice.choiceText}</span>

                                </label>

                            ))}

                        </div>

                    </div>

                ))}

                <button
                    className="btn btn-green solve-submit-btn"
                    onClick={() => handleSubmit(false)}
                    disabled={submitted}
                >
                    {submitted ? "Submitting..." : "Submit Exam"}
                </button>

            </div>

        </>

    );

}

export default SolveExam;