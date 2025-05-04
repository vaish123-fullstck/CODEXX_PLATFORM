import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Your global CSS file
import App from './App'; // Import the App component
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
