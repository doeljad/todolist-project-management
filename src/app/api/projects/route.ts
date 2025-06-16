import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();

  if (!name || name.trim() === "") {
    return NextResponse.json({ message: "Nama project wajib diisi" }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      name,
      ownerId: session.user.id,
      members: {
        create: [
          {
            userId: session.user.id,
          },
        ],
      },
    },
  });

  return NextResponse.json(project);
}
