"use client";

import { useEffect, useState } from "react";
import axios from "../../../lib/api/axios";

interface Book {
  _id: string;
}

interface Reservation {
  _id: string;
  status: "Pending" | "Approved" | "Cancelled";
  user: {
    fullName: string;
  };
  book: {
    title: string;
  };
}

interface Rental {
  _id: string;
  status: "Borrowed" | "Returned" | "Overdue";
  dueDate: string;
  user: {
    fullName: string;
  };
  book: {
    title: string;
  };
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      setLoading(true)
      const [
        bookRes, 
        reservationRes, 
        rentalRes, 
        profileRes
      ] = await Promise.all([
        axios.get("/books"),
        axios.get("/admin/reservations"),
        axios.get("/admin/rentals"),
        axios.get("/users/profile"),
      ]);

      setBooks(bookRes.data.data || []);
      setReservations(reservationRes.data.data || []);
      setRentals(rentalRes.data.data || []);
      setAdmin(profileRes.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const stats = [
    {
      title: "Total Books",
      value: books.length,
      color: "text-purple-600 bg-purple-50 border-purple-100",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      title: "Total Reservations",
      value: reservations.length,
      color: "text-blue-600 bg-blue-50 border-blue-100",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "Pending Reservations",
      value: reservations.filter((r) => r.status === "Pending").length,
      color: "text-amber-600 bg-amber-50 border-amber-100",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Active Rentals",
      value: rentals.filter((r) => r.status === "Borrowed").length,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
  ];

  const getReservationStatusStyle = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200/60";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200/60";
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto antialiased">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 h-28 animate-pulse flex justify-between items-center">
          <div className="space-y-2 w-1/3">
            <div className="h-6 bg-slate-100 rounded" />
            <div className="h-4 bg-slate-100 rounded w-3/4" />
          </div>
          <div className="flex gap-3 items-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full" />
            <div className="space-y-1.5 w-24">
              <div className="h-3 bg-slate-100 rounded" />
              <div className="h-3 bg-slate-100 rounded w-5/6" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white border border-slate-200 rounded-2xl p-5 h-24 animate-pulse flex justify-between items-center">
              <div className="space-y-2 w-1/2">
                <div className="h-3 bg-slate-100 rounded" />
                <div className="h-5 bg-slate-100 rounded w-2/3" />
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto antialiased">
      
      {/* Header Welcome Card Profile Hero Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-slate-200/80 shadow-2xs rounded-2xl p-6 gap-6">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            Admin Dashboard
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Welcome back to the Secure Smart Library System workspace manager.
          </p>
        </div>

        {admin && (
          <div className="flex items-center gap-4 border-t sm:border-t-0 border-slate-50 pt-4 sm:pt-0">
            
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-slate-800 tracking-tight truncate">
                {admin.fullName}
              </h3>
              <p className="text-[11px] text-slate-400 font-medium truncate">
                {admin.email}
              </p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-extrabold tracking-wide uppercase">
                {admin.role || "Admin"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Grid Layout Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-xs hover:border-slate-300 transition duration-200 flex items-center justify-between group"
          >
            <div className="space-y-1.5 min-w-0">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
                {stat.title}
              </p>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight group-hover:scale-[1.01] transition transform origin-left">
                {stat.value}
              </h2>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Tables Matrix Workspace Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Table: Recent Reservation Requests */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-50">
              <h2 className="text-sm font-black text-slate-800 tracking-tight">
                Recent Reservation Requests
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Latest system intake queue for processing allocations.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100">
                    <th className="py-2.5 px-5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Student</th>
                    <th className="py-2.5 px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Book Title</th>
                    <th className="py-2.5 px-5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {reservations.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-12 px-5">
                        <p className="text-xs font-medium text-slate-400">No active reservation requests queued</p>
                      </td>
                    </tr>
                  ) : (
                    reservations.slice(0, 5).map((reservation) => (
                      <tr key={reservation._id} className="hover:bg-slate-50/40 transition">
                        <td className="py-3 px-5 text-xs font-semibold text-slate-700 truncate max-w-[140px]">
                          {reservation.user?.fullName || "Unknown User"}
                        </td>
                        <td className="py-3 px-3 text-xs text-slate-600 font-medium truncate max-w-[200px]">
                          {reservation.book?.title || "Missing Title"}
                        </td>
                        <td className="py-3 px-5 text-right whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide uppercase border ${getReservationStatusStyle(reservation.status)}`}>
                            {reservation.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Table: Active Rentals */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-50">
              <h2 className="text-sm font-black text-slate-800 tracking-tight">
                Active Rentals
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Currently issued media objects currently checked out away from shelves.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100">
                    <th className="py-2.5 px-5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Student</th>
                    <th className="py-2.5 px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Book Title</th>
                    <th className="py-2.5 px-5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 text-right">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {rentals.filter((r) => r.status === "Borrowed").length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-12 px-5">
                        <p className="text-xs font-medium text-slate-400">No active distributed catalog media out</p>
                      </td>
                    </tr>
                  ) : (
                    rentals
                      .filter((r) => r.status === "Borrowed")
                      .slice(0, 5)
                      .map((rental) => (
                        <tr key={rental._id} className="hover:bg-slate-50/40 transition">
                          <td className="py-3 px-5 text-xs font-semibold text-slate-700 truncate max-w-[140px]">
                            {rental.user?.fullName || "Unknown User"}
                          </td>
                          <td className="py-3 px-3 text-xs text-slate-600 font-medium truncate max-w-[200px]">
                            {rental.book?.title || "Missing Title"}
                          </td>
                          <td className="py-3 px-5 text-right whitespace-nowrap text-xs font-mono font-bold text-slate-500">
                            {new Date(rental.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}