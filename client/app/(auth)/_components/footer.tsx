"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* Brand/System Description */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center text-lg shadow-md">
                  📚
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white">
                  Secure Library
                </h2>
              </div>
              <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-sm">
                A secure smart library rental and reservation system designed to help campus students instantly search, borrow, and manage their academic resources.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3.5 text-sm font-medium">
              {[
                { name: "Home", href: "/" },
                { name: "Books", href: "/books" },
                { name: "About Us", href: "/about" },
                { name: "Student Portal Login", href: "/login" },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-slate-300 hover:text-blue-400 transition-colors duration-200 block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Institutional Contact */}
          <div className="md:col-span-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Campus Contact
            </h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="text-slate-500 select-none">📍</span>
                <span>Kathmandu, Nepal</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-slate-500 select-none">📧</span>
                <a href="mailto:library@college.edu" className="hover:text-blue-400 transition-colors">
                  library@college.edu
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-slate-500 select-none">📞</span>
                <a href="tel:+9779800000000" className="hover:text-blue-400 transition-colors">
                  +977 98XXXXXXXX
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar Divider */}
        <hr className="my-8 border-slate-800" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div>
            © {new Date().getFullYear()} Secure Smart Library Rental & Reservation System.
          </div>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer transition">Privacy Policy</span>
            <span className="text-slate-800">•</span>
            <span className="hover:text-slate-400 cursor-pointer transition">System Terms</span>
          </div>
        </div>

      </div>
    </footer>
  );
}