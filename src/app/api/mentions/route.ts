import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const username = session.user.name.toLowerCase();
  const mentions = await prisma.ticketMention.findMany({
    where: { mentionedUsername: username },
    include: {
      action: {
        include: {
          ticket: {
            select: {
              id: true,
              category: true,
              status: true,
              name: true,
              description: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(mentions);
}
