import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useContext(AuthContext); // Get user from context

  return (
    <div className="dashboard-page">
      {/* Background */}
      <div className="aurora-bg"></div>

      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="profile-card">
            <img src="profile-pic-url" alt="Profile" className="profile-pic" />
            <h3>Welcome, {user?.username || "User"}!</h3> {/* Display username */}
          </div>

          <nav className="dashboard-nav">
            <button>Home</button>
            <button>Projects</button>
            <button>Favorites</button>
            <button className="logout-btn">Logout</button>
          </nav>

          <button className="feed-btn" onClick={() => window.location.href = "/editor"}>
             + New Project
          </button>
        </aside>

        {/* Main Content */}
        <main className="dashboard-content">
          <h2>Your Feed</h2>

          {/* Snippet Grid */}
          <div className="feed-grid">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="empty-box">No Content</div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
