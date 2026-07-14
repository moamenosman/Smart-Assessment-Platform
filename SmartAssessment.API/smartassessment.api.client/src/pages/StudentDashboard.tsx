import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar2 from "../components/Navbar2";
function StudentDashboard() {

    const navigate = useNavigate();
    const [exams, setExams] = useState<any[]>([]);

    useEffect(() => {   
        sessionStorage.removeItem("result");

        const getExams = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await api.get("/Exam", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setExams(response.data);

            }
            catch (error) {

                console.log(error);

            }

        };

        getExams();

    }, []);

    async function startExam(examId: number) {

        try {

            await api.post(`/Student/start/${examId}`);

            navigate(`/solve-exam/${examId}`);

        }
        catch (err) {

            if (axios.isAxiosError(err)) {
                alert(err.response?.data || "Unable to start exam");
            } else {
                alert("Unable to start exam");
            }

        }

    }

    const getExamStatus = (exam: any) => {

        if (exam.alreadySubmitted)
            return "Submitted";

        const now = new Date();

        const start = new Date(exam.startTime);
        const end = new Date(exam.endTime);

        if (now < start)
            return "Upcoming";

        if (now > end)
            return "Closed";

        return "Available";
    };

    return (
        <>
            <Navbar2 />

            <div className="page-container">

                <h1 className="page-title">
                    Student Dashboard
                </h1>

                {exams.map((exam) => (

                    <div
                        key={exam.id}
                        className="exam-card"
                    >

                        <div className="exam-info">

                            <h2>{exam.title}</h2>

                            <span className={`status-badge ${getExamStatus(exam).toLowerCase()}`}>
                                {getExamStatus(exam)}
                            </span>

                            <p>{exam.description}</p>

                            <span>
                                <strong className="exam-duration1">Duration: </strong> <span className="exam-duration">{exam.duration} Minutes</span>
                            </span>

                        </div>

                        <div className="exam-actions">

                            <button
                                className="btn btn-primary"
                                disabled={getExamStatus(exam) !== "Available"}
                                onClick={() => startExam(exam.id)}
                            >
                                {
                                    getExamStatus(exam) === "Available"
                                        ? "Start Exam"
                                        : getExamStatus(exam)
                                }
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </>
    );

}

export default StudentDashboard;