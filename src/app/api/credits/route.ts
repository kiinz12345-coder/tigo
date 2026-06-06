import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await db.user.findUnique({ where: { id: session.user.id }, select: { credits: true } });
  return NextResponse.json({ credits: user?.credits || 0 });
}
export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { amount, type } = await req.json();
  const updated = await db.user.update({ where: { id: session.user.id }, data: { credits: { increment: amount } } });
  await db.creditLog.create({ data: { userId: session.user.id, amount, type } });
  return NextResponse.json({ credits: updated.credits });
}
