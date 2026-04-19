import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { TicketStatus } from "@prisma/client";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const ticket = await prisma.ticket.findUnique({ where: { id } });

  if (!ticket) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

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
  const now = new Date();
  const data: Record<string, unknown> = { status };

  if (status === "approved") {
    data.approvedBy = userName;
    data.approvedComment = comment || null;
    data.approvedAt = now;
  } else if (status === "implemented") {
    data.implementedBy = userName;
    data.implementedComment = comment || null;
    data.implementedAt = now;
  } else if (status === "rejected") {
    data.rejectedBy = userName;
    data.rejectedComment = comment || null;
    data.rejectedAt = now;
  }

  const ticket = await prisma.ticket.update({
    where: { id },
    data,
  });

  return NextResponse.json(ticket);
}
