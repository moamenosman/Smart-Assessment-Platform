import { useState } from "react";
import api from "../api/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import logo from "../assets/logo-smart.jpeg";
function Login() {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {

        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token)
            return;

        if (role === "Instructor")
            navigate("/instructor", { replace: true });

        else if (role === "Student")
            navigate("/student", { replace: true });

    }, [navigate]);
    const handleLogin = async () => {

        try {

            const response = await api.post("/Auth/login", {

                email,
                password

            });
            const { token, role } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("role", role);

            if (role === "Instructor") {
                navigate("/instructor", { replace: true });
            } else {
                navigate("/student", { replace: true });
            }

        }
        catch (error) {
            console.log(error);

            if (axios.isAxiosError(error)) {
                console.log(error.response?.status);
                console.log(error.response?.data);
            }

            alert("Login Failed");
        }
    };

    return (
        <div className="login-page">

            <div className="login-container">

                <div className="title-row">

                    <img
                        src={logo}
                        alt="Smart Assessment"
                        className="login-logo"
                    />

                    <h1>
                        Welcome <span>Back</span>
                    </h1>

                </div>

                <p className="subtitle">
                    Please login to continue to your account
                </p>

                <label>Email Address</label>

                <input
                    className="input"
                    type="email"
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label>Password</label>

                <input
                    className="input"
                    type="password"
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    className="btn btn-primary full-width"
                    onClick={handleLogin}
                >
                    Login
                </button>

                <div className="divider">
                    <span>OR</span>
                </div>

                <button
                    className="btn btn-outline full-width"
                    onClick={() => navigate("/signup")}
                >
                    Create New Account
                </button>

            </div>

        </div>
    );

}

export default Login;