'use client';
import { useState } from 'react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/signup', formData);
      alert('Signup Successful! Please Login.');
      router.push('/login');
    } catch (err) {
      alert('Error creating account');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border rounded shadow-lg bg-white">
      <h1 className="text-2xl font-bold mb-6 text-center">Employer Signup</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="Email" className="w-full p-2 border rounded" onChange={(e) => setFormData({...formData, email: e.target.value})} />
        <input type="password" placeholder="Password" className="w-full p-2 border rounded" onChange={(e) => setFormData({...formData, password: e.target.value})} />
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">Sign Up</button>
      </form>
    </div>
  );
}