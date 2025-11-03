import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import '../index.css';

export default function JobDetails() {
  const { id } = useParams(); 
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applied, setApplied] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
        setApplied(res.data.is_applied || false);
      } catch (err) {
        console.error(err);
        setError("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    const res = await api.post(`/applications`, { job_id: parseInt(id) });
    setApplied(true);
    if (res.status === 201) {
      setMessage("Application submitted!");
    } else {
      setMessage("You have already applied for this job");
    }
    setTimeout(() => setMessage(""), 3000);
  };



  if (loading) return <p className="text-center mt-10">Loading job details...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!job) return <p className="text-center mt-10">Job not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
      <p className="text-gray-600">{job.location} | {job.job_type} | {job.salary_range}</p>
      <p className="text-gray-500 text-sm mb-4">Posted by: {job.employer_name} on {new Date(job.created_at).toLocaleDateString()}</p>
      <p className="text-gray-700 whitespace-pre-line mb-6">{job.description}</p>

      <div className="flex gap-4">
        <button
          disabled={applied}
          className={`px-4 py-2 rounded text-white ${applied ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
          onClick={handleApply}
        >
          {applied ? "Applied" : "Apply"}
        </button>
      </div>

      {message && <p className="mt-4 text-blue-600">{message}</p>}
    </div>
  );
}
