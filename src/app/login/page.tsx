'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push('/dashboard');
    } else {
      setError('Email atau password salah');
    }
  };

  return (
   <div className="min-h-screen flex items-center justify-center bg-gray-950">
  <form
    onSubmit={handleLogin}
    className="bg-gray-900 shadow-lg p-6 rounded-xl w-80 space-y-4 border border-gray-700"
  >
    <h2 className="text-xl font-semibold text-center text-white">Login</h2>

    {error && <p className="text-red-500 text-sm">{error}</p>}

    <input
      type="email"
      placeholder="Email"
      className="w-full bg-gray-800 text-white border border-gray-600 px-3 py-2 rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
    <input
      type="password"
      placeholder="Password"
      className="w-full bg-gray-800 text-white border border-gray-600 px-3 py-2 rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    <button
      type="submit"
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
    >
      Login
    </button>
    <p className="text-sm text-center text-gray-400">
      Belum punya akun?{" "}
      <a href="/register" className="text-blue-400 hover:underline">
        Daftar
      </a>
    </p>
    </form>
    </div>

  );
}
