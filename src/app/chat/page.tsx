"use client";
import { useSession } from "next-auth/react";
import VideoChat from "@/components/VideoChat";
export default function ChatPage() {
  const { data: session, status } = useSession();
  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Please login</div>;
  if (!session.user.gender) return <div>Please set your gender in dashboard first.</div>;
  return <VideoChat userGender={session.user.gender} userId={session.user.id} />;
}
