import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  const projectId = params.id;

  // ✅ Pastikan user adalah owner
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: session.user.id,
    },
  });

  if (!project) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const existing = await prisma.projectMember.findFirst({
    where: { projectId, userId: user.id },
  });

  if (existing) {
    return NextResponse.json({ message: "User already a member" }, { status: 409 });
  }

  await prisma.projectMember.create({
    data: {
      userId: user.id,
      projectId,
    },
  });

  return NextResponse.json({ message: "User invited" });
}
