import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const upload = await prisma.upload.create({
    data: {
      filename: file.name,
      mimetype: file.type,
      data: buffer,
    },
  });

  return NextResponse.json({ url: `/api/upload/${upload.id}` });
}
