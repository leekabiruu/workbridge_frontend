import { useState, useEffect } from "react";
import api from "../services/api";
import InterviewScheduler from "./InterviewScheduler";

export default function EmployerApplications({ onBack }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState({});
  const [schedulingInterview, setSchedulingInterview] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/employer/applications");
      setApplications(res.data);
    } catch (err) {
      setError("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appId, status) => {
    try {
      setUpdating(prev => ({ ...prev, [appId]: true }));
      await api.put(`/applications/${appId}/status`, { status });
      setApplications(prev => 
        prev.map(app => 
          app.id === appId ? { ...app, status } : app
        )
      );
      if (status === 'accepted') {
        setTimeout(() => setSchedulingInterview(
          applications.find(app => app.id === appId)
        ), 500);
      }
    } catch (err) {
      setError("Failed to update application status");
    } finally {
      setUpdating(prev => ({ ...prev, [appId]: false }));
    }
  };

  if (loading) return <p className="text-center mt-10">Loading applications...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">All Applications</h3>
        <button
          onClick={onBack}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
        >
          Back to Dashboard
        </button>
      </div>

      {applications.length ? (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{app.job.title}</h4>
                  <p className="text-gray-600">{app.job.location} • {app.job.job_type} • {app.job.salary_range}</p>
                  <div className="mt-2">
                    <p className="text-sm text-gray-700">
                      <strong>Applicant:</strong> {app.applicant_name}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Email:</strong> {app.applicant_email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    app.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800'
                      : app.status === 'accepted'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {app.status}
                  </span>
                  <div className="mt-2 space-x-2">
                    {app.status === 'accepted' ? (
                      <button 
                        onClick={() => setSchedulingInterview(app)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        Schedule Interview
                      </button>
                    ) : (
                      <>
                        <button 
                          onClick={() => updateStatus(app.id, 'accepted')}
                          disabled={updating[app.id]}
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 disabled:opacity-50"
                        >
                          {updating[app.id] ? 'Updating...' : 'Accept'}
                        </button>
                        <button 
                          onClick={() => updateStatus(app.id, 'rejected')}
                          disabled={updating[app.id]}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:opacity-50"
                        >
                          {updating[app.id] ? 'Updating...' : 'Reject'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No applications received yet</p>
          <p className="text-gray-400">Applications will appear here when job seekers apply to your jobs</p>
        </div>
      )}

      {schedulingInterview && (
        <InterviewScheduler 
          application={schedulingInterview}
          onScheduled={() => {
            setSchedulingInterview(null);
            fetchApplications();
          }}
          onCancel={() => setSchedulingInterview(null)}
        />
      )}
    </div>
  );
}