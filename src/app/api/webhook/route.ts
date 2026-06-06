import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.client_reference_id;
    const credits = session.metadata.credits;
    await db.user.update({ where: { id: userId }, data: { credits: { increment: parseInt(credits) } } });
    await db.creditLog.create({ data: { userId, amount: parseInt(credits), type: "PURCHASE" } });
  }
  return NextResponse.json({ received: true });
}
