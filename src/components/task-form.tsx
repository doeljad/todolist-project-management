'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface TaskFormProps {
  projectId: string;
  members: { id: string; name: string }[];
}

export default function TaskForm({ projectId, members }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('TODO');
  const [assigneeId, setAssigneeId] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!title.trim()) {
    toast.error("Judul task wajib diisi");
    return;
  }

  setLoading(true);
  try {
    const res = await fetch(`/api/projects/${projectId}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, status, assigneeId }),
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.message || 'Gagal menambahkan task');
      return;
    }

    toast.success(data.message);

    setTitle('');
    setDescription('');
    setStatus('TODO');
    setAssigneeId('');

    setTimeout(() => {
      router.refresh();
    }, 1000);
  } catch {
    toast.error('Terjadi kesalahan');
  } finally {
    setLoading(false);
  }
};
  return (
  <form
  onSubmit={handleSubmit}
  className="space-y-4 mt-6 text-white shadow">

  <input
    className="w-full bg-gray-800 border border-gray-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Judul"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    required
  />

  <textarea
    className="w-full bg-gray-800 border border-gray-600 px-4 py-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Deskripsi (opsional)"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    rows={3}
  />

  <select
    className="w-full bg-gray-800 border border-gray-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={status}
    onChange={(e) => setStatus(e.target.value)}
  >
    <option value="TODO">Todo</option>
    <option value="IN_PROGRESS">In Progress</option>
    <option value="DONE">Done</option>
  </select>

  <select
    className="w-full bg-gray-800 border border-gray-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={assigneeId}
    onChange={(e) => setAssigneeId(e.target.value)}
  >
    <option value="">Tanpa Penanggung Jawab</option>
    {members.map((m) => (
      <option key={m.id} value={m.id}>{m.name}</option>
    ))}
  </select>

  <button
    type="submit"
    disabled={loading}
    className={`w-full bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition ${
      loading ? 'opacity-60 cursor-not-allowed' : ''
    }`}
  >
    {loading ? 'Menyimpan...' : 'Simpan Task'}
  </button>
</form>

  );
}
