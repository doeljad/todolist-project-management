import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { name, description } = await req.json();

  if (!name) {
    return NextResponse.json({ message: 'Nama project wajib diisi' }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      name,
      description,
      ownerId: session.user.id,
      members: {
        create: {
          userId: session.user.id, // auto menjadi member juga
        },
      },
    },
  });

  return NextResponse.json(project);
}

