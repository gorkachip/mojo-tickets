import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const showResolved = url.searchParams.get("showResolved") === "true";

  const username = session.user.name.toLowerCase();
  const mentions = await prisma.ticketMention.findMany({
    where: { mentionedUsername: username },
    include: {
      action: {
        include: {
          parentAction: { select: { id: true, resolvedAt: true } },
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
    take: 100,
  });

  const filtered = showResolved
    ? mentions
    : mentions.filter((m) => {
        const root = m.action.parentAction || m.action;
        return !root.resolvedAt;
      });

  return NextResponse.json(filtered);
}
