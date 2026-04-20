import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { TicketStatus } from "@prisma/client";
import { recordMentions } from "@/lib/mentions";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      actions: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Mark mentions for this user as read
  await prisma.ticketMention.updateMany({
    where: {
      ticketId: id,
      mentionedUsername: session.user.name.toLowerCase(),
      readAt: null,
    },
    data: { readAt: new Date() },
  });

  return NextResponse.json(ticket);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { status, comment } = body;

  if (!Object.values(TicketStatus).includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const userName = session.user.name;
  const actionType = status === "pending" ? "reopened" : status;

  await prisma.ticket.update({
    where: { id },
    data: { status },
  });

  const action = await prisma.ticketAction.create({
    data: {
      ticketId: id,
      action: actionType,
      userName,
      comment: comment || null,
    },
  });

  await recordMentions(action.id, id, comment);

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: { actions: { orderBy: { createdAt: "asc" } } },
  });

  return NextResponse.json(ticket);
}
