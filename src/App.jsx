import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import LoginSignup from "./components/LoginSignup";
import Dashboard from "./components/Dashboard";
import CodeEditor from "./components/Editor";
import { AuthProvider } from "./context/AuthContext";

async function startElectron() {
    try {
        const response = await fetch("http://localhost:5174/is-electron-running"); // ✅ Corrected Port
        const data = await response.json();

        if (data.message.includes("Electron is running")) {
            console.log("✅ Electron is already running.");
        } else {
            console.warn("❌ Electron is not running.");
        }
    } catch (error) {
        console.error("❌ Failed to check Electron status:", error);
    }
}

const App = () => {
    useEffect(() => {
        if (typeof window !== "undefined") {
            startElectron();
        }
    }, []);

    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/auth" element={<LoginSignup />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/editor" element={<CodeEditor />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;
