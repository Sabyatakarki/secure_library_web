"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../../lib/api/axios";

interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  coverImage?: string;
}

export default function BooksPage() {
  const router = useRouter();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get("/books");
      setBooks(response.data.data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load books.");
    } finally {
      setLoading(false);
    }
  };

  const reserveBook = async (bookId: string) => {
  try {
    await api.post(`/reservations/${bookId}`);

    alert("Book reserved successfully!");

    // Refresh available copies
    fetchBooks();

    // Redirect to Reservation page
    router.push("/dashboard/reservations");
  } catch (error: any) {
    console.error(error);

    alert(
      error.response?.data?.message ||
        "Failed to reserve book."
    );
  }
};

  if (loading) {
    return <p>Loading books...</p>;
  }

  return (
    <div className="max-w-7xl">

      <h1 className="text-3xl font-bold mb-6">
        Library Books
      </h1>

      {message && (
        <div className="mb-5 p-3 border rounded">
          {message}
        </div>
      )}

      {books.length === 0 ? (
        <p>No books available.</p>
      ) : (
        <div className="space-y-4">
          {books.map((book) => (
            <div
  key={book._id}
  className="border rounded-lg p-5"
>
 {book.coverImage && (
  <img
    src={`http://localhost:5050/uploads/book_covers/${book.coverImage}`}
    alt={book.title}
    className="w-32 h-44 object-cover rounded mb-4 border"
  />
)}

  <h2 className="text-xl font-semibold">
    {book.title}
  </h2>

  <p>
    <strong>Author:</strong> {book.author}
  </p>

  <p>
    <strong>Category:</strong> {book.category}
  </p>

  <p>
    <strong>ISBN:</strong> {book.isbn}
  </p>

  <p>
    <strong>Available:</strong>
    {book.availableCopies} / {book.totalCopies}
  </p>

  <p className="mt-2">
    {book.description}
  </p>

  <button
  onClick={() => reserveBook(book._id)}
  disabled={book.availableCopies === 0}
  className={`mt-4 px-4 py-2 rounded text-white ${
    book.availableCopies > 0
      ? "bg-green-600 hover:bg-green-700"
      : "bg-gray-400 cursor-not-allowed"
  }`}
>
  Reserve Book
</button>
</div>
          ))}
        </div>
      )}
    </div>
  );
}