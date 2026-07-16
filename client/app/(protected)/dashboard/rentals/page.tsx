"use client";

import { useEffect, useState } from "react";
import api from "../../../../lib/api/axios";

interface Rental {
  _id: string;
  rentalDate: string;
  dueDate: string;
  returnDate?: string;
  status: "Borrowed" | "Returned" | "Overdue";

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

export default function RentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      const response = await api.get("/rentals/my-rentals");
      setRentals(response.data.data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load rentals.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading rentals...</p>;
  }

  return (
    <div className="max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">
        My Rentals
      </h1>

      {message && (
        <div className="border rounded p-3 mb-4">
          {message}
        </div>
      )}

      {rentals.length === 0 ? (
        <p>You don't have any borrowed books.</p>
      ) : (
        <div className="space-y-5">
          {rentals.map((rental) => (
            <div
              key={rental._id}
              className="border rounded-lg p-5 flex gap-5"
            >
              {rental.book.coverImage && (
                <img
                  src={`http://localhost:5050/uploads/book_covers/${rental.book.coverImage}`}
                  alt={rental.book.title}
                  className="w-32 h-44 object-cover rounded border"
                />
              )}

              <div className="flex-1">
                <h2 className="text-xl font-semibold">
                  {rental.book.title}
                </h2>

                <p>
                  <strong>Author:</strong>{" "}
                  {rental.book.author}
                </p>

                <p>
                  <strong>Category:</strong>{" "}
                  {rental.book.category}
                </p>

                <p>
                  <strong>ISBN:</strong>{" "}
                  {rental.book.isbn}
                </p>

                <p className="mt-2">
                  {rental.book.description}
                </p>

                <hr className="my-4" />

                <p>
                  <strong>Borrow Date:</strong>{" "}
                  {new Date(
                    rental.rentalDate
                  ).toLocaleDateString()}
                </p>

                <p>
                  <strong>Due Date:</strong>{" "}
                  {new Date(
                    rental.dueDate
                  ).toLocaleDateString()}
                </p>

                {rental.returnDate && (
                  <p>
                    <strong>Returned On:</strong>{" "}
                    {new Date(
                      rental.returnDate
                    ).toLocaleDateString()}
                  </p>
                )}

                <p className="mt-3">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-semibold ${
                      rental.status === "Borrowed"
                        ? "text-blue-600"
                        : rental.status === "Returned"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {rental.status}
                  </span>
                </p>

                {/* Add Return Request button later */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}