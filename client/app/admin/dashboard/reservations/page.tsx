"use client";

import { useEffect, useState } from "react";
import axios from "../../../../lib/api/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Reservation {
  _id: string;
  user: {
    fullName: string;
    email: string;
    studentId: string;
    department: string;
  };
  book: {
    title: string;
    author: string;
    isbn: string;
    coverImage: string;
  };
  status: "Pending" | "Approved" | "Cancelled";
  createdAt: string;
}

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/admin/reservations", {
        withCredentials: true,
      });
      setReservations(response.data.data || []);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to fetch reservations"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const approveReservation = async (reservationId: string) => {
    try {
      setActionLoading(reservationId);
      await axios.put(
        `/admin/reservations/approve/${reservationId}`,
        {},
        { withCredentials: true }
      );
      toast.success("Reservation approved successfully");
      fetchReservations();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Approval failed");
    } finally {
      setActionLoading(null);
    }
  };

  const cancelReservation = async (reservationId: string) => {
    try {
      setActionLoading(reservationId);
      await axios.put(
        `/admin/reservations/cancel/${reservationId}`,
        {},
        { withCredentials: true }
      );
      toast.success("Reservation cancelled successfully");
      fetchReservations();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Cancellation failed");
    } finally {
      setActionLoading(null);
    }
  };

  // Helper mapping for badges styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200/60";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200/60";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto antialiased">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* Header Info Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5 gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            Reservation Management
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Review, approve, or decline incoming student physical media resource holdings requests.
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-2xs self-start sm:self-center">
          <span className="text-xs font-bold text-slate-500">Total Requests: </span>
          <span className="text-sm font-black text-blue-600">{reservations.length}</span>
        </div>
      </div>

      {/* Conditional Loading State Interface Grid Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white border border-slate-200/80 rounded-2xl p-5 flex gap-4 animate-pulse">
              <div className="w-24 h-32 bg-slate-100 rounded-xl shrink-0" />
              <div className="space-y-3 flex-1 pt-1">
                <div className="h-4 bg-slate-100 rounded w-2/3" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
                <div className="h-3 bg-slate-100 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : reservations.length === 0 ? (
        /* Clean Empty State Placeholder View */
        <div className="flex flex-col items-center justify-center border border-dashed border-slate-200 bg-white rounded-2xl py-16 px-4 text-center">
          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mb-3 border border-slate-100">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-slate-800">No active requests</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">All database reservation allocations are cleanly processed.</p>
        </div>
      ) : (
        /* Main Matrix Workspace Data List Layout Grid */
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {reservations.map((reservation) => (
            <div
              key={reservation._id}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:shadow-sm transition flex flex-col sm:flex-row gap-5 relative overflow-hidden group"
            >
              {/* Media Aspect Book Poster Container Cover Block */}
              <div className="w-28 h-38 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shrink-0 shadow-2xs self-center sm:self-start">
                <img
                  src={`http://localhost:5050/uploads/book_covers/${reservation.book.coverImage}`}
                  alt={reservation.book.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                  onError={(e) => {
                    // Fallback visual design block in case images are missing
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>

              {/* Textual Informational Fields Layout Stack */}
              <div className="flex-1 min-w-0 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* Title & Status Badge Line */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-sm font-black text-slate-800 truncate tracking-tight leading-snug">
                        {reservation.book.title}
                      </h2>
                      <p className="text-[11px] font-medium text-slate-400 mt-0.5 truncate">
                        By {reservation.book.author}
                      </p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase border shrink-0 ${getStatusStyle(reservation.status)}`}>
                      {reservation.status}
                    </span>
                  </div>

                  {/* Student Identity Profiling Section */}
                  <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3 space-y-1.5">
                    <div className="flex items-center text-[11px] text-slate-500">
                      <span className="font-bold text-slate-700 w-16 shrink-0">Student:</span>
                      <span className="truncate font-medium">{reservation.user.fullName}</span>
                    </div>
                    <div className="flex items-center text-[11px] text-slate-500">
                      <span className="font-bold text-slate-700 w-16 shrink-0">ID:</span>
                      <span className="font-mono tracking-tight text-slate-600">{reservation.user.studentId || "N/A"}</span>
                    </div>
                    <div className="flex items-center text-[11px] text-slate-500">
                      <span className="font-bold text-slate-700 w-16 shrink-0">Dept:</span>
                      <span className="truncate font-medium">{reservation.user.department}</span>
                    </div>
                    <div className="flex items-center text-[11px] text-slate-500">
                      <span className="font-bold text-slate-700 w-16 shrink-0">Email:</span>
                      <span className="truncate font-medium text-slate-600">{reservation.user.email}</span>
                    </div>
                  </div>
                </div>

                {/* Conditional Actions Section Footer Container */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-50 gap-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    {new Date(reservation.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>

                  {reservation.status === "Pending" && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        disabled={actionLoading === reservation._id}
                        onClick={() => cancelReservation(reservation._id)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-xs font-bold bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        disabled={actionLoading === reservation._id}
                        onClick={() => approveReservation(reservation._id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition disabled:opacity-50 min-w-[76px] text-center"
                      >
                        {actionLoading === reservation._id ? "..." : "Approve"}
                      </button>
                    </div>
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