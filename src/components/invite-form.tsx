'use client';

import { useState } from 'react';

export default function InviteForm({ projectId }: { projectId: string }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const res = await fetch(`/api/projects/${projectId}/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMessage(data.message);
    setLoading(false);
    setEmail('');
  };

  return (
    <form onSubmit={handleInvite} className="bg-white border p-4 rounded space-y-4">
      <h3 className="font-semibold text-lg">Invite Member by Email</h3>
      <input
        type="email"
        placeholder="Email pengguna"
        className="w-full border px-3 py-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {loading ? 'Mengundang...' : 'Invite'}
      </button>
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </form>
  );
}
