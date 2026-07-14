import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar2 from "../components/Navbar2";
function InstructorDashboard() {

    const navigate = useNavigate();

    const [exams, setExams] = useState<any[]>([]);

    useEffect(() => {

        api.get("/Exam")
            .then((res) => {

                console.log(res.data);
                setExams(res.data);

            })
            .catch((err) => {

                console.log(err);

            });

    }, []);

    const handleDelete = async (id: number) => {

        if (!window.confirm("Are you sure you want to delete this exam?"))
            return;

        try {

            await api.delete(`/Exam/${id}`);

            setExams(exams.filter(x => x.id !== id));

            alert("Exam Deleted Successfully");

        }
        catch (err) {

            console.log(err);

        }

    };

    return (
        <>
            <Navbar2 />

            <div className="page-container">

                <div className="page-header">

                    <h1 className="page-title">
                        Instructor Dashboard
                    </h1>

                    <button
                        className="btn2 btn-primary"
                        onClick={() => navigate("/create-exam")}
                    >
                        + Create Exam
                    </button>

                </div>

                {exams.map((exam) => (

                    <div
                        key={exam.id}
                        className="exam-card"
                    >

                        <div className="exam-info">

                            <h2>{exam.title}</h2>

                            <p>{exam.description}</p>

                            <span>
                                <strong className="exam-duration1">Duration: </strong> <span className="exam-duration">{exam.duration} Minutes</span>
                            </span>

                        </div>

                        <div className="exam-actions">

                            <button
                                className="btn btn-warning"
                                onClick={() => navigate(`/edit-exam/${exam.id}`)}
                            >
                                Edit
                            </button>

                            <button
                                className="btn btn-danger"
                                onClick={() => handleDelete(exam.id)}
                            >
                                Delete
                            </button>

                            <button
                                className="btn btn-outline2"
                                onClick={() => navigate(`/questions/${exam.id}`)}
                            >
                                Questions
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </>
    );

}

export default InstructorDashboard;