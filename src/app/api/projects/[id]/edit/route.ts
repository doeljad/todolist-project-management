import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, context: { params: { id: string } }) {
  const { params } = context;
  const id = params.id;

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();
  if (!name) {
    return NextResponse.json({ message: "Name is required" }, { status: 400 });
  }

  const project = await prisma.project.findFirst({
    where: {
      id,
      ownerId: session.user.id,
    },
  });

if (!project) {
  return NextResponse.json(
    { message: "Hanya owner yang dapat mengubah nama project" },
    { status: 403 }
  );
}
  const updated = await prisma.project.update({
    where: { id },
    data: { name },
  });

  
  return NextResponse.json(updated);
}
