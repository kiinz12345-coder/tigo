"use client";
import { useSession, update } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
export default function Dashboard() {
  const { data: session, update: updateSession } = useSession();
  const [gender, setGender] = useState(session?.user?.gender || "");
  const saveGender = async () => {
    await fetch("/api/user/gender", { method: "POST", body: JSON.stringify({ gender }) });
    await updateSession();
  };
  if (!session) return <div>Loading...</div>;
  if (!session.user.gender) {
    return (
      <div className="max-w-md mx-auto">
        <h1>Select your gender</h1>
        <select value={gender} onChange={e => setGender(e.target.value)}>
          <option value="">Select</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>
        <button onClick={saveGender} className="bg-blue-500 text-white p-2">Save</button>
      </div>
    );
  }
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Credits: {session.user.credits}</p>
      <p>Role: {session.user.role}</p>
      {session.user.gender === "FEMALE" && <p>Earnings: ${session.user.earnings}</p>}
      <Link href="/buy-credits" className="bg-green-500 text-white p-2 inline-block">Buy Credits</Link>
    </div>
  );
}
