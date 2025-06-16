'use client';

import { useEffect, useState } from "react";

export default function ProjectMembers({ projectId }: { projectId: string }) {
  const [members, setMembers] = useState<any[]>([]);

  const fetchMembers = async () => {
    const res = await fetch(`/api/projects/${projectId}/members`);
    const data = await res.json();
    setMembers(data);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div className="bg-white border p-4 rounded space-y-2">
      <h3 className="text-lg font-semibold">Daftar Member</h3>
      <ul className="text-sm">
        {members.map((m) => (
          <li key={m.id}>👤 {m.name} — {m.email}</li>
        ))}
      </ul>
    </div>
  );
}

export function useMemberRefresher(projectId: string) {
  const [refreshFlag, setRefreshFlag] = useState(0);
  const refresh = () => setRefreshFlag((prev) => prev + 1);

  const MemberComponent = () => {
    const [members, setMembers] = useState<any[]>([]);

    useEffect(() => {
      fetch(`/api/projects/${projectId}/members`)
        .then((res) => res.json())
        .then(setMembers);
    }, [refreshFlag]);

    return (
      <div className="bg-white border p-4 rounded space-y-2">
        <h3 className="text-lg font-semibold">Daftar Member</h3>
        <ul className="text-sm">
          {members.map((m) => (
            <li key={m.id}>👤 {m.name} — {m.email}</li>
          ))}
        </ul>
      </div>
    );
  };

  return { MemberComponent, refresh };
}
