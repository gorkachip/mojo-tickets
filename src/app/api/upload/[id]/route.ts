import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const upload = await prisma.upload.findUnique({ where: { id } });

  if (!upload) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(upload.data, {
    headers: {
      "Content-Type": upload.mimetype,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
