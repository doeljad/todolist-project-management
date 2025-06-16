'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, password }),
    });

    if (res.ok) {
      router.push('/login');
    } else {
      const data = await res.json();
      setError(data.message || 'Gagal mendaftar');
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-950">
  <form
    onSubmit={handleRegister}
    className="bg-gray-900 shadow-lg p-6 rounded-xl w-80 space-y-4 border border-gray-700"
  >
    <h2 className="text-xl font-semibold text-center text-white">Register</h2>

    {error && <p className="text-red-500 text-sm">{error}</p>}

    <input
      type="text"
      placeholder="Nama"
      className="w-full bg-gray-800 text-white border border-gray-600 px-3 py-2 rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
    <input
      type="email"
      placeholder="Email"
      className="w-full bg-gray-800 text-white border border-gray-600 px-3 py-2 rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
    <input
      type="password"
      placeholder="Password"
      className="w-full bg-gray-800 text-white border border-gray-600 px-3 py-2 rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    <button
      type="submit"
      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
    >
      Daftar
    </button>

    <p className="text-sm text-center text-gray-400">
      Sudah punya akun?{" "}
      <a href="/login" className="text-blue-400 hover:underline">
        Login
      </a>
    </p>
  </form>
    </div>

  );
}
