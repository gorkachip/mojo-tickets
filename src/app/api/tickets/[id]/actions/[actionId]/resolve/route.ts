import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

async function getThreadActionIds(rootId: string): Promise<string[]> {
  const all = await prisma.ticketAction.findMany({
    where: {
      OR: [{ id: rootId }, { parentActionId: rootId }],
    },
    select: { id: true },
  });
  return all.map((a) => a.id);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; actionId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, actionId } = await params;
  const body = await req.json().catch(() => ({}));
  const reopen = body.reopen === true;

  const action = await prisma.ticketAction.findFirst({
    where: { id: actionId, ticketId: id },
  });
  if (!action) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (action.parentActionId) {
    return NextResponse.json(
      { error: "Only top-level entries can be resolved" },
      { status: 400 },
    );
  }

  const userName = session.user.name;
  const now = new Date();

  if (reopen) {
    await prisma.ticketAction.update({
      where: { id: actionId },
      data: { resolvedAt: null, resolvedBy: null },
    });
  } else {
    const threadIds = await getThreadActionIds(actionId);
    await prisma.$transaction([
      prisma.ticketAction.update({
        where: { id: actionId },
        data: { resolvedAt: now, resolvedBy: userName },
      }),
      prisma.ticketMention.updateMany({
        where: {
          actionId: { in: threadIds },
          readAt: null,
        },
        data: { readAt: now },
      }),
    ]);
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: { actions: { orderBy: { createdAt: "asc" } } },
  });

  return NextResponse.json(ticket);
}
