import { ReactNode } from "react";
import AdminSidebar from "../admin/_components/AdminSidebar";

interface LayoutProps {
  children: ReactNode;
}

export default function AdminLayout({
  children,
}: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}