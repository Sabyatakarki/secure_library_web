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
      const response = await api.get("/reservations/my-reservations");
      setReservations(response.data.data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load reservations.");
    } finally {
      setLoading(false);
    }
  };

  const cancelReservation = async (reservationId: string) => {
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

  if (loading) {
    return <p>Loading reservations...</p>;
  }

  return (
    <div className="max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">
        My Reservations
      </h1>

      {message && (
        <div className="mb-5 border rounded p-3">
          {message}
        </div>
      )}

      {reservations.length === 0 ? (
        <p>You haven't reserved any books yet.</p>
      ) : (
        <div className="space-y-5">
          {reservations.map((reservation) => (
            <div
              key={reservation._id}
              className="border rounded-lg p-5 flex gap-5"
            >
              {reservation.book.coverImage && (
                <img
                  src={`http://localhost:5050/uploads/book_covers/${reservation.book.coverImage}`}
                  alt={reservation.book.title}
                  className="w-32 h-44 object-cover rounded border"
                />
              )}

              <div className="flex-1">
                <h2 className="text-xl font-semibold">
                  {reservation.book.title}
                </h2>

                <p>
                  <strong>Author:</strong>{" "}
                  {reservation.book.author}
                </p>

                <p>
                  <strong>Category:</strong>{" "}
                  {reservation.book.category}
                </p>

                <p>
                  <strong>ISBN:</strong>{" "}
                  {reservation.book.isbn}
                </p>

                <p className="mt-2">
                  {reservation.book.description}
                </p>

                <p className="mt-3">
                  <strong>Reserved On:</strong>{" "}
                  {new Date(
                    reservation.reservedDate
                  ).toLocaleDateString()}
                </p>

                <p className="mt-1">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-semibold ${
                      reservation.status === "Pending"
                        ? "text-yellow-600"
                        : reservation.status === "Approved"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {reservation.status}
                  </span>
                </p>

                {reservation.status !== "Cancelled" && (
                  <button
                    onClick={() =>
                      cancelReservation(reservation._id)
                    }
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
                  >
                    Cancel Reservation
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}