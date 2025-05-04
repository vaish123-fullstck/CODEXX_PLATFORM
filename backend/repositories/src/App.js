import React from 'react';
import ReactDOM from 'react-dom/client'; // Correct import for ReactDOM
import './App.css'; // Import App.css for styling

// Defining the Car class
class Car {
  constructor(name) {
    this.brand = name;
  }

  present() {
    return "I have a " + this.brand;
  }
}

// Defining the Model class, extending Car
class Model extends Car {
  constructor(name, mod) {
    super(name);
    this.model = mod;
  }

  show() {
    return this.present() + ", it is a " + this.model;
  }
}

// React functional component
function App() {
  const mycar = new Model("Ford", "Mustang");

  return (
    <div className="App-header">
      <h1>{mycar.show()}</h1>
    </div>
  );
}

// Rendering the App component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

export default App; // Ensure App is exported as default
