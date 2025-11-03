import React, { useState, useEffect } from "react";
import Hero from "../components/Hero";
import JobList from "../components/JobList";
import CompanySection from "../components/CompanySection";
import TestimonialSection from "../components/TestimonialSection";
import api from "../services/api";
import { Link } from "react-router-dom";
import "../index.css";

function LandingPage() {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        setLoading(true);
        const res = await api.get("/jobs?limit=5");

        const data = res.data;
        if (data && typeof data === 'object' && !data.message) {
          const jobs = data.jobs || (Array.isArray(data) ? data : []);
          if (Array.isArray(jobs)) {
            setFeaturedJobs(jobs);
          } else {
            setError("Invalid jobs format");
          }
        } else {
          setError(data?.message || "Failed to load featured jobs.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load featured jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedJobs();
  }, []);

  return (
    <>
      <Hero />

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
          Featured Opportunities
        </h2>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-lg p-4 bg-gray-200 h-48 animate-pulse"></div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <p className="text-red-500 text-center mb-6">{error}</p>
        )}

        {/* Jobs */}
        {!loading && !error && featuredJobs.length > 0 && (
          <JobList jobs={featuredJobs} />
        )}

        {/* No jobs */}
        {!loading && !error && featuredJobs.length === 0 && (
          <p className="text-center text-gray-600">
            No featured jobs available yet. Check back soon!
          </p>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/jobs"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
          >
            View All Jobs
          </Link>
        </div>
      </section>

      <CompanySection />
      <TestimonialSection />
    </>
  );
}

export default LandingPage;
