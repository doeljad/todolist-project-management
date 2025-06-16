'use client';

import { useState } from 'react';
import { updateProject, deleteProject } from '@/lib/actions/project-actions';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
export default function ProjectActions({ id, currentName, isOwner}: { id: string; currentName: string;  isOwner: boolean;}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentName);
  const [loading, setLoading] = useState(false);
const handleEdit = async () => {
  setLoading(true);
  try {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.message || 'Gagal edit');

    toast.success(data.message);
    setEditing(false);

    setTimeout(() => {
      router.refresh();
    }, 1500);
  } finally {
    setLoading(false);
  }
};

const handleDelete = async () => {
  if (!confirm('Yakin hapus project?')) return;

  setLoading(true);
  try {
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) return toast.error(data.message || 'Gagal hapus');

    toast.success(data.message);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="mt-4 space-y-3">
  {editing ? (
    <div className="flex gap-2 items-center">
      <input
        className="w-full bg-gray-800 border border-gray-600 px-3 py-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={loading}
      />
      <button
        onClick={handleEdit}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold transition"
      >
        Simpan
      </button>
    </div>
  ) : (
    <button
      onClick={() => setEditing(true)}
      className="text-sm text-blue-400 hover:text-blue-300 transition p-3"
    >
      Edit
    </button>
  )}

  <button
    onClick={handleDelete}
    disabled={loading}
    className="text-sm text-red-400 hover:text-red-300 transition p-3"
  >
    Hapus
  </button>
</div>
  );
}
