import React, { useContext } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { MainLayout } from './components/MainLayout';

// Import your pages
import LandingPage from "./components/LandingPage";
import LoginSignup from "./components/LoginSignup";
import Dashboard from "./pages/Dashboard";
import AllPosts from "./pages/AllPosts";
import PostPage from "./pages/PostPage";
import CreatePost from "./pages/CreatePost";


// This component protects routes that require a user to be logged in
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <div>Loading...</div>; // Optional: show a loading indicator
    return user ? children : <Navigate to="/auth" />;
};

// This component handles the auth page itself
const AuthRoute = () => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <div>Loading...</div>;
    // If user is already logged in, redirect them away from the login page
    return user ? <Navigate to="/dashboard" /> : <LoginSignup />;
};


const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public routes that do not have the main layout */}
                    <Route path="/landing" element={<LandingPage />} />
                    <Route path="/auth" element={<AuthRoute />} />
                    
                    {/* Protected routes that HAVE the main layout */}
                    <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/posts" element={<AllPosts />} />
                        <Route path="/posts/:id" element={<PostPage />} />
                        <Route path="/create-post" element={<CreatePost />} />
                    </Route>
                    
                    {/* Default/fallback route */}
                    <Route path="*" element={<LandingPage />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;