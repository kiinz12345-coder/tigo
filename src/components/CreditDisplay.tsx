"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
export default function CreditDisplay() {
  const { data: session } = useSession();
  const [credits, setCredits] = useState(0);
  useEffect(() => {
    if (session?.user?.id) fetch("/api/credits").then(res => res.json()).then(data => setCredits(data.credits));
  }, [session]);
  return <span className="bg-yellow-500 px-2 py-1 rounded">ðŸ’Ž {credits}</span>;
}
