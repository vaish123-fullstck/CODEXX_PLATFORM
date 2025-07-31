import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // ✅ 1. Import the context
import "./LoginSignup.css";

const LoginSignup = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext); // ✅ 2. Get the login function from the context

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setFormData({ username: "", email: "", password: "" });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const endpoint = isLogin
            ? "http://localhost:5000/api/auth/login"
            : "http://localhost:5000/api/auth/signup";

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Something went wrong!");
            }

            if (isLogin) {
                // ✅ 3. On successful login, call the context's login function
                // This will update the state and trigger the redirect automatically.
                if (data.token && data.user) {
                    login(data.user, data.token); 
                } else {
                    throw new Error("Login failed! Invalid data received from server.");
                }
            } else {
                alert("Signup Successful! Please log in.");
                setIsLogin(true); // Switch to the login form after successful signup
            }

        } catch (error) {
            console.error("❌ Error:", error.message);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="toggle-buttons">
                    <button className={isLogin ? "active" : ""} onClick={toggleForm} disabled={loading}>
                        Login
                    </button>
                    <button className={!isLogin ? "active" : ""} onClick={toggleForm} disabled={loading}>
                        Signup
                    </button>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <h2>{isLogin ? "Login" : "Signup"}</h2>
                    {!isLogin && (
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    )}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? "Processing..." : isLogin ? "Login" : "Signup"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginSignup;