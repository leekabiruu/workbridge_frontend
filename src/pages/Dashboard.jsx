import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import JobCard from "../components/JobCard";
import '../index.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [actionMessages, setActionMessages] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfileAndData = async () => {
    if (!user) return;
    
    setLoading(true);
    const profileRes = await api.get("/jobseekers/me");
    if (profileRes.status === 401) {
      setLoading(false);
      return;
    }
    setProfile(profileRes.data);

    const appRes = await api.get("/applications/");
    if (appRes.status !== 401) {
      setApplications(appRes.data);
    }

    const interviewRes = await api.get("/interviews/jobseeker");
    if (interviewRes.status !== 401) {
      setInterviews(interviewRes.data || []);
    }
    setLoading(false);
  };

  const removeApplication = async (jobId) => {
    const res = await api.delete(`/applications/${jobId}`);
    if (res.status === 200) {
      setApplications((prevApps) => prevApps.filter((app) => app.job.id !== jobId));
      setActionMessages((prev) => ({ ...prev, [jobId]: "Removed" }));
      setTimeout(() => {
        setActionMessages((prev) => ({ ...prev, [jobId]: "" }));
      }, 3000);
      return { success: true };
    }
    return { success: false };
  };

  useEffect(() => {
    fetchProfileAndData();
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        fetchProfileAndData();
      }
    }, 10000); 
    return () => clearInterval(interval);
  }, [user]);

  if (!user) {
    return (
      <p className="text-center mt-10 text-red-500">
        You need to login first.
      </p>
    );
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {profile?.name?.[0] || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hey {profile?.name || 'there'}!</h1>
              <p className="text-gray-600">{profile?.email || profile?.username}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

      {user.role === "job_seeker" && (
        <div className="space-y-6">
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Jobs You've Applied For</h3>
            {applications.length ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {applications.map((app, index) => (
                  <div key={`app-${app.id}-${index}`}>
                    <JobCard
                      job={{ ...app.job, is_applied: true }}
                      showActions={true}
                      onRemoveApplication={() => removeApplication(app.job.id)}
                    />
                    {actionMessages[app.job.id] && (
                      <p className="text-green-600 text-sm mt-1">{actionMessages[app.job.id]}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">Nothing here yet</p>
                <p className="text-gray-400">Apply to some jobs and they'll show up here</p>
              </div>
            )}
          </section>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Scheduled Interviews</h3>
          {interviews.length ? (
            <div className="space-y-4">
              {interviews.map((interview) => (
                <div key={interview.id} className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50">
                  <h4 className="font-semibold text-gray-900">{interview.job.title}</h4>
                  <p className="text-gray-600">{interview.job.employer_name}</p>
                  <div className="mt-2 text-sm">
                    <p><strong>Date:</strong> {interview.date}</p>
                    <p><strong>Time:</strong> {interview.time}</p>
                    <p><strong>Location:</strong> {interview.location}</p>
                    {interview.notes && <p><strong>Notes:</strong> {interview.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No interviews scheduled</p>
              <p className="text-gray-400">Interviews will appear here when employers schedule them</p>
            </div>
          )}
        </section>

        </div>
      )}

      {user.role === "employer" && (
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Your Posted Jobs</h3>
          {jobs.length ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} showActions={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No jobs posted yet</p>
              <p className="text-gray-400">Create your first job posting to get started</p>
            </div>
          )}
        </section>
      )}
      </div>
    </div>
  );
}
