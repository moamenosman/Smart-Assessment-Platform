import { useState } from "react";
import api from "../api/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import logo from "../assets/logo-smart.jpeg";
function Signup() {

    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    useEffect(() => {

        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token)
            return;

        navigate(role === "Instructor" ? "/instructor" : "/student", {
            replace: true
        });

    }, [navigate]);
    const handleRegister = async () => {

        try {
            if (!fullName.trim() || !email.trim() || !password.trim()) {
                alert("Please fill all fields");
                return;
            }
            await api.post("/Auth/register", {

                fullName,
                email,
                password

            });

            alert("Registration Successful");

            navigate("/login", { replace: true });

        }
        catch (error) {

            console.log(error);

            if (axios.isAxiosError(error)) {
                console.log(error.response?.status);
                console.log(error.response?.data);
            }

            if (axios.isAxiosError(error)) {
                alert(error.response?.data || "Registration Failed");
            } else {
                alert("Registration Failed");
            }

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
                        Create <span>Account</span>
                    </h1>

                </div>

                <p className="subtitle">
                    Create your Smart Assessment account
                </p>

                <label>Full Name</label>

                <input
                    className="input"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />

                <label>Email Address</label>

                <input
                    className="input"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label>Password</label>

                <input
                    className="input"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    className="btn btn-primary full-width"
                    onClick={handleRegister}
                >
                    Create Account
                </button>

                <div className="divider">
                    <span>OR</span>
                </div>

                <button
                    className="btn btn-outline full-width"
                    onClick={() => navigate("/login", { replace: true })}
                >
                    Back to Login
                </button>

            </div>

        </div>

    );

}

export default Signup;