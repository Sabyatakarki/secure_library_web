"use client";

import { useEffect, useState } from "react";
import api from "../../../../lib/api/axios";

interface Reservation {
  _id: string;
  reservedDate: string;
  status: "Pending" | "Approved" | "Cancelled";

  book: {
    _id: string;
    title: string;
    author: string;
    category: string;
    isbn: string;
    description: string;
    coverImage?: string;
  };
}

export default function ReservationPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await api.get("/reservations/my");
      setReservations(response.data.data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load your active reservations.");
    } finally {
      setLoading(false);
    }
  };

  const cancelReservation = async (reservationId: string) => {
    if (!confirm("Are you sure you want to cancel this reservation?")) return;
    
    try {
      await api.put(`/reservations/cancel/${reservationId}`);

      setReservations((prev) =>
        prev.map((reservation) =>
          reservation._id === reservationId
            ? { ...reservation, status: "Cancelled" }
            : reservation
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to cancel reservation.");
    }
  };

  // Styled Status Pill Generator
  const getStatusBadge = (status: Reservation["status"]) => {
    const config = {
      Pending: "bg-amber-50 text-amber-700 border-amber-200/60",
      Approved: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
      Cancelled: "bg-slate-50 text-slate-500 border-slate-200/60",
    };

    const dotConfig = {
      Pending: "bg-amber-500",
      Approved: "bg-emerald-500",
      Cancelled: "bg-slate-400",
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold tracking-wide rounded-full border shadow-sm ${config[status]}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${dotConfig[status]}`} />
        {status}
      </span>
    );
  };

  // Modern Skeleton Loading State
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-9 w-52 bg-slate-200 rounded-lg mb-8" />
        {[1, 2].map((n) => (
          <div key={n} className="bg-white border border-slate-100 rounded-2xl p-6 flex gap-6">
            <div className="w-28 h-40 bg-slate-200 rounded-xl shrink-0" />
            <div className="flex-1 space-y-3 py-1">
              <div className="h-5 bg-slate-200 rounded w-1/3" />
              <div className="h-4 bg-slate-200 rounded w-1/4" />
              <div className="h-4 bg-slate-200 rounded w-full mt-4" />
              <div className="h-px bg-slate-100 my-4" />
              <div className="h-9 bg-slate-200 rounded w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Page Heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">
          My Reservations
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Holdings and queues management panel for your incoming library selections.
        </p>
      </div>

      {/* Modern Notification Toast/Box */}
      {message && (
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-200/60 text-rose-800 text-sm font-semibold p-4 rounded-xl mb-6 shadow-sm">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-rose-600 shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          {message}
        </div>
      )}

      {/* Clean Empty State */}
      {reservations.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white border border-slate-200/60 rounded-2xl shadow-sm max-w-xl mx-auto mt-8">
          <div className="w-12 h-12 bg-slate-50 border border-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">No reserved holdings</h3>
          <p className="text-sm text-slate-500 font-medium max-w-xs mx-auto mt-1">
            You don't have any pending book titles reserved right now. Explore books to hold a slot.
          </p>
        </div>
      ) : (
        /* Cards Layout Grid Container */
        <div className="grid grid-cols-1 gap-6">
          {reservations.map((reservation) => (
            <div
              key={reservation._id}
              className="group bg-white border border-slate-200/70 hover:border-slate-300/80 rounded-2xl p-5 flex flex-col sm:flex-row gap-6 shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-slate-100/50"
            >
              {/* Cover Image Block */}
              {reservation.book.coverImage ? (
                <div className="relative w-28 h-40 shrink-0 self-center sm:self-start rounded-xl overflow-hidden shadow-md shadow-slate-200/80 border border-slate-100 bg-slate-50">
                  <img
                    src={`http://localhost:5050/uploads/book_covers/${reservation.book.coverImage}`}
                    alt={reservation.book.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="w-28 h-40 shrink-0 self-center sm:self-start rounded-xl border border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400 gap-1.5 p-3">
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 opacity-70">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                  </svg>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-center">No Cover</span>
                </div>
              )}

              {/* Information Meta Body Area */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-1.5">
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-snug group-hover:text-blue-600 transition-colors duration-150">
                      {reservation.book.title}
                    </h2>
                    {getStatusBadge(reservation.status)}
                  </div>

                  <p className="text-sm font-semibold text-slate-700">
                    {reservation.book.author}
                  </p>

                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <span className="text-slate-500">Category:</span>
                      <span className="text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                        {reservation.book.category}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-slate-500">ISBN:</span>
                      <span className="text-slate-600">{reservation.book.isbn}</span>
                    </span>
                  </div>

                  <p className="mt-3.5 text-xs font-medium text-slate-500 leading-relaxed max-w-3xl line-clamp-2 sm:line-clamp-3">
                    {reservation.book.description}
                  </p>
                </div>

                {/* Dashboard Time Metrics Panel */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">Reserved On:</span>
                    <span className="text-slate-800">
                      {new Date(reservation.reservedDate).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      })}
                    </span>
                  </div>

                  {/* Actions Column */}
                  {reservation.status !== "Cancelled" && (
                    <button
                      onClick={() => cancelReservation(reservation._id)}
                      className="text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100/80 border border-rose-100 rounded-xl px-4 py-2 transition-all duration-150 shadow-sm shadow-rose-500/5 active:scale-98"
                    >
                      Cancel Reservation
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}