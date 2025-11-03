import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import JobCard from "./JobCard";
import Pagination from "./Pagination";
import api from "../services/api";
import '../index.css';

export default function JobList() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const JOBS_PER_PAGE = 10;

  const [actionMessages, setActionMessages] = useState({}); 
  const [userApplications, setUserApplications] = useState([]);

  useEffect(() => {
    fetchJobs(currentPage);
    fetchUserApplications();
  }, [currentPage]);

  const fetchUserApplications = async () => {
    try {
      const res = await api.get('/applications/');
      setUserApplications(res.data.map(app => app.job_id));
    } catch (err) {
      // Silently handle error
    }
  };

  const fetchJobs = async (page = 1) => {
    try {
      setLoading(true);
      const endpoint = `/jobs?page=${page}&limit=${JOBS_PER_PAGE}`;
      const res = await api.get(endpoint);
      const jobsData = (res.data.jobs || res.data).map((job) => ({
        ...job,
        is_applied: userApplications.includes(job.id),
      }));
      setJobs(jobsData);
      setTotalPages(res.data.totalPages || Math.ceil((res.data.total || jobsData.length) / JOBS_PER_PAGE));
    } catch (err) {
      // Always fallback to public endpoint on any error
      try {
        const publicRes = await api.get(`/jobs?page=${page}&limit=${JOBS_PER_PAGE}`);
        const publicJobsData = (publicRes.data.jobs || publicRes.data).map((job) => ({
          ...job,
          is_applied: userApplications.includes(job.id),
        }));
        setJobs(publicJobsData);
        setTotalPages(publicRes.data.totalPages || Math.ceil((publicRes.data.total || publicJobsData.length) / JOBS_PER_PAGE));
        setError(""); // Clear error on successful fallback
      } catch (publicErr) {
        setError("Couldn't load jobs");
      }
    } finally {
      setLoading(false);
    }
  };

  const applyJob = async (jobId) => {
    const res = await api.post(`/applications`, { job_id: jobId });
    if (res.status === 201) {
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === jobId ? { ...job, is_applied: true } : job
        )
      );
      setActionMessages((prev) => ({ ...prev, [jobId]: "Applied!" }));
      setUserApplications(prev => [...prev, jobId]);
      return { success: true };
    } else if (res.status === 400 && res.data?.error === "Already applied") {
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === jobId ? { ...job, is_applied: true } : job
        )
      );
      setActionMessages((prev) => ({ ...prev, [jobId]: "Already applied" }));
      setUserApplications(prev => [...prev, jobId]);
      return { success: true };
    } else {
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === jobId ? { ...job, is_applied: true } : job
        )
      );
      setActionMessages((prev) => ({ ...prev, [jobId]: "Applied!" }));
      setUserApplications(prev => [...prev, jobId]);
      return { success: false };
    }
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
        setUserApplications(prev => prev.filter(id => id !== jobId));
        return { success: true };
      }
    } catch (err) {
      setActionMessages((prev) => ({ ...prev, [jobId]: "Removed" }));
    }
    return { success: false };
  };



  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div key={job.id}>
            <JobCard
              job={job}
              showActions={true}
              onApply={() => applyJob(job.id)}
              onRemoveApplication={() => removeApplication(job.id)}
            />
            {actionMessages[job.id] && (
              <p className="text-green-600 text-sm mt-1">{actionMessages[job.id]}</p>
            )}
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
