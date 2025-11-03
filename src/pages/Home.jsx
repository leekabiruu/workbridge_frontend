import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JobCard from "../components/JobCard";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import '../index.css';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate(); 
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionMessages, setActionMessages] = useState({});

  const JOBS_PER_PAGE = 9;

  // Redirect employers to their dashboard
  useEffect(() => {
    if (user?.role === 'employer') {
      navigate('/employer-dashboard');
    }
  }, [user, navigate]);

  const fetchJobs = async (page = 1) => {
    try {
      setLoading(true);
      const endpoint = user ? `/jobseekers/jobs?page=${page}&limit=${JOBS_PER_PAGE}` : `/jobs?page=${page}&limit=${JOBS_PER_PAGE}`;
      const res = await api.get(endpoint);
      const data = res.data.jobs || res.data;

      setJobs(data);
      setTotalPages(
        res.data.totalPages ||
          Math.ceil((res.data.total || data.length) / JOBS_PER_PAGE)
      );
      setError("");
    } catch (err) {
      console.error(err);
      // Always fallback to public endpoint on any error
      try {
        const publicRes = await api.get(`/jobs?page=${page}&limit=${JOBS_PER_PAGE}`);
        const publicData = publicRes.data.jobs || publicRes.data;
        setJobs(publicData);
        setTotalPages(
          publicRes.data.totalPages ||
            Math.ceil((publicRes.data.total || publicData.length) / JOBS_PER_PAGE)
        );
        setError("");
      } catch (publicErr) {
        console.error(publicErr);
        setError("Something went wrong. Try refreshing?");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage]);

  const applyJob = async (jobId) => {
    if (!user || !user.access) {
      setActionMessages((prev) => ({ ...prev, [jobId]: "Redirecting to login..." }));
      setTimeout(() => navigate('/login'), 1000);
      return { success: false };
    }
    try {
      const res = await api.post(`/applications`, { job_id: jobId });
      if (res.status === 201) {
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job.id === jobId ? { ...job, is_applied: true } : job
          )
        );
        setActionMessages((prev) => ({ ...prev, [jobId]: "Applied!" }));
        return { success: true };
      } else if (res.status === 400 && res.data?.error === "Already applied") {
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job.id === jobId ? { ...job, is_applied: true } : job
          )
        );
        setActionMessages((prev) => ({ ...prev, [jobId]: "Already applied" }));
        return { success: true };
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400 && err.response?.data?.error === "Already applied") {
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job.id === jobId ? { ...job, is_applied: true } : job
          )
        );
        setActionMessages((prev) => ({ ...prev, [jobId]: "Already applied" }));
        return { success: true };
      } else if (err.response?.status === 401) {
        setActionMessages((prev) => ({ ...prev, [jobId]: "Please login to apply" }));
      } else {
        setActionMessages((prev) => ({ ...prev, [jobId]: err.response?.data?.error || "Failed to apply" }));
      }
    }
    return { success: false };
  };

  const removeApplication = async (jobId) => {
    try {
      const res = await api.delete(`/applications/${jobId}`);
      if (res.status === 200) {
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job.id === jobId ? { ...job, is_applied: false } : job
          )
        );
        setActionMessages((prev) => ({ ...prev, [jobId]: "Removed" }));
        return { success: true };
      }
    } catch (err) {
      console.error(err);
      setActionMessages((prev) => ({ ...prev, [jobId]: err.response?.data?.error || "Failed to remove application" }));
    }
    return { success: false };
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-50">
      {/* 🧑‍💼 Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Hey {user?.name || "there"}!
        </h1>
        <p className="text-gray-600 mt-2">
          {user?.role === "employer"
            ? "Ready to post some jobs?"
            : "Let's find you something great."}
        </p>
      </div>

      {/* 🔍 Search Bar */}
      <div className="flex justify-center">
        <input
          type="text"
          placeholder="What kind of job are you looking for?"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ⚠️ Error Message */}
      {error && (
        <p className="text-red-500 text-center mt-4 font-medium">{error}</p>
      )}

      {/* 🧱 Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {loading ? (
          Array.from({ length: JOBS_PER_PAGE }).map((_, i) => (
            <div
              key={i}
              className="border p-4 rounded-md shadow-sm bg-gray-100 animate-pulse h-60"
            />
          ))
        ) : filteredJobs.length ? (
          filteredJobs.map((job) => (
            <div key={job.id}>
              <JobCard 
                job={job} 
                onApply={() => applyJob(job.id)}
                onRemoveApplication={() => removeApplication(job.id)}
              />
              {actionMessages[job.id] && (
                <p className="text-green-600 text-sm mt-1">{actionMessages[job.id]}</p>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center p-6 border rounded-md bg-gray-100 text-gray-600">
            Hmm, nothing matches that search. Try something else?
          </div>
        )}
      </div>

      {/* 📄 Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
