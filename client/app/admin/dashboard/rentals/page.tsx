"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "../../../../lib/api/axios";

interface Rental {
  _id: string;
  rentalDate: string;
  dueDate: string;
  returnDate?: string;
  status: "Borrowed" | "Returned" | "Overdue";
  fineAmount: number;
  finePaid: boolean;

  user?: {
    _id: string;
    fullName: string;
    email: string;
    studentId: string;
    department: string;
  };

  book?: {
    _id: string;
    title: string;
    author: string;
    isbn: string;
    coverImage?: string;
  };

  payment?: {
    amount: number;
    status: string;
    transactionId: string;
    createdAt: string;
  } | null;
}

export default function AdminRentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/rentals", {
        withCredentials: true,
      });
      setRentals(response.data.data || []);
    } catch (error: any) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "Failed to load rental records."
      );
    } finally {
      setLoading(false);
    }
  };

  const returnBook = async (rentalId: string) => {
    try {
      setProcessingId(rentalId);
      await api.put(
        `/admin/rentals/return/${rentalId}`,
        {},
        { withCredentials: true }
      );
      await fetchRentals();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to process return.");
    } finally {
      setProcessingId(null);
    }
  };

  // Filter Logic
  const filteredRentals = rentals.filter((rental) => {
    const matchesSearch =
      rental.book?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rental.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rental.user?.studentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rental.book?.isbn?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || rental.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Summary Metrics
  const totalRentals = rentals.length;
  const activeBorrows = rentals.filter((r) => r.status === "Borrowed").length;
  const overdueCount = rentals.filter((r) => r.status === "Overdue").length;
  const totalFines = rentals.reduce((acc, r) => acc + (r.fineAmount || 0), 0);

  const getStatusBadge = (status: Rental["status"]) => {
    const styles = {
      Borrowed: "bg-blue-50 text-blue-700 border-blue-200/80",
      Returned: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      Overdue: "bg-rose-50 text-rose-700 border-rose-200/80",
    };

    const dots = {
      Borrowed: "bg-blue-500",
      Returned: "bg-emerald-500",
      Overdue: "bg-rose-500",
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full border shadow-xs ${styles[status]}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${dots[status]}`} />
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 animate-pulse p-4 sm:p-6">
        <div className="h-10 w-64 bg-slate-200 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-2xl" />
          ))}
        </div>
        <div className="h-96 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">
            Rental Management
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Monitor active borrows, track late returns, and process book returns.
          </p>
        </div>
        <button
          onClick={fetchRentals}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition-all self-start sm:self-auto"
        >
          <svg
            className="w-4 h-4 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          Refresh Data
        </button>
      </div>

      {/* Global Error Banner */}
      {message && (
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-200/80 text-rose-800 text-sm font-semibold p-4 rounded-2xl shadow-xs">
          <svg
            className="w-5 h-5 text-rose-600 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
          {message}
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Transactions
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {totalRentals}
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Currently Borrowed
          </span>
          <div className="text-2xl font-black text-blue-600 mt-1">
            {activeBorrows}
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Overdue Records
          </span>
          <div className="text-2xl font-black text-rose-600 mt-1">
            {overdueCount}
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Outstanding Fines
          </span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            Rs. {totalFines}
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search book, student, ISBN, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {["ALL", "Borrowed", "Overdue", "Returned"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                statusFilter === status
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200/70 text-slate-600"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Records Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        {filteredRentals.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 bg-slate-50 border border-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              No rental records found
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search query or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Book Details</th>
                  <th className="py-3.5 px-4">Student Info</th>
                  <th className="py-3.5 px-4">Timeline</th>
                  <th className="py-3.5 px-4">Status & Fines</th>
                  <th className="py-3.5 px-4">Khalti Payment</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredRentals.map((rental) => (
                  <tr
                    key={rental._id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    {/* Book Details */}
                    <td className="py-4 px-4 min-w-[220px]">
                      <div className="flex gap-3 items-center">
                        {rental.book?.coverImage ? (
                          <div className="relative w-10 h-14 rounded-md overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                            <Image
                              src={`http://localhost:5050/uploads/book_covers/${rental.book.coverImage}`}
                              alt={rental.book.title || "Book"}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-14 rounded-md bg-slate-100 border border-dashed border-slate-200 shrink-0 flex items-center justify-center text-slate-400">
                            <svg
                              className="w-4 h-4 opacity-60"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                              />
                            </svg>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">
                            {rental.book?.title || "Unknown Title"}
                          </p>
                          <p className="text-slate-500 font-normal">
                            {rental.book?.author || "Unknown Author"}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                            ISBN: {rental.book?.isbn || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Student Info */}
                    <td className="py-4 px-4 min-w-[180px]">
                      <div>
                        <p className="font-bold text-slate-900">
                          {rental.user?.fullName || "Unregistered User"}
                        </p>
                        <p className="text-slate-500 text-[11px]">
                          ID: {rental.user?.studentId || "N/A"} •{" "}
                          {rental.user?.department || "General"}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {rental.user?.email || "No Email"}
                        </p>
                      </div>
                    </td>

                    {/* Dates Timeline */}
                    <td className="py-4 px-4 min-w-[160px]">
                      <div className="space-y-1 text-[11px]">
                        <div className="flex justify-between text-slate-600">
                          <span className="text-slate-400 font-semibold">
                            Borrowed:
                          </span>
                          <span>
                            {new Date(rental.rentalDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span className="text-slate-400 font-semibold">
                            Due:
                          </span>
                          <span
                            className={
                              rental.status === "Overdue"
                                ? "text-rose-600 font-bold"
                                : ""
                            }
                          >
                            {new Date(rental.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                        {rental.returnDate && (
                          <div className="flex justify-between text-emerald-600 font-semibold">
                            <span>Returned:</span>
                            <span>
                              {new Date(rental.returnDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status & Fines */}
                    <td className="py-4 px-4 min-w-[150px]">
                      <div className="space-y-2">
                        <div>{getStatusBadge(rental.status)}</div>
                        {rental.fineAmount > 0 ? (
                          <div className="text-[11px]">
                            <span className="font-bold text-rose-600">
                              Fine: Rs. {rental.fineAmount}
                            </span>
                            <span
                              className={`ml-2 px-1.5 py-0.5 text-[10px] font-bold rounded ${
                                rental.finePaid
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-rose-100 text-rose-700"
                              }`}
                            >
                              {rental.finePaid ? "Paid" : "Unpaid"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">
                            No Fines
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Payment Info */}
                    <td className="py-4 px-4 min-w-[180px]">
                      {rental.payment ? (
                        <div className="text-[11px] bg-slate-50 border border-slate-200/60 p-2 rounded-xl space-y-0.5">
                          <div className="flex justify-between">
                            <span className="text-slate-400 font-semibold">
                              Status:
                            </span>
                            <span className="font-bold text-emerald-600 uppercase text-[10px]">
                              {rental.payment.status}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400 font-semibold">
                              Amount:
                            </span>
                            <span className="font-bold text-slate-800">
                              Rs. {rental.payment.amount}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono truncate pt-0.5 border-t border-slate-100 mt-1">
                            Txn: {rental.payment.transactionId}
                          </p>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">
                          No transactions
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right min-w-[130px]">
                      {rental.status !== "Returned" ? (
                        <button
                          disabled={processingId === rental._id}
                          onClick={() => returnBook(rental._id)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 px-3.5 py-2 rounded-xl transition-all shadow-xs"
                        >
                          {processingId === rental._id ? (
                            <span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" />
                          ) : (
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                              />
                            </svg>
                          )}
                          Return Book
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-slate-400">
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}