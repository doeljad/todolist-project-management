'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard');
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-white px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-4xl font-bold tracking-tight">
          Selamat Datang di Project Manager
        </h1>
        <p className="text-gray-400">
          Aplikasi manajemen proyek dengan fitur Kanban, drag & drop, invite member, dan lainnya.
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded text-white font-semibold transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="border border-gray-600 hover:border-white px-5 py-2 rounded text-white font-semibold transition"
          >
            Register
          </Link>
        </div>
        <p className="text-xs text-gray-500 mt-6">
          Dibuat oleh Abdullah Sajad · 2025
        </p>
      </div>
    </div>
  );
}
