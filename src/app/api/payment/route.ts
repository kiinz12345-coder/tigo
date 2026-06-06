import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { credits } = await req.json();
  const amount = (credits / 10) * 100;
  const checkout = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "apple_pay"],
    line_items: [{ price_data: { currency: "usd", product_data: { name: `${credits} credits` }, unit_amount: amount }, quantity: 1 }],
    mode: "payment",
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/buy-credits?canceled=true`,
    client_reference_id: session.user.id,
    metadata: { credits: credits.toString() },
  });
  return NextResponse.json({ url: checkout.url });
}
