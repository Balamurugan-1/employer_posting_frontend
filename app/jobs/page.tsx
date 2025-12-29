// src/app/jobs/page.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from '@/utils/api';

// Define the Job interface outside
interface Job {
  _id: string;
  title: string;
  company_name: string;
  location: string;
}

export default function Home() {
  // --- 1. STATE MUST BE INSIDE THE COMPONENT ---
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Application Modal State
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [uploading, setUploading] = useState(false);

  // --- 2. FUNCTIONS MUST BE INSIDE TO ACCESS STATE ---
  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedJob) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", applicantName);
    formData.append("email", applicantEmail);
    formData.append("job_id", selectedJob);

    try {
      await api.post("/applications/apply", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Application Sent! The employer will see your AI Score.");
      setSelectedJob(null); // Close modal
      
      // Reset form fields
      setFile(null);
      setApplicantName("");
      setApplicantEmail("");
    } catch (error) {
      alert("Failed to apply.");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/jobs/'); // Ensure this matches your backend route
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Job Portal</h1>

        <div className="flex gap-4">
            <Link href="/smart-match">
            <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200 font-medium">
                ✨ AI Match
            </button>
            </Link>
            {/* Note: In a real app, you might hide these buttons for job seekers 
                or show them only if logged in as an employer */}
            <Link href="/my-jobs">
            <button className="text-gray-600 hover:text-black px-4 py-2 font-medium border border-gray-300 rounded-md">
                My Dashboard
            </button>
            </Link>
            <Link href="/post-job">
            <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
                Post a Job
            </button>
            </Link>
        </div>
      </div>

      {loading ? (
        <p>Loading jobs...</p>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div key={job._id} className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-blue-600">{job.title}</h2>
              <p className="text-gray-600">{job.company_name}</p>
              <p className="text-sm text-gray-500 mt-2">📍 {job.location}</p>
              
              <button
                onClick={() => setSelectedJob(job._id)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full font-medium"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      )}

      {/* --- MODAL --- */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
            <h2 className="text-xl font-bold mb-4">Apply for Job</h2>
            <form onSubmit={handleApply} className="space-y-4">
              <input 
                placeholder="Your Name" 
                className="w-full p-2 border border-gray-300 rounded"
                value={applicantName}
                onChange={e => setApplicantName(e.target.value)} 
                required 
              />
              <input 
                placeholder="Your Email" 
                type="email"
                className="w-full p-2 border border-gray-300 rounded"
                value={applicantEmail}
                onChange={e => setApplicantEmail(e.target.value)} 
                required 
              />
              <div>
                <label className="block text-sm mb-1 font-medium">Resume (PDF)</label>
                <input 
                  type="file" 
                  accept=".pdf"
                  className="w-full p-2 border border-gray-300 rounded"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={uploading} 
                className="w-full bg-green-600 text-white p-3 rounded font-bold hover:bg-green-700 disabled:opacity-50"
              >
                {uploading ? "Analyzing Resume..." : "Submit Application"}
              </button>
              <button 
                type="button" 
                onClick={() => setSelectedJob(null)} 
                className="w-full mt-2 text-gray-500 hover:text-gray-800"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}