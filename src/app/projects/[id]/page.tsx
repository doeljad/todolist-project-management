import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import TaskBoard from "@/components/task-board";
import TaskForm from "@/components/task-form";
import TaskStatusChart from '@/components/task-status-chart';
import InviteClientSection from '@/components/invite-autocomplete';
import ProjectExportButton from '@/components/project-export-button';

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      members: { include: { user: true } },
      tasks: { include: { assignee: true } },
    },
  });

  if (!project) return notFound();

  const isMember = project.ownerId === userId || project.members.some(m => m.userId === userId);
  if (!isMember) return <div className="p-4">Kamu tidak punya akses ke proyek ini.</div>;

  return (
    <body className="text-white min-h-screen">

<div className="p-6 max-w-6xl mx-auto space-y-10">
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-3xl font-bold text-white flex items-center gap-3">
        {project.name}
        <ProjectExportButton projectId={project.id} />
      </h1>
      <span className="text-sm text-gray-400 italic">
        Project ID: {project.id}
      </span>
    </div>

  <a
  href="/dashboard"
  className="inline-flex items-center gap-2 border border-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm transition"
>
  ← Kembali
</a>

  </div>


  {/* Chart Section */}
  <div className="bg-gray-900 text-white p-5 rounded-xl border border-gray-700 shadow">
    <h2 className="text-xl font-semibold mb-4">Ringkasan Task</h2>
    <TaskStatusChart tasks={project.tasks} type="bar" />
  </div>

  {/* Board Section */}
  <div className="bg-gray-900 text-white p-5 rounded-xl border border-gray-700 shadow">
    <h2 className="text-xl font-semibold mb-4">Task Board</h2>
    <TaskBoard
      projectId={project.id}
      tasks={project.tasks}
      projectOwnerId={project.ownerId}
    />
  </div>

  {/* Add Task Section */}
  <div className="bg-gray-900 text-white p-5 rounded-xl border border-gray-700 shadow">
    <h2 className="text-xl font-semibold mb-4">Tambah Task Baru</h2>
    <TaskForm
      projectId={project.id}
      members={[
        { id: project.ownerId, name: "Owner" },
        ...project.members.map((m) => ({
          id: m.userId,
          name: m.user.name,
        })),
      ]}
    />
  </div>

  {/* Invite Section */}
  <div className="bg-gray-900 text-white p-5 rounded-xl border border-gray-700 shadow">
    <h2 className="text-xl font-semibold mb-4">Manajemen Anggota</h2>
    <InviteClientSection
      projectId={project.id}
      isOwner={project.ownerId === session.user.id}
    />
  </div>
</div>
</body>
  );
}
