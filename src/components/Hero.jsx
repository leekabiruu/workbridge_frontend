import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import '../index.css';

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/jobs');
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-24 text-center">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-5xl font-extrabold mb-6">
         Your next career move starts here
        </h1>
        <p className="text-lg mb-8 text-gray-100">
          Browse jobs from leading companies and take the next step in your career.
        </p>
        <button 
          onClick={handleGetStarted}
          className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
        >
          Get Started
        </button>
      </div>
    </section>
  );
};

export default Hero;
