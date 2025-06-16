'use client';

import { useState, useEffect } from "react";

export default function InviteAutocomplete({
  projectId,
  onSuccess,
}: {
  projectId: string;
  onSuccess?: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  const invite = async (email: string) => {
    const res = await fetch(`/api/projects/${projectId}/invite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMessage(data.message || "");
    setQuery("");
    setResults([]);
    onSuccess?.(); // 🚀 Panggil refresh jika disediakan
  };

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      fetch(`/api/users/search?q=${query}`)
        .then((res) => res.json())
        .then(setResults);
    }, 300); // debounce 300ms

    return () => clearTimeout(timer);
  }, [query]);

  return (
   <div className="bg-gray-900 border border-gray-700 p-5 rounded-xl space-y-4 text-white shadow">

  <input
    type="text"
    placeholder="Ketik email user..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  {results.length > 0 && (
    <ul className="border border-gray-700 rounded bg-gray-800 max-h-48 overflow-y-auto divide-y divide-gray-700">
      {results.map((user) => (
        <li
          key={user.id}
          className="px-4 py-2 hover:bg-gray-700 cursor-pointer transition"
          onClick={() => invite(user.email)}
        >
          <strong>{user.name}</strong>{" "}
          <span className="text-sm text-gray-400">({user.email})</span>
        </li>
      ))}
    </ul>
  )}

  {message && (
    <p className="text-sm text-green-400 font-medium">
      ✅ {message}
    </p>
  )}
</div>
  );
}
