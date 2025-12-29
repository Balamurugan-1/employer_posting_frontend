// src/app/post-job/page.tsx
'use client';

import { useState, useEffect } from 'react';
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
  const [generating, setGenerating] = useState(false); // State for the AI button

  // Protect the page
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/');
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- NEW FUNCTION: GENERATE JD ---
  const handleGenerateJD = async () => {
    if (!formData.title || !formData.company_name) {
      alert("Please fill in Job Title and Company Name first!");
      return;
    }

    setGenerating(true);
    try {
      const res = await api.post('/jobs/generate-desc', {
        title: formData.title,
        company_name: formData.company_name,
        location: formData.location || "Remote"
      });
      
      // Auto-fill the description box
      setFormData(prev => ({ ...prev, description: res.data.description }));
    } catch (error) {
      alert("Failed to generate description. Try again.");
    } finally {
      setGenerating(false);
    }
  };
  // ---------------------------------

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
      router.push('/my-jobs'); 
    } catch (error) {
      alert('Error posting job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Post a New Job</h1>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Job Title</label>
          <input required name="title" value={formData.title} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Senior Backend Engineer" />
        </div>

        {/* Company & Location */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Company Name</label>
            <input required name="company_name" value={formData.company_name} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Location</label>
            <input required name="location" value={formData.location} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g. Remote" />
          </div>
        </div>

        {/* Description Section with AI Button */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            
            {/* ✨ AI BUTTON ✨ */}
            <button 
              type="button" 
              onClick={handleGenerateJD}
              disabled={generating}
              className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold hover:bg-purple-200 transition flex items-center gap-1"
            >
              {generating ? 'Writing...' : '✨ AI Auto-Write'}
            </button>
          </div>
          
          <textarea 
            required 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            className="w-full p-3 border border-gray-300 rounded-lg h-48 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            placeholder="Describe the role..." 
          />
        </div>

        {/* Other Fields (Email, URL, Requirements, Salary) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Employer Email</label>
            <input required type="email" name="employer_email" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Website</label>
            <input name="company_url" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Requirements (Comma separated)</label>
          <input name="requirements" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Python, FastAPI, AWS" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Salary Range</label>
          <input name="salary_range" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="e.g. $80k - $100k" />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-black text-white p-4 rounded-lg font-bold hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? 'Posting Job...' : 'Publish Job Post'}
        </button>
      </form>
    </div>
  );
}