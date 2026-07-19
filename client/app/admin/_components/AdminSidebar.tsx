"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  BookMarked,
  LogOut,
  Shield,
  Menu,
  X,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Books",
    href: "/admin/dashboard/book",
    icon: BookOpen,
  },
  {
    title: "Reservations",
    href: "/admin/dashboard/reservations",
    icon: CalendarCheck,
  },
  {
    title: "Rentals",
    href: "/admin/dashboard/rentals",
    icon: BookMarked,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5050/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error(error);
    } finally {
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <>
      {/* Global CSS Inject to safely hide scrollbar handles without layout disruption */}
      <style dangerouslySetInnerHTML={{__html: `
        .sidebar-nav-scroll::-webkit-scrollbar { display: none; }
        .sidebar-nav-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {/* Mobile Header Top-Bar */}
      <div className="lg:hidden w-full bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Shield size={20} className="text-blue-500" />
          <span className="font-bold text-md">Secure Library</span>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 transition"
          aria-label="Toggle Sidebar"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-200"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Layout Container */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 text-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:max-h-screen lg:flex-shrink-0 overflow-hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header Section */}
        <div className="px-6 py-8 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-3 rounded-xl">
              <Shield size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide">Secure Library</h1>
              <p className="text-slate-400 text-xs mt-0.5">Admin Dashboard</p>
            </div>
          </div>
          {/* Close button inside sidebar for small viewports */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-800 text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links - Internally scrollable with hidden scrollbar UI elements */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto sidebar-nav-scroll">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200 group relative ${
                  active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <Icon
                  size={20}
                  className={active ? "text-white" : "text-slate-400 group-hover:text-white transition-colors"}
                />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Action Panel */}
        <div className="border-t border-slate-800 p-5 shrink-0 bg-slate-900">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-600/20 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-500/30 rounded-xl py-3 transition-all duration-200 font-medium cursor-pointer"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}