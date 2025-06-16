import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';


export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { title, description, status, assigneeId } = await req.json();

  // Cek apakah user adalah owner atau member
  const task = await prisma.task.findUnique({
    where: { id: params.id },
    include: { project: { include: { members: true } } },
  });

  if (!task) return NextResponse.json({ message: 'Task not found' }, { status: 404 });

  const userId = session.user.id;
  const isMember =
    task.project.ownerId === userId ||
    task.project.members.some((m) => m.userId === userId);

  if (!isMember) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const updated = await prisma.task.update({
    where: { id: params.id },
    data: {
      title,
      description,
      status,
      assigneeId,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const task = await prisma.task.findUnique({
    where: { id: params.id },
    include: { project: { include: { members: true } } },
  });

  if (!task) return NextResponse.json({ message: 'Task not found' }, { status: 404 });

  const userId = session.user.id;
  const isMember =
    task.project.ownerId === userId ||
    task.project.members.some((m) => m.userId === userId);

  if (!isMember) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  await prisma.task.delete({ where: { id: params.id } });

  return NextResponse.json({ message: 'Task deleted' });
}
