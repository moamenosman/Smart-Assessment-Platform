import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";
function AddQuestion() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [questionText, setQuestionText] = useState("");
    const [score, setScore] = useState(5);

    const [choices, setChoices] = useState([
        "",
        "",
        "",
        ""
    ]);

    const [correctChoice, setCorrectChoice] = useState(0);

    const handleChoiceChange = (index: number, value: string) => {

        const temp = [...choices];
        temp[index] = value;
        setChoices(temp);

    };

    const handleSubmit = async () => {

        try {

            const questionRes = await api.post("/Question", {
                examId: Number(id),
                questionText,
                score
            });

            const questionId = questionRes.data.id;

            for (let i = 0; i < 4; i++) {

                await api.post("/Choice", {
                    questionId,
                    choiceText: choices[i],
                    isCorrect: i === correctChoice
                });

            }

            alert("Question Added Successfully");

            navigate(`/questions/${id}`);

        } catch (err) {

            console.log(err);

        }

    };

    return (
        <>
            <Navbar />

            <div className="page-container">

                <div className="form-card">

                    <h1 className="page-title">
                        Add <span>Question</span>
                    </h1>

                    <p className="subtitle">
                        Create a new question
                    </p>

                    <div className="form-group">

                        <label>Question</label>

                        <input
                            className="input2"
                            placeholder="Enter question"
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                        />

                    </div>

                    <div className="form-group score-field">

                        <label>Score</label>

                        <input
                            className="input2"
                            type="number"
                            value={score}
                            onChange={(e) => setScore(Number(e.target.value))}
                        />

                    </div>

                    <h3 className="section-title">
                        Choices
                    </h3>

                    <div className="choices-grid">

                        {choices.map((choice, index) => (

                            <div
                                key={index}
                                className={
                                    correctChoice === index
                                        ? "choice-card active"
                                        : "choice-card"
                                }
                            >

                                <input
                                    className="input2"
                                    placeholder={`Choice ${index + 1}`}
                                    value={choice}
                                    onChange={(e) =>
                                        handleChoiceChange(index, e.target.value)
                                    }
                                />

                                <label className="correct-option">

                                    <input
                                        type="radio"
                                        checked={correctChoice === index}
                                        onChange={() => setCorrectChoice(index)}
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
                        Add Question
                    </button>

                </div>

            </div>

        </>
    );

}

export default AddQuestion;