import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";

function EditQuestion() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [examId, setExamId] = useState(0);
    const [questionText, setQuestionText] = useState("");
    const [score, setScore] = useState(0);
    const [choices, setChoices] = useState<any[]>([]);

    useEffect(() => {

        api.get(`/Question/${id}`)
            .then(async (res) => {

                setQuestionText(res.data.questionText);
                setScore(res.data.score);
                setExamId(res.data.examId);

                const allQuestions = await api.get(`/Question/exam/${res.data.examId}`);

                const question = allQuestions.data.find((q: any) => q.id == id);

                setChoices(question.choices);

            })
            .catch(console.log);

    }, [id]);

    const handleChoice = (index: number, value: string) => {

        const arr = [...choices];
        arr[index].choiceText = value;
        setChoices(arr);

    };

    const handleCorrect = (index: number) => {

        const arr = choices.map((c: any, i: number) => ({
            ...c,
            isCorrect: i === index
        }));

        setChoices(arr);

    };

    const handleSubmit = async () => {

        try {

            await api.put(`/Question/${id}`, {

                examId: examId,
                questionText,
                score

            });

            for (const choice of choices) {

                await api.put(`/Choice/${choice.id}`, {

                    questionId: choice.questionId,
                    choiceText: choice.choiceText,
                    isCorrect: choice.isCorrect

                });

            }

            alert("Question Updated Successfully");

            navigate(-1);

        }
        catch (err) {

            console.log(err);

        }

    };

    return (
        <>
            <Navbar />

            <div className="page-container">

                <div className="form-card">

                    <h1 className="page-title">
                        Edit <span>Question</span>
                    </h1>

                    <p className="subtitle">
                        Update question details
                    </p>

                    <div className="form-group">

                        <label>Question</label>

                        <input
                            className="input2"
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            placeholder="Enter question"
                        />

                    </div>

                    <div className="form-group">

                        <label>Score</label>

                        <input
                            className="input2"
                            type="number"
                            value={score}
                            onChange={(e) => setScore(Number(e.target.value))}
                        />

                    </div>

                    <h3
                        style={{
                            marginTop: "35px",
                            marginBottom: "20px",
                            color: "#0f172a"
                        }}
                    >
                        Choices
                    </h3>

                    <div className="choices-grid">

                        {choices.map((choice: any, index: number) => (

                            <div
                                key={choice.id}
                                className={
                                    choice.isCorrect
                                        ? "choice-card active"
                                        : "choice-card"
                                }
                            >

                                <input
                                    className="input2"
                                    value={choice.choiceText}
                                    onChange={(e) =>
                                        handleChoice(index, e.target.value)
                                    }
                                />

                                <label className="correct-option">

                                    <input
                                        type="radio"
                                        checked={choice.isCorrect}
                                        onChange={() => handleCorrect(index)}
                                    />

                                    Correct Answer

                                </label>

                            </div>

                        ))}

                    </div>

                    <button
                        className="btn btn-green save-btn"
                        onClick={handleSubmit}
                    >
                        Update Question
                    </button>

                </div>

            </div>

        </>
    );

}

export default EditQuestion;