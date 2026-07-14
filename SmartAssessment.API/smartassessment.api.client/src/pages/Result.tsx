import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect } from "react";

function Result() {

    useEffect(() => {
        window.history.pushState(null, "", window.location.href);

        const handleBack = () => {
            window.history.pushState(null, "", window.location.href);
        };

        window.addEventListener("popstate", handleBack);

        return () => {
            window.removeEventListener("popstate", handleBack);
        };
    }, []);

    const { state } = useLocation();

    const result =
        state ||
        JSON.parse(sessionStorage.getItem("result") || "null");

    if (!result) {
        return <h2>No Result Found</h2>;
    }
    return (

        <>
            <Navbar />

            <div className="result-page">

                <div className="result-card">

                    <div
                        className={
                            result.isPassed
                                ? "result-icon success"
                                : "result-icon fail"
                        }
                    >
                        {result.isPassed ? "✓" : "✕"}
                    </div>

                    <h1 className="result-title">
                        Exam Result
                    </h1>

                    <p className="result-subtitle">
                        Your exam has been submitted successfully.
                    </p>

                    <div className="result-grid">

                        <div className="result-item">
                            <span>Total Score</span>
                            <h2>{result.totalScore}</h2>
                        </div>

                        <div className="result-item">
                            <span>Percentage</span>
                            <h2>{Number(result.percentage).toFixed(2)}%</h2>
                        </div>

                    </div>

                    <div
                        className={
                            result.isPassed
                                ? "result-status passed"
                                : "result-status failed"
                        }
                    >
                        {result.isPassed ? "Passed 🎉" : "Failed ❌"}
                    </div>

                </div>

            </div>

        </>

    );

}

export default Result;