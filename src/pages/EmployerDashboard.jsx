import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import JobPostForm from "../components/JobPostForm";
import EmployerApplications from "../components/EmployerApplications";
import '../index.css';

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showJobForm, setShowJobForm] = useState(false);
  const [showApplications, setShowApplications] = useState(false);

  const fetchEmployerData = async () => {
    if (!user) return;
    
    setLoading(true);
    const profileRes = await api.get("/employer/me");
    setProfile(profileRes.data);

    const appRes = await api.get("/employer/applications");
    setApplications(appRes.data);

    const jobsRes = await api.get("/employer/jobs");
    setJobs(jobsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployerData();
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
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {profile?.name?.[0] || 'E'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {profile?.name || 'Employer'}!</h1>
              <p className="text-gray-600">{profile?.email || profile?.username}</p>
              <p className="text-green-600 font-medium">Employer Account</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <h3 className="text-2xl font-bold text-green-600">{jobs.length}</h3>
            <p className="text-gray-600">Active Job Posts</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <h3 className="text-2xl font-bold text-blue-600">{applications.length}</h3>
            <p className="text-gray-600">Total Applications</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <h3 className="text-2xl font-bold text-purple-600">0</h3>
            <p className="text-gray-600">Interviews Scheduled</p>
          </div>
        </div>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Applications</h3>
          {applications.length ? (
            <div className="space-y-4">
              {applications.slice(0, 5).map((app, index) => (
                <div key={`app-${app.id}-${index}`} className="border-l-4 border-green-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">{app.job.title}</h4>
                  <p className="text-gray-600">{app.job.location} • {app.job.job_type}</p>
                  <p className="text-sm text-gray-500">Application Status: {app.status}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No applications yet</p>
              <p className="text-gray-400">Post some jobs to start receiving applications</p>
            </div>
          )}
        </section>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Your Posted Jobs</h3>
          {jobs.length ? (
            <div className="space-y-4 mb-6">
              {jobs.map((job) => (
                <div key={job.id} className="border-l-4 border-green-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">{job.title}</h4>
                  <p className="text-gray-600">{job.location} • {job.job_type} • {job.salary_range}</p>
                  <p className="text-sm text-gray-500">{job.description.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 mb-6">
              <p className="text-gray-500">No jobs posted yet</p>
            </div>
          )}
          
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Quick Actions</h4>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <button 
              onClick={() => setShowJobForm(true)}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
            >
              Post New Job
            </button>
            <button 
              onClick={() => setShowApplications(true)}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              View All Applications
            </button>
          </div>
        </section>

        {showJobForm && (
          <JobPostForm 
            onJobPosted={() => {
              setShowJobForm(false);
              fetchEmployerData();
            }}
            onCancel={() => setShowJobForm(false)}
          />
        )}

        {showApplications && (
          <section className="bg-white rounded-lg shadow-sm p-6">
            <EmployerApplications 
              onBack={() => setShowApplications(false)}
            />
          </section>
        )}
      </div>
    </div>
  );
}