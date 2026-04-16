import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { TicketCategory } from "@prisma/client";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { category, name, email, description, expectedResponse, leadContact, screenshotUrl } = body;

  if (!category || !name || !email || !description) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!Object.values(TicketCategory).includes(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  const ticket = await prisma.ticket.create({
    data: {
      category,
      name,
      email,
      description,
      expectedResponse: expectedResponse || null,
      leadContact: leadContact || null,
      screenshotUrl: screenshotUrl || null,
    },
  });

  return NextResponse.json(ticket, { status: 201 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tickets = await prisma.ticket.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(tickets);
}
