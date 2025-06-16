'use client';

import { useState } from 'react';

export default function ProjectExportButton({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/projects/${projectId}/export`);
      if (!res.ok) {
        alert('Gagal export project');
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `project-${projectId}.json`;
      a.click();

      URL.revokeObjectURL(url);
    } catch {
      alert('Terjadi kesalahan saat export');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm"
    >
      Export JSON
    </button>
  );
}
