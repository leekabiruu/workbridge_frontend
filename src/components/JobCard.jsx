import React, { useState, useEffect } from "react";
import '../index.css';

export default function JobCard({ job, showActions = true, onApply, onRemoveApplication, actionMessage }) {
  const [applied, setApplied] = useState(job.is_applied || false);

  useEffect(() => {
    setApplied(job.is_applied || false);
  }, [job.is_applied]);

  const handleApply = async () => {
    if (!onApply) return;
    const result = await onApply();
    if (result?.success) setApplied(true);
  };

  const handleRemoveApplication = async () => {
    if (!onRemoveApplication) return;
    const result = await onRemoveApplication();
    if (result?.success) setApplied(false);
  };

  return (
    <div className="border p-4 rounded-md shadow-sm bg-white flex flex-col h-full">
      <div className="flex-grow">
        <h3 className="font-bold text-lg">{job.title}</h3>
        <p className="text-gray-600">{job.location}</p>
        <p className="text-gray-600">{job.job_type} | {job.salary_range}</p>
        <p className="text-gray-500 text-sm">Posted by: {job.employer_name}</p>
        <p className="text-gray-500 text-sm">{new Date(job.created_at).toLocaleDateString()}</p>
        <p className="mt-2 text-gray-700">{job.description?.substring(0, 100)}...</p>
      </div>

      {showActions && (
        <div className="mt-4 flex gap-2">
          {!applied ? (
            <button
              className="px-3 py-2 rounded text-white flex-1 bg-green-500 hover:bg-green-600"
              onClick={handleApply}
            >
              Apply
            </button>
          ) : (
            <button
              className="px-3 py-2 rounded text-white flex-1 bg-red-500 hover:bg-red-600"
              onClick={handleRemoveApplication}
            >
              Remove Application
            </button>
          )}
        </div>
      )}

      {actionMessage && <p className="mt-2 text-sm text-blue-600">{actionMessage}</p>}
    </div>
  );
}
