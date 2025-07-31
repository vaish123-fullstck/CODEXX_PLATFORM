import React, { useEffect } from "react";
import "./Aurora.css"; // Import the CSS file for styling

const Aurora = () => {
  useEffect(() => {
    const colors = ["#ff007f", "#ff6600", "#00ccff", "#9900ff"];
    const elements = document.querySelectorAll(".aurora");

    elements.forEach((element, index) => {
      element.style.backgroundColor = colors[index % colors.length];
    });
  }, []);

  return (
    <div className="aurora-container">
      <div className="aurora"></div>
      <div className="aurora"></div>
      <div className="aurora"></div>
      <div className="aurora"></div>
    </div>
  );
};

export default Aurora;
