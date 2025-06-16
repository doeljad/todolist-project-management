import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();
  if (!name || name.trim() === "") {
    return NextResponse.json({ message: "Name is required" }, { status: 400 });
  }

  const project = await prisma.project.findFirst({
    where: { id: params.id, ownerId: session.user.id },
  });

  if (!project) {
    return NextResponse.json({ message: "Hanya owner yang dapat mengubah nama project" }, { status: 403 });
  }

  const updated = await prisma.project.update({
    where: { id: params.id },
    data: { name },
  });

  return NextResponse.json({
    message: "Nama project berhasil diubah",
    project: updated,
  });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const project = await prisma.project.findFirst({
    where: { id: params.id, ownerId: session.user.id },
  });

  if (!project) {
    return NextResponse.json({ message: "Hanya owner yang dapat menghapus project" }, { status: 403 });
  }

  await prisma.task.deleteMany({ where: { projectId: params.id } });
  await prisma.projectMember.deleteMany({ where: { projectId: params.id } });
  await prisma.project.delete({ where: { id: params.id } });

  return NextResponse.json({
    message: "Project berhasil dihapus",
  });
}
