'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function TaskActions({
  taskId,
  currentTitle,
  currentDescription,
  currentStatus,
}: {
  taskId: string;
  currentTitle: string;
  currentDescription: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(currentTitle);
  const [description, setDescription] = useState(currentDescription);
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleEdit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, status }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || 'Gagal update task');
        return;
      }

      toast.success('Task berhasil diperbarui');
      setEditing(false);
      router.refresh();
    } catch {
      toast.error('Terjadi kesalahan saat menyimpan');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = confirm('Yakin ingin menghapus task ini?');
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Gagal hapus task');
        return;
      }

      toast.success('Task berhasil dihapus');
      router.refresh();
    } catch {
      toast.error('Terjadi kesalahan saat menghapus');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 space-y-2">
      {editing ? (
        <div className="space-y-2">
          <input
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            onClick={handleEdit}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded"
          >
            Simpan
          </button>
        </div>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded"
        >
          Edit
        </button>
      )}

      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-xs bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded"
      >
        Hapus
      </button>
    </div>
  );
}
