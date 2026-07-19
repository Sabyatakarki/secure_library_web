"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/api/axios";
interface Book {
  _id: string;
  title: string;
  author?: string;
  category?: string;
  createdAt?: string;
}

interface Reservation {
  _id: string;
  bookId: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
  book?: string | {
    title: string;
  };
}

interface Rental {
  _id: string;
  bookId: string;
  dueDate: string;
  book?: string | {
    title: string;
  };
}

export default function DashboardPage() {
  const router = useRouter();

  // Application Data States
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  
  // UX State Indicators
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  useEffect(() => {
    async function loadDashboardMetrics() {
      try {
        setIsLoading(true);
        setHasError(false);
        const [booksRes, rentalsRes, reservationsRes] = await Promise.all([
          api.get("/books"),
          api.get("/rentals/my"),
          api.get("/reservations/my"),
        ]);

        const rawBooks = booksRes.data?.data !== undefined ? booksRes.data.data : booksRes.data;
        const rawRentals = rentalsRes.data?.data !== undefined ? rentalsRes.data.data : rentalsRes.data;
        const rawReservations = reservationsRes.data?.data !== undefined ? reservationsRes.data.data : reservationsRes.data;

        setBooks(Array.isArray(rawBooks) ? rawBooks : []);
        setRentals(Array.isArray(rawRentals) ? rawRentals : []);
        setReservations(Array.isArray(rawReservations) ? rawReservations : []);

      } catch (err) {
        console.error("Dashboard Axios backend syncing failure stack trace:", err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardMetrics();
  }, []);
  const borrowedCount = rentals.length;
  const reservedCount = reservations.length;
  const availableCount = books.length; 
  const pendingCount = reservations.filter(r => r.status === "Pending").length;
  const stats = [
    {
      label: "Borrowed Books",
      value: borrowedCount,
      path: "/dashboard/rentals",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-blue-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
      ),
      bg: "bg-blue-50",
    },
    {
      label: "Reserved Books",
      value: reservedCount,
      path: "/dashboard/reservations",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-amber-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
        </svg>
      ),
      bg: "bg-amber-50",
    },
    {
      label: "Available Books",
      value: availableCount,
      path: "/dashboard/books",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-emerald-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      bg: "bg-emerald-50",
    },
    {
      label: "Pending Reservations",
      value: pendingCount,
      path: "/dashboard/reservations",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-rose-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      bg: "bg-rose-50",
    },
  ];

  // Helper parser mapping dynamic datetime patterns into presentation text
  const formatDisplayDate = (dateString?: string) => {
    if (!dateString) return "Today";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
    } catch {
      return "Recent";
    }
  };

  // Helper method to safely extract titles regardless of whether the field is populated or a raw ID string
  const getBookTitle = (bookProperty: any) => {
    if (bookProperty && typeof bookProperty === "object" && "title" in bookProperty) {
      return bookProperty.title;
    }
    return "Book Document"; 
  };

  // Component reusable utility context for pristine empty states
  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-slate-200 bg-slate-50/50 rounded-xl">
      <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-slate-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-slate-400 max-w-xs leading-relaxed">{message}</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Welcome Branding Hero Title Section */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 opacity-10 translate-x-12 -translate-y-6 pointer-events-none scale-150">
          <svg width="200" height="200" fill="currentColor" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" /></svg>
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Welcome to Secure Smart Library
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm font-medium mt-2 max-w-2xl leading-relaxed">
          Manage your live book rentals, system space status counters, active reservations, and real-time security parameters from your unified sync dashboard space.
        </p>
      </section>

      {/* Global Fetch Synchronization Network Layer Error Alert Box Banner */}
      {hasError && (
        <div className="p-4 border border-rose-200 bg-rose-50 text-rose-800 text-xs font-bold tracking-wide rounded-xl flex items-center gap-3">
          <svg className="w-4 h-4 text-rose-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          Warning: Failed to fetch the absolute latest database metrics synchronization array. Showing localized cached context.
        </div>
      )}

      {/* Dashboard Metrics Statistics Display Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            onClick={() => router.push(stat.path)}
            className="border border-slate-200/80 rounded-2xl bg-white p-5 shadow-sm hover:shadow-md hover:border-slate-300/80 transition-all duration-200 flex items-center justify-between group cursor-pointer"
          >
            <div className="space-y-1">
              <h2 className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                {stat.label}
              </h2>
              {isLoading ? (
                <div className="h-8 w-12 bg-slate-200 animate-pulse rounded-lg mt-1" />
              ) : (
                <p className="text-3xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {stat.value}
                </p>
              )}
            </div>
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 duration-200`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </section>

      {/* Interactive Activity Matrix Layout Section Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Double-Wide Block Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recent Activity Card Block */}
          <section className="border border-slate-200/80 rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-indigo-950 rounded-full" />
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Recent Activity
                </h2>
              </div>
              <button 
                onClick={() => router.push("/dashboard/reservations")} 
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
              >
                View All
              </button>
            </div>

            {isLoading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-12 bg-slate-100 rounded-xl w-full" />
                <div className="h-12 bg-slate-100 rounded-xl w-full" />
              </div>
            ) : reservations.length === 0 ? (
              <EmptyState message="No system logs or activity milestones available at this moment." />
            ) : (
              <div className="flow-root">
                <ul className="-mb-8">
                  {reservations.slice(0, 5).map((log, logIdx) => (
                    <li key={log._id}>
                      <div className="relative pb-6">
                        {logIdx !== Math.min(reservations.length, 5) - 1 ? (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-100" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                              log.status === "Approved" ? "bg-emerald-50 text-emerald-600" :
                              log.status === "Rejected" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                            }`}>
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                              </svg>
                            </span>
                          </div>
                          <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-xs font-semibold text-slate-700">
                                Reserved <span className="font-extrabold text-slate-900">“{getBookTitle(log.book)}”</span>
                              </p>
                            </div>
                            <div className="text-right text-[10px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">
                              <span className={`mr-2.5 px-2 py-0.5 rounded-full text-[9px] ${
                                log.status === "Approved" ? "bg-emerald-100 text-emerald-800" :
                                log.status === "Rejected" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"
                              }`}>
                                {log.status}
                              </span>
                              {formatDisplayDate(log.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Featured Books Grid Block */}
          <section className="border border-slate-200/80 rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-indigo-900 rounded-full" />
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Featured New Additions
                </h2>
              </div>
              <button 
                onClick={() => router.push("/dashboard/books")} 
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
              >
                Explore Catalog
              </button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="h-32 bg-slate-100 rounded-xl animate-pulse" />
                <div className="h-32 bg-slate-100 rounded-xl animate-pulse" />
                <div className="h-32 bg-slate-100 rounded-xl animate-pulse" />
              </div>
            ) : books.length === 0 ? (
              <EmptyState message="No library catalog resource books available at this timeline layer." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {books.slice(0, 3).map((book) => (
                  <div 
                    key={book._id} 
                    onClick={() => router.push(`/dashboard/books?id=${book._id}`)}
                    className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition flex flex-col justify-between group cursor-pointer"
                  >
                    <div>
                      <span className="text-[9px] font-extrabold text-indigo-600 tracking-wider bg-indigo-50 px-2 py-0.5 rounded-md uppercase">
                        {book.category || "General"}
                      </span>
                      <h3 className="text-xs font-bold text-slate-900 mt-2 line-clamp-2 tracking-tight group-hover:text-indigo-600 transition-colors">
                        {book.title}
                      </h3>
                    </div>
                    <p className="text-[10px] font-medium text-slate-400 mt-4 truncate">
                      By {book.author || "Unknown Identity"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Sidebar Block Column inside Page Grid */}
        <div className="space-y-6">
          
          {/* Upcoming Leased Books Monitoring Stream Tracker Panel */}
          <section className="border border-slate-200/80 rounded-2xl bg-white p-6 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-rose-500 rounded-full" />
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Upcoming Due Leases
                </h2>
              </div>
              <button 
                onClick={() => router.push("/dashboard/rentals")} 
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
              >
                Manage
              </button>
            </div>

            {isLoading ? (
              <div className="space-y-3 animate-pulse flex-1">
                <div className="h-10 bg-slate-100 rounded-xl" />
                <div className="h-10 bg-slate-100 rounded-xl" />
              </div>
            ) : rentals.length === 0 ? (
              <div className="flex-1 flex flex-col justify-center">
                <EmptyState message="Excellent setup structure! All borrowed material items are securely current." />
              </div>
            ) : (
              <div className="space-y-3 flex-1 overflow-y-auto">
                {rentals.map((rental) => (
                  <div 
                    key={rental._id} 
                    onClick={() => router.push("/dashboard/rentals")}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white shadow-2xs hover:border-slate-200 transition cursor-pointer"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold text-slate-800 truncate tracking-tight">
                        {getBookTitle(rental.book)}
                      </p>
                      <p className="text-[9px] font-bold text-rose-500 uppercase tracking-wide mt-0.5">
                        Due {formatDisplayDate(rental.dueDate)}
                      </p>
                    </div>
                    <div className="px-2.5 py-1 bg-rose-50 text-rose-700 rounded-lg text-[9px] font-extrabold uppercase tracking-wider shrink-0">
                      Active
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

      </div>

    </div>
  );
}