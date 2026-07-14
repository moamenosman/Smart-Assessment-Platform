import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";
function CreateExam() {

    const navigate = useNavigate();

    const [exam, setExam] = useState({
        title: "",
        description: "",
        duration: 60,
        startTime: "",
        endTime: "",
        passPercentage: 50,
    });

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

        api.post("/Exam", exam)
            .then(() => {

                alert("Exam Created Successfully");

                navigate("/instructor");

            })
            .catch(err => {

                console.log(err);

            });

    };

    return (
        <>
            <Navbar />

            <div className="page-container">

                <div className="form-card">

                    <h1 className="page-title">
                        Create <span>Exam</span>
                    </h1>

                    <p className="subtitle">
                        Create a new exam
                    </p>

                    <div className="form-grid">

                        <div className="form-group">

                            <label>Exam Title</label>

                            <input
                                className="input2"
                                name="title"
                                placeholder="Enter exam title"
                                onChange={handleChange}
                            />

                        </div>

                        <div className="form-group">

                            <label>Description</label>

                            <input
                                className="input2"
                                name="description"
                                placeholder="Enter exam description"
                                onChange={handleChange}
                            />

                        </div>

                        <div className="form-group half">

                            <label>Duration (Minutes)</label>

                            <input
                                className="input2"
                                type="number"
                                name="duration"
                                onChange={handleChange}
                            />

                        </div>

                        <div className="form-group half">

                            <label>Pass Percentage</label>

                            <input
                                className="input2"
                                type="number"
                                name="passPercentage"
                                onChange={handleChange}
                            />

                        </div>

                        <div className="form-group half">

                            <label>Start Time</label>

                            <input
                                className="input2"
                                type="datetime-local"
                                name="startTime"
                                onChange={handleChange}
                            />

                        </div>

                        <div className="form-group half">

                            <label>End Time</label>

                            <input
                                className="input2"
                                type="datetime-local"
                                name="endTime"
                                onChange={handleChange}
                            />

                        </div>

                    </div>

                    <button
                        className="btn btn-green save-btn"
                        onClick={handleSubmit}
                    >
                        Create Exam
                    </button>

                </div>

            </div>

        </>
    );
}

export default CreateExam;