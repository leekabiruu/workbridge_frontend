import React from "react";
import { Link } from "react-router-dom";
import { FaBullseye, FaChartLine, FaUsers } from "react-icons/fa";
import '../index.css';

const About = () => {
  return (
    <main className="bg-gray-50 min-h-screen flex flex-col items-center py-12 px-6">
      {/* Header Section */}
      <header className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <FaUsers className="text-blue-600 text-5xl" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800">About WORKBRIDGE</h1>
        <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
          Bridging the gap between talented job seekers and leading employers across industries.
        </p>
      </header>

      {/* Mission & Vision Section */}
      <section className="max-w-6xl w-full bg-white rounded-2xl shadow-md p-8 md:p-12 flex flex-col md:flex-row gap-10 items-center mb-16">
        <div className="md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500"
            alt="Team collaboration and analytics"
            className="rounded-xl shadow-lg w-full object-cover"
          />
        </div>

        <div className="md:w-1/2 space-y-8">
          <article>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <FaBullseye className="text-blue-600" /> Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              At <span className="font-medium text-gray-800">WorkBridge</span>, our mission is to bridge the gap between
              skilled professionals and leading employers. We aim to simplify recruitment, empower career growth, and foster
              meaningful professional connections.
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <FaChartLine className="text-blue-600" /> What We Do
            </h2>
            <p className="text-gray-600 leading-relaxed">
              WorkBridge offers a unified job-matching platform that allows job seekers to discover tailored opportunities,
              track applications, and connect with potential employers. Businesses can post openings, screen candidates, and manage
              hiring workflows efficiently.
            </p>
          </article>
        </div>
      </section>

      {/* Impact Section */}
      <section className="max-w-5xl w-full mb-16 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-10">Impact by the Numbers</h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex items-center gap-5 p-6 bg-white shadow rounded-2xl hover:shadow-lg transition-shadow">
            <div className="text-blue-600 text-5xl">🎯</div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-800 text-lg">Successful Placements</h3>
              <p className="text-gray-600">Over 20% of our users secure jobs within the first month.</p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-6 bg-white shadow rounded-2xl hover:shadow-lg transition-shadow">
            <div className="text-blue-600 text-5xl">🏆</div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-800 text-lg">Employer Success Rate</h3>
              <p className="text-gray-600">85% of employers find qualified candidates through our platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="text-center text-gray-600 max-w-3xl mx-auto">
        <p>
          Want to learn more? Visit our{" "}
          <Link to="/contact" className="text-blue-600 font-semibold hover:underline">
            Contact
          </Link>{" "}
          page or reach out directly. We’re committed to helping you grow your career or find the perfect hire.
        </p>
      </footer>
    </main>
  );
};

export default About;
