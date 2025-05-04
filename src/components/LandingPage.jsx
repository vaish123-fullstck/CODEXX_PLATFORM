import React from "react";
import { Link } from "react-router-dom";
import Aurora from "./Backgrounds/Aurora"; // Aurora background component
import "./LandingPage.css"; // Custom styles

export default function LandingPage() {
  return (
    <div className="landing">
      {/* ✅ Aurora background stays fixed */}
      <Aurora />

      {/* ✅ Floating Navbar (Fixed Position) */}
      <nav className="landing-navbar">
        <h1 className="logo">CodeX</h1>
        <ul className="nav-links">
          <li><Link to="/auth">Login</Link></li>
          <li><Link to="/auth">Sign Up</Link></li>
        </ul>
      </nav>

      {/* ✅ Main Content */}
      <div className="landing-content">
        <h1>Welcome to CodeX</h1>
        <p>Share, Discover, and Collaborate on Code Snippets and Technical Blogs.</p>
        <Link to="/auth">
          <button className="explore-btn">Explore Now</button>
        </Link>
      </div>
    </div>
  );
}
