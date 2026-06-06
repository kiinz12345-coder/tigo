"use client";
import { useState, useEffect } from "react";
interface User { id: string; email: string; name: string; credits: number; earnings: number; role: string; }
export default function AdminPanel({ users: initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <table className="w-full border">
        <thead><tr><th>Email</th><th>Credits</th><th>Earnings</th><th>Role</th></tr></thead>
        <tbody>{users.map(u => <tr key={u.id}><td>{u.email}</td><td>{u.credits}</td><td>${u.earnings}</td><td>{u.role}</td>}</tr>)}</tbody>
      </table>
    </div>
  );
}
