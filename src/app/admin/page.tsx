import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import AdminPanel from "@/components/AdminPanel";
export default async function AdminPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/");
  const users = await db.user.findMany({ include: { creditHistory: true }, orderBy: { createdAt: "desc" } });
  return <AdminPanel users={users} />;
}
