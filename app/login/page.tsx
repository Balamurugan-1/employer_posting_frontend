'use client';
import { useState } from 'react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.access_token);
      alert('Login Successful!');
      router.push('/post-job'); 
    } catch (err) {
      alert('Invalid Credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border rounded shadow-lg bg-white">
      <h1 className="text-2xl font-bold mb-6 text-center">Employer Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="email" 
          placeholder="Email" 
          className="w-full p-2 border rounded"
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full p-2 border rounded"
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
      </form>
      <p className="mt-4 text-center">
        New employer? <Link href="/signup" className="text-blue-600">Sign Up</Link>
      </p>
    </div>
  );
}