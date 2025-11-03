import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import '../index.css';

export default function AdminPanel() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [error, setError] = useState("");

  
  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const res = await api.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch users.");
      } finally {
        setLoadingUsers(false);
      }
    };

    const fetchJobs = async () => {
      try {
        setLoadingJobs(true);
        const res = await api.get("/jobs");
        setJobs(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch jobs.");
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchUsers();
    fetchJobs();
  }, [user]);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete user.");
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await api.delete(`/jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete job.");
    }
  };

  if (!user || user.role !== "admin")
    return <p className="text-center mt-10">Access denied. Admins only.</p>;

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-center">Admin Panel</h2>

      {error && <p className="text-red-500">{error}</p>}

      {/* Users Table */}
      <div>
        <h3 className="text-xl font-semibold mb-4">All Users</h3>
        {loadingUsers ? (
          <p>Loading users...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">Name / Email</th>
                  <th className="px-4 py-2 border">Role</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="text-center">
                    <td className="px-4 py-2 border">{u.id}</td>
                    <td className="px-4 py-2 border">{u.name || u.email}</td>
                    <td className="px-4 py-2 border">{u.role}</td>
                    <td className="px-4 py-2 border space-x-2">
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Jobs Table */}
      <div>
        <h3 className="text-xl font-semibold mb-4">All Jobs</h3>
        {loadingJobs ? (
          <p>Loading jobs...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">Title</th>
                  <th className="px-4 py-2 border">Employer</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => (
                  <tr key={j.id} className="text-center">
                    <td className="px-4 py-2 border">{j.id}</td>
                    <td className="px-4 py-2 border">{j.title}</td>
                    <td className="px-4 py-2 border">{j.employer_name}</td>
                    <td className="px-4 py-2 border space-x-2">
                      <button
                        onClick={() => handleDeleteJob(j.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
