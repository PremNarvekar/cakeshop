"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        router.push('/admin/dashboard');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      alert('Error connecting to server');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 bg-opacity-50 text-gray-900">
      <div className="max-w-md w-full bg-white p-8 border rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-pink-500">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 rounded p-2" required />
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-medium">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 rounded p-2" required />
          </div>
          <button type="submit" className="w-full bg-pink-500 text-white font-bold p-3 rounded hover:bg-pink-600 transition">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
