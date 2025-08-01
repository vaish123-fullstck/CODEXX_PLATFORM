import React, { useContext } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { LayoutProvider } from './context/LayoutContext';
import { MainLayout } from './components/MainLayout';

// Import your pages
import LandingPage from "./components/LandingPage";
import LoginSignup from "./components/LoginSignup";
import Dashboard from "./pages/Dashboard";
import AllPosts from "./pages/AllPosts";
import ProjectOverview from "./pages/ProjectOverview"; // ✅ Import the new overview page
import EditorPage from "./pages/PostPage"; // This is now the dedicated editor page
import CreatePost from "./pages/CreatePost";


// This component protects routes that require a user to be logged in
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <div>Loading...</div>;
    return user ? children : <Navigate to="/auth" />;
};

// This component handles the auth page itself
const AuthRoute = () => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <div>Loading...</div>;
    return user ? <Navigate to="/dashboard" /> : <LoginSignup />;
};


const App = () => {
    return (
        <AuthProvider>
            <LayoutProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Public routes that do not have the main layout */}
                        <Route path="/landing" element={<LandingPage />} />
                        <Route path="/auth" element={<AuthRoute />} />
                        
                        {/* Protected routes that HAVE the main layout */}
                        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/posts" element={<AllPosts />} />
                            
                            {/* ✅ UPDATED ROUTES for the new workflow */}
                            <Route path="/posts/:id" element={<ProjectOverview />} />
                            <Route path="/posts/:id/editor" element={<EditorPage />} />

                            <Route path="/create-post" element={<CreatePost />} />
                        </Route>
                        
                        {/* Default/fallback route */}
                        <Route path="*" element={<LandingPage />} />
                    </Routes>
                </BrowserRouter>
            </LayoutProvider>
        </AuthProvider>
    );
};

export default App;
