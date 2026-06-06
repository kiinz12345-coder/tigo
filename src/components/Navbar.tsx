import { auth } from "@/lib/auth";
import Link from "next/link";
import CreditDisplay from "./CreditDisplay";
export default async function Navbar() {
  const session = await auth();
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">RandomChat</Link>
        <div className="space-x-4">
          {session ? (
            <>
              <Link href="/chat">Chat</Link>
              <Link href="/dashboard">Dashboard</Link>
              {session.user.role === "ADMIN" && <Link href="/admin">Admin</Link>}
              <CreditDisplay />
              <Link href="/api/auth/signout">Logout</Link>
            </>
          ) : (
            <Link href="/api/auth/signin">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
