import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// ✅ Create Auth Context
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;

      // ✅ Fetch user details from backend using the stored token
      axios
        .get("http://localhost:5000/api/auth/me") // adjust if your backend URL differs
        .then((res) => {
          setUser(res.data.user);
        })
        .catch((err) => {
          console.error("AuthContext fetch error:", err.response?.data?.message || err.message);
          localStorage.removeItem("token");
        });
    }
  }, []);

  // ✅ Login function
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setUser(userData);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  // ✅ Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
