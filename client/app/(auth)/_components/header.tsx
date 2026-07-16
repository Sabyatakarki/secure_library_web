"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  // Navigation Links definition
  // Inside Header.tsx replacement logic:
const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Books", href: "#books" },
  { name: "About Us", href: "#about" },
];

  return (
    <header className="w-full bg-white shadow-sm border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* LOGO (Left Aligned) */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center text-xl shadow-sm">
            📚
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none mb-0.5">
              Secure Library
            </h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
              Rental & Reservation
            </p>
          </div>
        </Link>

        {/* NAVIGATION LINKS (Perfectly Centered) */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8 font-medium text-sm text-slate-600">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`transition-all pb-1 ${
                      isActive
                        ? "text-blue-700 font-bold border-b-2 border-blue-700"
                        : "hover:text-blue-600 font-medium"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ACTION BUTTONS (Right Aligned) */}
        <div className="flex items-center gap-4 shrink-0">
          <button className="flex items-center gap-1.5 text-sm text-slate-700 hover:text-blue-700 font-semibold transition py-1.5 px-2 rounded-lg hover:bg-slate-50">
            <span className="text-base">❤️</span>
            <span className="hidden sm:inline">Favorites</span>
          </button>

          <button className="flex items-center gap-1.5 text-sm text-slate-700 hover:text-blue-700 font-semibold transition py-1.5 px-2 rounded-lg hover:bg-slate-50">
            <span className="text-base">👤</span>
            <span className="hidden sm:inline">Profile</span>
          </button>
        </div>

      </div>
    </header>
  );
}