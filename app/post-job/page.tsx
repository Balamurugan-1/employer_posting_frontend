'use client';
import Link from 'next/link'

import { useState } from 'react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation'; 

export default function PostJob() {
  const router = useRouter();
  

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
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        requirements: formData.requirements.split(',').map((req) => req.trim()),
      };

      await api.post('/jobs/', payload);
      
      alert('Job Posted Successfully!');
      router.push('/'); 
      
    } catch (error) {
      console.error("Failed to post job", error);
      alert('Error posting job. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
        
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Post a New Job</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Job Title</label>
          <input required name="title" onChange={handleChange} className="w-full p-2 border rounded" placeholder="e.g. Senior React Dev" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <input required name="company_name" onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input required name="location" onChange={handleChange} className="w-full p-2 border rounded" placeholder="e.g. Remote / Bangalore" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Employer Email</label>
            <input required type="email" name="employer_email" onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Company Website (Optional)</label>
            <input name="company_url" onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea required name="description" onChange={handleChange} className="w-full p-2 border rounded h-32" placeholder="Describe the role..." />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Requirements (Comma separated)</label>
          <input name="requirements" onChange={handleChange} className="w-full p-2 border rounded" placeholder="Python, FastAPI, AWS" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Salary Range (Optional)</label>
          <input name="salary_range" onChange={handleChange} className="w-full p-2 border rounded" placeholder="e.g. $80k - $100k" />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition disabled:bg-blue-300"
        >
          {loading ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
}