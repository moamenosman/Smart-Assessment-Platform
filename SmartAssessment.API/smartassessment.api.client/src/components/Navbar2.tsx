import { useNavigate, useLocation } from "react-router-dom";
import "../styles/components.css";

function Navbar2() {

    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        sessionStorage.removeItem("result");
        navigate("/");
    };

    const goHome = () => {

        const role = localStorage.getItem("role");

        if (role === "Instructor")
            navigate("/instructor");
        else
            navigate("/student");
    };

    return (

        <nav className="navbar">

            <h2 className="logo" onClick={goHome}>
                Smart Assessment
            </h2>

            {!location.pathname.startsWith("/solve-exam") && (

                <div className="nav-buttons">

                    <button
                        className="btn1 btn-danger"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            )}

        </nav>

    );

}

export default Navbar2;