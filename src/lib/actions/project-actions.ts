export async function updateProject(id: string, name: string) {
  const res = await fetch(`/api/projects/${id}/edit`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) throw new Error('Gagal mengubah nama project');
  return res.json();
}

export async function deleteProject(id: string) {
  const res = await fetch(`/api/projects/${id}/delete`, {
    method: 'DELETE',
  });

  if (!res.ok) throw new Error('Gagal menghapus project');
  return res.json();
}
