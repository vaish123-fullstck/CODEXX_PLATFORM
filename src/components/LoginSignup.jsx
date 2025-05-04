import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import for navigation
import "./LoginSignup.css";

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅ Navigation hook

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

    // ✅ Fixed API Port to Match Backend (5000)
    const endpoint = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/signup";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // ✅ Check if the response is OK (200-299)
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong!");
      }

      console.log("✅ Success:", data);

      if (isLogin) {
        // ✅ Store token & redirect to dashboard ONLY after login
        if (data.token) {
          localStorage.setItem("token", data.token);
          console.log("🔑 Token Stored:", data.token);
          alert("Login Successful!");
          navigate("/dashboard"); // ✅ Redirect to dashboard
        } else {
          throw new Error("Login failed! No token received.");
        }
      } else {
        // ✅ Signup success message, but NO redirect
        alert("Signup Successful! Now login.");
      }

      // Reset form after success
      setFormData({ username: "", email: "", password: "" });

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
        {/* Toggle Buttons */}
        <div className="toggle-buttons">
          <button className={isLogin ? "active" : ""} onClick={toggleForm} disabled={loading}>
            Login
          </button>
          <button className={!isLogin ? "active" : ""} onClick={toggleForm} disabled={loading}>
            Signup
          </button>
        </div>

        {/* Form */}
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
