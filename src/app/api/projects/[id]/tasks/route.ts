import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { title, description, status, assigneeId } = await req.json();
  const projectId = params.id;

  if (!title || title.trim() === "") {
    return NextResponse.json({ message: "Judul task wajib diisi" }, { status: 400 });
  }

  const validStatuses = ["TODO", "IN_PROGRESS", "DONE"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ message: "Status task tidak valid" }, { status: 400 });
  }

  const isMember = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { ownerId: session.user.id },
        { members: { some: { userId: session.user.id } } },
      ],
    },
  });

  if (!isMember) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  if (assigneeId) {
    const userExists = await prisma.user.findUnique({ where: { id: assigneeId } });
    if (!userExists) {
      return NextResponse.json({ message: "User penanggung jawab tidak ditemukan" }, { status: 404 });
    }
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      status,
      projectId,
      assigneeId: assigneeId || null,
    },
  });

  return NextResponse.json({
    message: "Task berhasil ditambahkan",
    task,
  });
}
