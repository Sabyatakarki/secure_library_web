"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface UserProfile {
  fullName: string;
  role: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dynamic user identity parameters from the backend context
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await fetch("/api/user/profile"); 
        if (response.ok) {
          const data = await response.json();
          setUser({
            fullName: data.fullName || "Active Student",
            role: data.role || "Active Member",
          });
        } else {
          setUser({ fullName: "Welcome Student", role: "Active Member" });
        }
      } catch (error) {
        setUser({ fullName: "Welcome Student", role: "Active Member" });
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserProfile();
  }, []);

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const navItems = [
    { 
      label: "Dashboard", 
      href: "/dashboard", 
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25a2.25 2.25 0 0 1-2.25 2.25h-2.25A2.25 2.25 0 0 1 13.5 8V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
        </svg>
      )
    },
    { 
      label: "Browse Books", 
      href: "/dashboard/books", 
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
      )
    },
    { 
      label: "My Rentals", 
      href: "/dashboard/rentals", 
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      )
    },
    { 
      label: "Reservations", 
      href: "/dashboard/reservations", 
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
        </svg>
      )
    },
    { 
      label: "Favorites", 
      href: "/dashboard/favorites", 
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.172-.377.72-.377.892 0l2.122 4.36 4.819.702c.415.061.58.566.279.856l-3.487 3.398.823 4.793c.071.413-.362.727-.736.533L12 17.654l-4.316 2.27c-.374.194-.814-.12-.743-.532l.823-4.793L4.278 9.416c-.302-.29-.137-.796.279-.856l4.819-.702 2.122-4.36Z" />
        </svg>
      )
    },
    { 
      label: "Settings", 
      href: "/dashboard/settings", 
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.767c-.29.223-.443.59-.413.957.002.042.002.085.002.128 0 .042-.002.085-.002.127-.03.367.124.734.413.957l1.003.767a1.125 1.125 0 0 1 .26 1.43l-1.296 2.247a1.125 1.125 0 0 1-1.37.49l-1.216-.456c-.356-.133-.751-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.767c.29-.223.443-.59.412-.957a4.97 4.97 0 0 1-.002-.128c0-.042.002-.085.002-.127.03-.367-.124-.734-.412-.957L4.178 9.2c-.414-.317-.54-.9-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.49l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      )
    },
  ];

  return (
    <div className="flex h-screen w-screen max-h-screen max-w-full overflow-hidden bg-slate-50 font-sans antialiased text-slate-800">
      
      {/* Updated Sidebar: Transformed to deep navy/slate bg-slate-900 */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900 p-6 hidden md:flex flex-col justify-between shrink-0 h-full overflow-y-auto shadow-xl">
        <div>
          {/* Brand/Logo Zone */}
          <div className="flex items-center gap-2.5 mb-8 px-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center font-black tracking-tighter text-base text-white shadow-md shadow-blue-500/20">
              L
            </div>
            <span className="font-extrabold text-xs uppercase tracking-widest text-slate-100">
              Secure Library
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-150 group ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                  }`}
                >
                  <span className={`transition-transform group-hover:scale-105 ${isActive ? "opacity-100 text-white" : "opacity-70 text-slate-400 group-hover:opacity-100 group-hover:text-slate-100"}`}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>        
      </aside>

      {/* Main Content Workspace Layout Viewport Frame */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Modern Navbar Header Panel */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 sm:px-8 shrink-0 z-10 shadow-sm shadow-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight sm:text-lg">
              Student Dashboard
            </h2>
          </div>

          {/* User Profile Widget Block */}
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard/profile" 
              className={`flex items-center gap-3 px-3 py-1.5 rounded-2xl bg-slate-50 border transition-all duration-200 hover:bg-slate-100/70 ${
                pathname === "/dashboard/profile" 
                  ? "border-blue-200 bg-blue-50/40" 
                  : "border-slate-100"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-3 animate-pulse">
                  <div className="w-7 h-7 rounded-full bg-slate-200" />
                  <div className="hidden sm:flex flex-col gap-1">
                    <div className="h-3 w-24 bg-slate-200 rounded" />
                    <div className="h-2 w-16 bg-slate-200 rounded" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black text-white shadow-sm shadow-blue-500/20 uppercase">
                    {getInitials(user?.fullName || "ST")}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800 leading-tight">
                      {user?.fullName}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none mt-0.5">
                      {user?.role}
                    </span>
                  </div>
                </>
              )}
            </Link>
          </div>
        </header>

        {/* Main Fluid Content Layout Area */}
        <main className="p-6 sm:p-8 flex-1 overflow-y-auto min-h-0">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}