import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { recordMentions } from "@/lib/mentions";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { comment } = body;

  if (!comment || !comment.trim()) {
    return NextResponse.json({ error: "Comment is required" }, { status: 400 });
  }

  const ticket = await prisma.ticket.findUnique({ where: { id } });
  if (!ticket) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const action = await prisma.ticketAction.create({
    data: {
      ticketId: id,
      action: "commented",
      userName: session.user.name,
      comment: comment.trim(),
    },
  });

  await recordMentions(action.id, id, comment);

  const updated = await prisma.ticket.findUnique({
    where: { id },
    include: { actions: { orderBy: { createdAt: "asc" } } },
  });

  return NextResponse.json(updated);
}
