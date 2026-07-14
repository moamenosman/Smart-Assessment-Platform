import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";
function EditExam() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [exam, setExam] = useState({
        title: "",
        description: "",
        duration: 60,
        startTime: "",
        endTime: "",
        passPercentage: 50,
    });

    useEffect(() => {

        api.get(`/Exam/${id}`)
            .then(res => {

                setExam(res.data);

            });

    }, [id]);

    const handleChange = (e: any) => {

        setExam({
            ...exam,
            [e.target.name]:
                e.target.type === "number"
                    ? Number(e.target.value)
                    : e.target.value
        });

    };

    const handleSubmit = () => {

        api.put(`/Exam/${id}`, exam)
            .then(() => {

                alert("Exam Updated Successfully");

                navigate("/instructor");

            });

    };

    return (
        <>
            <Navbar />

            <div className="page-container">

                <div className="form-card">

                    <h1 className="page-title">
                        Edit <span>Exam</span>
                    </h1>

                    <p className="subtitle">
                        Update exam information
                    </p>

                    <div className="form-grid">

                        <div className="form-group">
                            <label>Exam Title</label>

                            <input
                                className="input2"
                                name="title"
                                value={exam.title}
                                onChange={handleChange}
                                placeholder="Enter exam title"
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>

                            <input
                                className="input2"
                                name="description"
                                value={exam.description}
                                onChange={handleChange}
                                placeholder="Enter exam description"
                            />
                        </div>

                        <div className="form-group half">
                            <label>Duration (Minutes)</label>

                            <input
                                className="input2"
                                type="number"
                                name="duration"
                                value={exam.duration}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group half">
                            <label>Pass Percentage</label>

                            <input
                                className="input2"
                                type="number"
                                name="passPercentage"
                                value={exam.passPercentage}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group half">
                            <label>Start Time</label>

                            <input
                                className="input2"
                                type="datetime-local"
                                name="startTime"
                                value={exam.startTime?.substring(0, 16)}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group half">
                            <label>End Time</label>

                            <input
                                className="input2"
                                type="datetime-local"
                                name="endTime"
                                value={exam.endTime?.substring(0, 16)}
                                onChange={handleChange}
                            />
                        </div>

                    </div>

                    <button
                        className="btn btn-green save-btn"
                        onClick={handleSubmit}
                    >
                        Update Exam
                    </button>

                </div>

            </div>

        </>
    );

}

export default EditExam;