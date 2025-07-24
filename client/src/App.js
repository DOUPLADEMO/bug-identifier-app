
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/LandingPage';
import IdentifyBug from './pages/IdentifyBug';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/identify" element={<IdentifyBug />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
