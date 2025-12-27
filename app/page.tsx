'use client'; 
import Link from 'next/link';


import { useEffect, useState } from 'react';
import api from '@/utils/api';

interface Job {
  _id: string;
  title: string;
  company_name: string;
  location: string;
}

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/jobs/');
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
        
        <Link href="/smart-match">
          <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200 font-medium">
            ✨ AI Match
          </button>
        </Link>
        <Link href="/post-job">
          <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
            Post a Job
          </button>
        </Link>
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
            </div>
          ))}
        </div>
      )}
    </main>
  );
}