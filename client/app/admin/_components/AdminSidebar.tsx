"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
  },
  {
    title: "Books",
    href: "/admin/books",
  },
  {
    title: "Reservations",
    href: "/admin/reservations",
  },
  {
    title: "Rentals",
    href: "/admin/rentals",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">

      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold">
          Secure Library
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Admin Panel
        </p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-lg px-4 py-3 transition ${
              pathname === item.href
                ? "bg-blue-600"
                : "hover:bg-slate-800"
            }`}
          >
            {item.title}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <Link
          href="/login"
          className="block rounded-lg bg-red-600 text-center py-3 hover:bg-red-700 transition"
        >
          Logout
        </Link>
      </div>
    </aside>
  );
}