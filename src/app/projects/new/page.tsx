'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/projects/${data.id}`);
    } else {
      const data = await res.json();
      setError(data.message || 'Gagal membuat project');
    }
  };

  return (
   <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
  <form
    onSubmit={handleSubmit}
    className="bg-gray-800 text-white shadow-lg p-6 rounded-xl w-full max-w-md space-y-5"
  >
    <h2 className="text-2xl font-bold text-center text-white">Buat Project Baru</h2>

    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

    <input
      type="text"
      placeholder="Nama Project"
      className="w-full bg-gray-700 text-white border border-gray-600 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />

    <textarea
      placeholder="Deskripsi (opsional)"
      className="w-full bg-gray-700 text-white border border-gray-600 px-4 py-2 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      rows={4}
      value={description}
      onChange={(e) => setDescription(e.target.value)}
    />

    <button
      type="submit"
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
    >
      Simpan
    </button>
  </form>
</div>

  );
}
