import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProjectActions from "@/components/project-actions";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <div className="p-4 text-center text-red-500">
        Kamu harus login untuk melihat dashboard.
      </div>
    );
  }

  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { ownerId: userId },
        { members: { some: { userId } } },
      ],
    },
    include: {
      _count: { select: { tasks: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard Project</h1>
          <p className="text-sm text-gray-400">Selamat datang, <span className="font-semibold">{session.user.name}</span></p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/projects/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            + Buat Project Baru
          </Link>

          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              Logout
            </button>
          </form>
        </div>
      </div>

      {/* Project List */}
      {projects.length === 0 ? (
        <p className="text-gray-400 text-center">
          Belum ada project. Klik tombol di atas untuk membuat.
        </p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <li
              key={project.id}
              className="bg-gray-900 border border-gray-700 rounded-xl p-4 shadow hover:shadow-lg transition"
            >
              <Link href={`/projects/${project.id}`}>
                <h2 className="text-lg font-semibold mb-1 text-white truncate">{project.name}</h2>
                <p className="text-sm text-gray-400">{project._count.tasks} task</p>
              </Link>

              <div className="mt-3">
                <ProjectActions
                  id={project.id}
                  currentName={project.name}
                  isOwner={project.ownerId === session.user.id}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
