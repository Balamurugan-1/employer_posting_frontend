'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Job {
  _id: string;
  title: string;
  company_name: string;
  location: string;
  created_at: string;
  salary_range?: string; 
}

export default function EmployerDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }
      try {
        const res = await api.get('/jobs/my-jobs');
        setJobs(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this job?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      setJobs(jobs.filter((j) => j._id !== id));
    } catch (e) {
      alert('Error deleting job');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-gray-500">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
 
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
          <span className="text-xl font-bold text-gray-800 tracking-tight">DataHire<span className="text-blue-600">.AI</span></span>
        </div>
        <div className="flex items-center gap-6">
           <Link href="/jobs" className="text-gray-500 hover:text-black font-medium">Public Job Board</Link>
           <button onClick={handleLogout} className="text-red-600 font-medium hover:text-red-800">Sign Out</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        
       
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium uppercase">Active Jobs</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{jobs.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium uppercase">Total Views</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">1,240 <span className="text-green-500 text-sm font-normal">↑ 12%</span></p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium uppercase">Actions</h3>
              <p className="text-sm text-gray-400 mt-1">Manage your postings</p>
            </div>
            <Link href="/post-job">
              <button className="bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800 shadow-lg transition transform hover:-translate-y-0.5">
                + Post New Job
              </button>
            </Link>
          </div>
        </div>

       
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="font-semibold text-gray-800">Recent Job Postings</h2>
          </div>
          
          {jobs.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No jobs posted yet. Click "Post New Job" to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Job Title</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Date Posted</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {jobs.map((job) => (
                    <tr key={job._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{job.title}</div>
                        <div className="text-xs text-gray-400">{job.company_name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {job.location}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(job.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                         <button className="text-blue-600 hover:text-blue-900 font-medium">Edit</button>
                         <button onClick={() => handleDelete(job._id)} className="text-red-600 hover:text-red-900 font-medium">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}