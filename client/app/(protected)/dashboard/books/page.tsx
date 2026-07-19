"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Layers, Heart, ShieldAlert, CheckCircle2, Bookmark } from "lucide-react";
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

interface ToastState {
  show: boolean;
  message: string;
  type: "success" | "error";
}

export default function BooksPage() {
  const router = useRouter();

  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const [toast, setToast] = useState<ToastState>({ show: false, message: "", type: "success" });

  useEffect(() => {
    fetchBooks();
    const savedFavs = localStorage.getItem("student_favorites");
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {
        console.error("Failed to parse favorites browser state", e);
      }
    }
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(
        (b) =>
          b.title.toLowerCase().includes(query) ||
          b.author.toLowerCase().includes(query) ||
          b.category.toLowerCase().includes(query) ||
          b.isbn.includes(query)
      );
      setFilteredBooks(filtered);
    }
  }, [searchQuery, books]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get("/books");
      const booksData = response.data.data || [];
      setBooks(booksData);
      setFilteredBooks(booksData);
    } catch (error) {
      console.error(error);
      showToast("Failed to load catalog resources correctly.", "error");
    } finally {
      setLoading(false);
    }
  };

  const reserveBook = async (bookId: string) => {
    try {
      await api.post(`/reservations/${bookId}`);
      showToast("Book reserved successfully! Redirecting status...", "success");
      fetchBooks();
      setTimeout(() => {
        router.push("/dashboard/reservations");
      }, 1500);
    } catch (error: any) {
      console.error(error);
      showToast(error.response?.data?.message || "Failed to finalize reservation.", "error");
    }
  };

  const toggleFavorite = (bookId: string, bookTitle: string) => {
    let updatedFavs: string[];
    if (favorites.includes(bookId)) {
      updatedFavs = favorites.filter((id) => id !== bookId);
      showToast(`Removed "${bookTitle}" from your favorites.`);
    } else {
      updatedFavs = [...favorites, bookId];
      showToast(`Added "${bookTitle}" to your favorites!`);
    }
    setFavorites(updatedFavs);
    localStorage.setItem("student_favorites", JSON.stringify(updatedFavs));
  };

  if (loading) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto antialiased animate-pulse">
        <div className="h-8 bg-slate-100 rounded w-1/4 mb-4" />
        <div className="h-11 bg-slate-150 rounded-xl w-full max-w-md mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white border border-slate-200 rounded-2xl p-6 h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 antialiased pb-12 relative px-4 md:px-0">
      
      {/* Floating Toast Component */}
      {toast.show && (
        <div className="fixed top-5 right-5 z-50 transform transition-all duration-300 translate-y-0">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg bg-white min-w-[300px] ${
            toast.type === "success" ? "border-emerald-200 text-emerald-800" : "border-rose-200 text-rose-800"
          }`}>
            {toast.type === "success" ? (
              <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
            ) : (
              <ShieldAlert size={18} className="text-rose-500 shrink-0" />
            )}
            <p className="text-xs font-semibold">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Header Workspace Block */}
      <div className="border-b border-slate-200/60 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Library Catalog
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Browse media resources, organize favorites, and hold reservation parameters.
          </p>
        </div>
        
        <button 
          onClick={() => router.push("/dashboard/favorites")}
          className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold transition shadow-3xs cursor-pointer self-start sm:self-auto"
        >
          <Bookmark size={14} className="text-indigo-600 fill-indigo-100" />
          <span>My Favorites ({favorites.length})</span>
        </button>
      </div>

      {/* Search Input Box */}
      <div className="max-w-md relative group">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
          <Search size={16} />
        </div>
        <input
          type="text"
          placeholder="Search by title, author, category or ISBN registry..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-3xs"
        />
      </div>

      {/* Catalog Grid */}
      {filteredBooks.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto shadow-3xs">
          <p className="text-sm font-semibold text-slate-400">
            {searchQuery ? "No library assets match your current parameters." : "No books deployed inside system database."}
          </p>
        </div>
      ) : (
        // Adjusted gap and layout columns to let cards expand beautifully
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBooks.map((book) => {
            const isFav = favorites.includes(book._id);
            const outOfStock = book.availableCopies === 0;

            return (
              <div
                key={book._id}
                className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-3xs hover:shadow-sm hover:border-slate-300/80 transition-all duration-200 flex flex-col sm:flex-row gap-5 items-start group"
              >
                {/* Book Cover Container (Expanded sizing) */}
                <div className="w-full sm:w-28 h-40 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-2 shadow-3xs">
                  {book.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`http://localhost:5050/uploads/book_covers/${book.coverImage}`}
                      alt={book.title}
                      className="max-h-full max-w-full object-contain rounded-md transition duration-300 group-hover:scale-102"
                    />
                  ) : (
                    <div className="text-[10px] text-slate-300 uppercase font-black tracking-widest text-center">No Cover</div>
                  )}
                </div>

                {/* Content Panel (Removed restrictive hardcoded heights) */}
                <div className="flex-1 w-full flex flex-col justify-between self-stretch space-y-3">
                  <div className="space-y-1.5">
                    {/* Upper Badge & Action Bar */}
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[10px] font-black text-indigo-600 tracking-wider uppercase bg-indigo-50/60 px-2 py-0.5 rounded-md border border-indigo-100/30">
                        {book.category}
                      </span>
                      
                      <div className="flex items-center gap-2.5 shrink-0">
                        <button
                          onClick={() => toggleFavorite(book._id, book.title)}
                          className="text-slate-300 hover:text-rose-500 p-1 transition cursor-pointer rounded-lg hover:bg-slate-50"
                          title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                        >
                          <Heart size={16} className={isFav ? "fill-rose-500 text-rose-500" : "text-slate-400"} />
                        </button>

                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wide border ${
                          outOfStock ? "bg-rose-50 text-rose-700 border-rose-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"
                        }`}>
                          {outOfStock ? "Out of Stock" : "Available"}
                        </span>
                      </div>
                    </div>

                    {/* Book Metadata Titles */}
                    <div>
                      <h2 className="text-base font-black text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {book.title}
                      </h2>
                      <p className="text-xs font-medium text-slate-400 mt-0.5">
                        by <span className="text-slate-600 font-semibold">{book.author}</span>
                      </p>
                    </div>

                    {/* Description Paragraph: Restructured with line-clamp-3 for breathing room */}
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed pt-1">
                      {book.description || "No registry description set for this object catalog item."}
                    </p>
                  </div>

                  {/* Operational Controls Footer Row */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-auto">
                    <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400">
                      <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-md">
                        <Layers size={12} className="text-slate-400" />
                        <span className="text-slate-600">{book.availableCopies} / {book.totalCopies} Available</span>
                      </div>
                      <span className="font-mono text-slate-400 tracking-tight hidden sm:inline text-xs font-normal">
                        ISBN: {book.isbn}
                      </span>
                    </div>

                    <button
                      onClick={() => reserveBook(book._id)}
                      disabled={outOfStock}
                      className={`px-4 py-2 rounded-xl text-xs font-bold tracking-tight text-white transition cursor-pointer select-none ${
                        outOfStock
                          ? "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                          : "bg-indigo-600 border border-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/10"
                      }`}
                    >
                      Hold Reserve
                    </button>
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