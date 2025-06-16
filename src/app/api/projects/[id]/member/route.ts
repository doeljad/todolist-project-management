import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json([], { status: 401 });

  const members = await prisma.projectMember.findMany({
    where: { projectId: params.id },
    include: { user: true },
  });

  return NextResponse.json(members.map(m => ({
    id: m.user.id,
    name: m.user.name,
    email: m.user.email,
  })));
}
