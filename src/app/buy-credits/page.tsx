"use client";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
export default function BuyCredits() {
  const [loading, setLoading] = useState(false);
  const buy = async (credits: number) => {
    setLoading(true);
    const res = await fetch("/api/payment", { method: "POST", body: JSON.stringify({ credits }) });
    const { url } = await res.json();
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
    await stripe?.redirectToCheckout({ sessionId: url.split("/")[4] });
    setLoading(false);
  };
  return (
    <div className="text-center">
      <h1>Buy Credits</h1>
      <div className="flex gap-4 justify-center mt-8">
        <button onClick={() => buy(50)} disabled={loading} className="bg-blue-500 p-4 rounded">50 credits - $5</button>
        <button onClick={() => buy(120)} disabled={loading} className="bg-blue-500 p-4 rounded">120 credits - $10</button>
        <button onClick={() => buy(300)} disabled={loading} className="bg-blue-500 p-4 rounded">300 credits - $25</button>
      </div>
    </div>
  );
}
