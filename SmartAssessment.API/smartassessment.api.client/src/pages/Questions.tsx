import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";
function Questions() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState<any[]>([]);

    useEffect(() => {

        api.get(`/Question/exam/${id}`)
            .then((res) => {

                setQuestions(res.data);

            })
            .catch((err) => {

                console.log(err);

            });

    }, [id]);

    const handleDelete = async (questionId: number) => {

        if (!window.confirm("Delete this question?"))
            return;

        try {

            await api.delete(`/Question/${questionId}`);

            setQuestions(
                questions.filter(q => q.id !== questionId)
            );

            alert("Question Deleted Successfully");

        }
        catch (err) {

            console.log(err);

        }

    };

    return (
        <>
            <Navbar />

            <div className="page-container">

                <div className="page-header">

                    <h1 className="page-title">
                        Questions
                    </h1>

                    <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/add-question/${id}`)}
                    >
                        + Add Question
                    </button>

                </div>

                {
                    questions.map((question, index) => (

                        <div
                            key={question.id}
                            className="question-card"
                        >

                            <div className="question-header">

                                <div>

                                    <h2>
                                        {index + 1}. {question.questionText}
                                    </h2>

                                    <span className="score-badge">
                                        {question.score} Marks
                                    </span>

                                </div>

                                <div className="question-actions">

                                    <button
                                        className="btn btn-warning"
                                        onClick={() =>
                                            navigate(`/edit-question/${question.id}`)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDelete(question.id)}
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                            <div className="choices">

                                {
                                    question.choices.map((choice: any) => (

                                        <div
                                            key={choice.id}
                                            className={
                                                choice.isCorrect
                                                    ? "choice correct"
                                                    : "choice"
                                            }
                                        >

                                            {choice.choiceText}

                                            {choice.isCorrect && (
                                                <span> ✔</span>
                                            )}

                                        </div>

                                    ))
                                }

                            </div>

                        </div>

                    ))
                }

            </div>

        </>
    );

}

export default Questions;