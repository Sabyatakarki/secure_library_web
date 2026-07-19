"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Layers, CheckCircle2, ShieldAlert, HeartCrack } from "lucide-react";
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

export default function FavoritesPage() {
  const router = useRouter();
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Custom Alert Toast State
  const [toast, setToast] = useState<ToastState>({ show: false, message: "", type: "success" });

  useEffect(() => {
    fetchFavoriteDetails();
  }, []);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3500);
  };

  const fetchFavoriteDetails = async () => {
    try {
      setLoading(true);
      
      // 1. Get current favorite IDs array from client storage cache
      const savedFavs = localStorage.getItem("student_favorites");
      if (!savedFavs || JSON.parse(savedFavs).length === 0) {
        setFavoriteBooks([]);
        return;
      }
      
      const favIds: string[] = JSON.parse(savedFavs);

      // 2. Fetch system global catalog data matrix
      const response = await api.get("/books");
      const allBooks: Book[] = response.data.data || [];

      // 3. Filter down list matrix items intersection matches
      const matchedBooks = allBooks.filter((book) => favIds.includes(book._id));
      setFavoriteBooks(matchedBooks);
    } catch (error) {
      console.error(error);
      showToast("Error structuralizing favorited list files.", "error");
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = (bookId: string, bookTitle: string) => {
    const savedFavs = localStorage.getItem("student_favorites");
    if (!savedFavs) return;

    const favIds: string[] = JSON.parse(savedFavs);
    const updatedIds = favIds.filter((id) => id !== bookId);
    
    // Sync storage parameters back into cache memory
    localStorage.setItem("student_favorites", JSON.stringify(updatedIds));
    
    // Smoothly clear row locally out of render context grid view instantly
    setFavoriteBooks((prev) => prev.filter((b) => b._id !== bookId));
    showToast(`Removed "${bookTitle}" from favorites.`);
  };

  const reserveBook = async (bookId: string) => {
    try {
      await api.post(`/reservations/${bookId}`);
      showToast("Book holding allocation generated! Routing...", "success");
      
      setTimeout(() => {
        router.push("/dashboard/reservations");
      }, 1500);
    } catch (error: any) {
      console.error(error);
      showToast(error.response?.data?.message || "Reservation block failed.", "error");
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto antialiased animate-pulse">
        <div className="h-6 bg-slate-100 rounded w-1/5 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2].map((n) => (
            <div key={n} className="bg-white border border-slate-200 rounded-2xl p-4 h-36" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 antialiased pb-12 relative">
      
      {/* Dynamic Floating Toast Component System */}
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

      {/* Header Module Area */}
      <div className="border-b border-slate-100 pb-5 space-y-2">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-600 transition group cursor-pointer select-none"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          <span>Back to catalog</span>
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              My Bookmarked Favorites
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Your handpicked library assets staging area for quick reference retrieval.
            </p>
          </div>
        </div>
      </div>

      {/* Main Core Conditional Elements Check Area */}
      {favoriteBooks.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-16 text-center max-w-xl mx-auto flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
            <HeartCrack size={20} />
          </div>
          <div>
            <p className="text-sm font-black text-slate-700">No favorited media items registered</p>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Tap the heart toggle markers when scanning the books catalog to populate this workspace layout.
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/books")}
            className="mt-2 bg-indigo-600 border border-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-2xs transition cursor-pointer"
          >
            Explore Catalog Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {favoriteBooks.map((book) => {
            const outOfStock = book.availableCopies === 0;

            return (
              <div
                key={book._id}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs hover:shadow-xs hover:border-slate-300/90 transition-all duration-200 flex gap-4 items-start group relative min-h-[160px]"
              >
                {/* Book Image Cover Wrapper */}
                <div className="w-24 h-32 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-1.5 shadow-3xs">
                  {book.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`http://localhost:5050/uploads/book_covers/${book.coverImage}`}
                      alt={book.title}
                      className="max-h-full max-w-full object-contain rounded-sm transition duration-300 group-hover:scale-103"
                    />
                  ) : (
                    <div className="text-[10px] text-slate-300 uppercase font-black tracking-widest text-center">No Cover</div>
                  )}
                </div>

                {/* Text Layout Structural Blueprint */}
                <div className="flex-1 min-w-0 flex flex-col justify-between h-32">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[9px] font-bold text-indigo-600 tracking-wider uppercase truncate max-w-[120px]">
                        {book.category}
                      </span>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Instant Eviction Extraction Button */}
                        <button
                          onClick={() => removeFavorite(book._id, book.title)}
                          className="text-slate-300 hover:text-rose-600 p-0.5 transition cursor-pointer border border-slate-100 hover:border-rose-100 rounded-md bg-slate-50/50 hover:bg-rose-50"
                          title="Drop Bookmark"
                        >
                          <Trash2 size={12} className="text-slate-400 hover:text-rose-600" />
                        </button>

                        <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wide border ${
                          outOfStock ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}>
                          {outOfStock ? "Out" : "Available"}
                        </span>
                      </div>
                    </div>

                    <h2 className="text-sm font-black text-slate-800 truncate mt-0.5 group-hover:text-indigo-600 transition-colors">
                      {book.title}
                    </h2>
                    <p className="text-[11px] font-medium text-slate-400 truncate">
                      by {book.author}
                    </p>

                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                      {book.description || "No registry description details set for this object catalog item."}
                    </p>
                  </div>

                  {/* Table Base Alignment Controls */}
                  <div className="flex items-center justify-between border-t border-slate-50 pt-2 mt-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                      <Layers size={11} className="text-slate-300" />
                      <span className="text-slate-500">{book.availableCopies}/{book.totalCopies} Stock</span>
                    </div>

                    <button
                      onClick={() => reserveBook(book._id)}
                      disabled={outOfStock}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-tight text-white transition cursor-pointer select-none ${
                        outOfStock
                          ? "bg-slate-200 border border-slate-200 text-slate-400 cursor-not-allowed"
                          : "bg-indigo-600 border border-indigo-600 hover:bg-indigo-700 shadow-3xs"
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