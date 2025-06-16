import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json([], { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q || q.length < 2) {
    return NextResponse.json([], { status: 200 });
  }

  const users = await prisma.user.findMany({
    where: {
      email: {
        contains: q,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
    take: 5,
  });

  return NextResponse.json(users);
}
