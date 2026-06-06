import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { gender } = await req.json();
  await db.user.update({ where: { id: session.user.id }, data: { gender } });
  return NextResponse.json({ success: true });
}
