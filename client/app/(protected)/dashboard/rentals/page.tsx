"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "../../../../lib/api/axios";
import { initiateKhaltiPayment } from "../../../../lib/actions/payment-action";

interface UserProfile {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
}

interface Rental {
  _id: string;
  rentalDate: string;
  dueDate: string;
  returnDate?: string;
  status: "Borrowed" | "Returned" | "Overdue";
  finePaid?: boolean;
  fineAmount?: number;

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

const DAILY_FINE_RATE = 10; // NPR per overdue day

export default function RentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      const [rentalsResponse, profileResponse] = await Promise.all([
        api.get("/rentals/my"),
        api.get("/users/profile"),
      ]);

      setRentals(rentalsResponse.data.data);
      setUser(profileResponse.data.data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load your rentals dashboard.");
    } finally {
      setLoading(false);
    }
  };

  // Normalized fine calculation
  const calculateFine = (dueDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    const differenceInTime = today.getTime() - due.getTime();
    const overdueDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

    return overdueDays > 0 ? overdueDays * DAILY_FINE_RATE : 0;
  };

  const isOverdue = (rental: Rental) => {
    if (rental.status === "Returned") return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(rental.dueDate);
    due.setHours(0, 0, 0, 0);

    return today > due;
  };

  const handlePayment = async (rental: Rental) => {
    try {
      const fineAmountNpr = calculateFine(rental.dueDate);
      const fineAmountPaisa = fineAmountNpr * 100; // Khalti requires paisa

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3003";

      const response = await initiateKhaltiPayment({
        amount: fineAmountPaisa,
        purchase_order_id: `FINE-${rental._id}`,
        purchase_order_name: `Late return fine - ${rental.book.title}`,
        return_url: `${baseUrl}/payment`,
        website_url: baseUrl,
        name: user?.fullName || "Student",
        email: user?.email || "student@example.com",
        phone: user?.phoneNumber || "9800000000",
      });

      if (response?.data?.payment_url) {
        window.location.href = response.data.payment_url;
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to initialize payment.");
    }
  };

  const getStatusBadge = (status: Rental["status"]) => {
    const config = {
      Borrowed: "bg-blue-50 text-blue-700 border-blue-200/60",
      Returned: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
      Overdue: "bg-rose-50 text-rose-700 border-rose-200/60",
    };

    const dotConfig = {
      Borrowed: "bg-blue-500",
      Returned: "bg-emerald-500",
      Overdue: "bg-rose-500",
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold tracking-wide rounded-full border shadow-sm ${config[status]}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${dotConfig[status]}`} />
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-9 w-48 bg-slate-200 rounded-lg mb-8" />
        {[1, 2].map((n) => (
          <div
            key={n}
            className="bg-white border border-slate-100 rounded-2xl p-6 flex gap-6"
          >
            <div className="w-28 h-40 bg-slate-200 rounded-xl shrink-0" />
            <div className="flex-1 space-y-3 py-1">
              <div className="h-5 bg-slate-200 rounded w-1/3" />
              <div className="h-4 bg-slate-200 rounded w-1/4" />
              <div className="h-4 bg-slate-200 rounded w-full mt-4" />
              <div className="h-px bg-slate-100 my-4" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">
          My Rentals
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Track, manage, and monitor your borrowed library collection.
        </p>
      </div>

      {/* Error Alert */}
      {message && (
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-200/60 text-rose-800 text-sm font-semibold p-4 rounded-xl mb-6 shadow-sm">
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5 text-rose-600 shrink-0"
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

      {/* Rentals List / Empty State */}
      {rentals.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white border border-slate-200/60 rounded-2xl shadow-sm max-w-xl mx-auto mt-8">
          <div className="w-12 h-12 bg-slate-50 border border-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
              />
            </svg>
          </div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            No borrowed books
          </h3>
          <p className="text-sm text-slate-500 font-medium max-w-xs mx-auto mt-1">
            Your reading shelf is empty. Explore the catalog to discover your next adventure.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {rentals.map((rental) => {
            const overdue = isOverdue(rental);
            const currentStatus = overdue ? "Overdue" : rental.status;
            const fine = calculateFine(rental.dueDate);

            return (
              <div
                key={rental._id}
                className="group bg-white border border-slate-200/70 hover:border-slate-300/80 rounded-2xl p-5 flex flex-col sm:flex-row gap-6 shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-slate-100/50"
              >
                {/* Book Cover */}
                {rental.book.coverImage ? (
                  <div className="relative w-28 h-40 shrink-0 self-center sm:self-start rounded-xl overflow-hidden shadow-md shadow-slate-200/80 border border-slate-100 bg-slate-50">
                    <Image
  src={`http://localhost:5050/uploads/book_covers/${rental.book.coverImage}`}
  alt={rental.book.title}
  fill
  sizes="112px"
  unoptimized
  className="object-cover group-hover:scale-105 transition-transform duration-300"
/>
                  </div>
                ) : (
                  <div className="w-28 h-40 shrink-0 self-center sm:self-start rounded-xl border border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400 gap-1.5 p-3">
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 opacity-70"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                      />
                    </svg>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-center">
                      No Cover
                    </span>
                  </div>
                )}

                {/* Main Metadata */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-1.5">
                      <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-snug group-hover:text-blue-600 transition-colors duration-150">
                        {rental.book.title}
                      </h2>
                      {getStatusBadge(currentStatus)}
                    </div>

                    <p className="text-sm font-semibold text-slate-700">
                      {rental.book.author}
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <span className="text-slate-500">Category:</span>
                        <span className="text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                          {rental.book.category}
                        </span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-slate-500">ISBN:</span>
                        <span className="text-slate-600">
                          {rental.book.isbn}
                        </span>
                      </span>
                    </div>

                    <p className="mt-3.5 text-xs font-medium text-slate-500 leading-relaxed max-w-3xl line-clamp-2 sm:line-clamp-3">
                      {rental.book.description}
                    </p>
                  </div>

                  {/* Dates & Actions Footer */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-600 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 font-bold uppercase tracking-wider">
                          Borrowed:
                        </span>
                        <span className="text-slate-800">
                          {new Date(rental.rentalDate).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 font-bold uppercase tracking-wider">
                          Due Date:
                        </span>
                        <span
                          className={`font-bold ${
                            overdue ? "text-rose-600" : "text-slate-800"
                          }`}
                        >
                          {new Date(rental.dueDate).toLocaleDateString()}
                        </span>
                      </div>

                      {rental.returnDate && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400 font-bold uppercase tracking-wider">
                            Returned:
                          </span>
                          <span className="text-emerald-600">
                            {new Date(rental.returnDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {rental.status !== "Returned" && (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            console.log("Init return process:", rental._id)
                          }
                          className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100/80 border border-blue-100 rounded-xl px-4 py-2 transition-all"
                        >
                          Request Return
                        </button>

                        {overdue && !rental.finePaid && (
                          <button
                            onClick={() => handlePayment(rental)}
                            className="text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl px-4 py-2 transition-all shadow-sm"
                          >
                            Pay Fine Rs. {fine}
                          </button>
                        )}

                        {rental.finePaid && (
                          <div className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-300 text-xs font-bold">
                            ✓ Fine Paid
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}