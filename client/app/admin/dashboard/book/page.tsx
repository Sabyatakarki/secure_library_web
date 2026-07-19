"use client";

import { useEffect, useState } from "react";
import axios from "../../../../lib/api/axios";
import BookForm from "../../_components/BookForm";
import BookCard from "../../_components/bookcard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BookOpen, FolderSync, PlusCircle, Layers, Library, Search } from "lucide-react";

interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  description: string;
  publisher: string;
  publishedYear: number;
  language: string;
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string;
  coverImage: string;
  status: "Available" | "Unavailable";
}

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/books", {
        withCredentials: true,
      });
      const data = response.data.data || [];
      setBooks(data);
      setFilteredBooks(data);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to fetch books repository."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFilteredBooks(books);
    } else {
      setFilteredBooks(
        books.filter(
          (b) =>
            b.title.toLowerCase().includes(query) ||
            b.author.toLowerCase().includes(query) ||
            b.isbn.includes(query) ||
            b.category.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, books]);

  const handleDelete = async (bookId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this book permanent records?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/books/${bookId}`, {
        withCredentials: true,
      });
      toast.success("Book records removed successfully.");
      fetchBooks();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete book.");
    }
  };

  const handleEdit = (book: unknown) => {
    console.log(book);
    toast.info("Edit feature module will be initialized next.");
  };

  const totalUniqueBooks = books.length;
  const totalPhysicalCopies = books.reduce((acc, curr) => acc + (curr.totalCopies || 0), 0);
  const availableCopiesCount = books.reduce((acc, curr) => acc + (curr.availableCopies || 0), 0);

  if (loading) {
    return (
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="h-10 bg-slate-200/80 rounded-xl w-1/4 mb-2" />
        <div className="h-4 bg-slate-200/60 rounded-lg w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
          <div className="h-24 bg-slate-200/50 rounded-2xl" />
          <div className="h-24 bg-slate-200/50 rounded-2xl" />
          <div className="h-24 bg-slate-200/50 rounded-2xl" />
        </div>
        <div className="h-64 bg-slate-200/40 rounded-3xl mt-10" />
      </div>
    );
  }

  return (
    // Cleaned container classes let the parent main layout handle vertical scrolling
    <div className="p-6 md:p-10 text-slate-900 selection:bg-indigo-600/15">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Actions Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Book Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Add, audit, modify and monitor your core absolute media inventory metrics.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all duration-200 self-start sm:self-auto cursor-pointer shadow-2xs ${
              showAddForm
                ? "bg-slate-900 text-white hover:bg-slate-800"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/10"
            }`}
          >
            {showAddForm ? (
              <>
                <Layers size={14} strokeWidth={2.5} />
                <span>Hide Workspace Form</span>
              </>
            ) : (
              <>
                <PlusCircle size={14} strokeWidth={2.5} />
                <span>Register New Book</span>
              </>
            )}
          </button>
        </div>

        {/* Dashboard Cards Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-3xs flex items-center gap-4">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100/50">
              <BookOpen size={18} strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Unique Titles</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">{totalUniqueBooks}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-3xs flex items-center gap-4">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100/50">
              <FolderSync size={18} strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">In Circulation</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">{totalPhysicalCopies} Copies</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-3xs flex items-center gap-4">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100/50">
              <Library size={18} strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Available Stock</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">{availableCopiesCount}</p>
            </div>
          </div>
        </div>

        {/* Collapsible Creative Add Form Container */}
        {showAddForm && (
          <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs animate-in fade-in slide-in-from-top-4 duration-200 max-w-4xl mx-auto w-full">
            <div className="mb-5 border-b border-slate-100/80 pb-3">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Creation Workspace</h3>
              <p className="text-xs text-slate-400 mt-0.5">Fill out database fields accurately to build inventory assets.</p>
            </div>
            <BookForm onSuccess={() => {
              fetchBooks();
              setShowAddForm(false);
            }} />
          </div>
        )}

        {/* Repository Records Control Grid */}
        <div className="space-y-5 pt-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black tracking-tight text-slate-900 uppercase tracking-wide">
                Active Inventory Repository
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Manage stock availability parameters and metadata properties.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative group w-full md:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Search repository..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-3xs"
                />
              </div>
              <span className="bg-slate-200/70 px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-600 whitespace-nowrap">
                {filteredBooks.length} records shown
              </span>
            </div>
          </div>

          {filteredBooks.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-slate-200 bg-white rounded-2xl flex flex-col items-center justify-center p-6 shadow-3xs">
              <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center border border-slate-100 mb-3">
                <BookOpen size={16} />
              </div>
              <h3 className="text-xs font-bold text-slate-900">No assets matching parameters</h3>
              <p className="text-xs text-slate-400 max-w-xs mt-1 mx-auto">
                No inventory matches your active filter criteria. Adjust your search parameters query string.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {filteredBooks.map((book) => (
                <div key={book._id} className="transition-all duration-200 hover:-translate-y-0.5">
                  <BookCard
                    book={book}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}