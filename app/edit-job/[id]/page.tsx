// src/app/edit-job/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import api from '@/utils/api';
import { useRouter, useParams } from 'next/navigation';

export default function EditJob() {
  const router = useRouter();
  const params = useParams(); 
  const { id } = params;

  const [formData, setFormData] = useState({
    title: '',
    company_name: '',
    company_url: '',
    location: '',
    description: '',
    salary_range: '',
    employer_email: '',
    requirements: '', 
  });
  
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        const job = res.data;
        
      
        setFormData({
            title: job.title,
            company_name: job.company_name,
            company_url: job.company_url || '',
            location: job.location,
            description: job.description,
            salary_range: job.salary_range || '',
            employer_email: job.employer_email,
            requirements: Array.isArray(job.requirements) ? job.requirements.join(', ') : '',
        });
      } catch (error) {
        alert("Failed to load job details.");
        router.push('/my-jobs');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchJob();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        requirements: formData.requirements.split(',').map((req) => req.trim()),
      };
      
     
      await api.put(`/jobs/${id}`, payload);
      
      alert('Job Updated Successfully!');
      router.push('/my-jobs'); 
    } catch (error) {
      alert('Error updating job.');
    }
  };

  if (loading) return <div className="p-10 text-center">Loading job details...</div>;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Edit Job</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Job Title</label>
          <input required name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <input required name="company_name" value={formData.company_name} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input required name="location" value={formData.location} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea required name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded h-32" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Requirements (Comma separated)</label>
          <input name="requirements" value={formData.requirements} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Salary Range</label>
          <input name="salary_range" value={formData.salary_range} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div className="flex gap-4 mt-6">
            <button 
            type="submit" 
            className="flex-1 bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
            >
            Save Changes
            </button>
            <button 
            type="button"
            onClick={() => router.push('/my-jobs')}
            className="px-6 py-3 border border-gray-300 rounded hover:bg-gray-100"
            >
            Cancel
            </button>
        </div>
      </form>
    </div>
  );
}