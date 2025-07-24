import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function LandingPage() {
  return (
    <div className="hero">
      <h1>Identify bugs with AI</h1>
      <Link className="hero-button" to="/identify">Get Started</Link>
    </div>
  );
}

export default LandingPage;

