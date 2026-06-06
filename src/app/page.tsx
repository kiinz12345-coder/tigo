import { auth } from "@/lib/auth";
import Link from "next/link";
export default async function Home() {
  const session = await auth();
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Random Video Chat</h1>
      <p className="text-lg mb-8">Connect with random people worldwide. Earn credits or use them to chat!</p>
      {session ? (
        <Link href="/chat" className="bg-blue-500 text-white px-6 py-3 rounded-lg">Start Chatting</Link>
      ) : (
        <Link href="/api/auth/signin" className="bg-blue-500 text-white px-6 py-3 rounded-lg">Login</Link>
      )}
    </div>
  );
}
