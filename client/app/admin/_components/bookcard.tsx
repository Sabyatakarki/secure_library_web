"use client";

import { Edit2, Trash2, MapPin, Layers } from "lucide-react";

interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publisher: string;
  publishedYear: number;
  language: string;
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string;
  coverImage: string;
  status: "Available" | "Unavailable";
}

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
}

export default function BookCard({ book, onEdit, onDelete }: BookCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 flex gap-4 items-center group max-h-[140px]">
      
      {/* Fixed aspect ratio cover wrap to guarantee image fits perfectly */}
      <div className="w-20 h-28 bg-slate-50 rounded-lg overflow-hidden shrink-0 relative border border-slate-100 flex items-center justify-center p-1 shadow-2xs">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`http://localhost:5050/uploads/book_covers/${book.coverImage}`}
          alt={book.title}
          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Structured Content Column */}
      <div className="flex-1 min-w-0 flex flex-col justify-between h-28">
        
        {/* Title, Author & Status line */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-xs font-black text-slate-800 truncate group-hover:text-indigo-600 transition-colors duration-200 max-w-[150px] sm:max-w-none">
              {book.title}
            </h2>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider border ${
                book.status === "Available"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-rose-50 text-rose-700 border-rose-200"
              }`}
            >
              {book.status === "Available" ? "In" : "Out"}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
            {book.author}
          </p>
        </div>

        {/* Dense Meta Info Strips */}
        <div className="flex items-center gap-2.5 text-[11px] font-bold text-slate-500">
          <div className="flex items-center gap-1 min-w-0">
            <MapPin size={11} className="text-slate-400 shrink-0" />
            <span className="truncate max-w-[80px] text-slate-600">{book.shelfLocation}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Layers size={11} className="text-slate-400" />
            <span className="text-slate-600">{book.availableCopies}/{book.totalCopies}</span>
          </div>
        </div>

        {/* Ultra low-profile tiny context row */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-2">
          <span className="text-[10px] font-mono text-slate-400 truncate max-w-[100px]">
            {book.isbn}
          </span>
          
          {/* Subtle Action Buttons */}
          <div className="flex gap-1.5 shrink-0">
            <button
              onClick={() => onEdit(book)}
              className="p-1.5 border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50 text-slate-400 hover:text-indigo-600 rounded-lg transition duration-200 cursor-pointer"
              title="Edit asset details"
            >
              <Edit2 size={11} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => onDelete(book._id)}
              className="p-1.5 border border-slate-200 hover:border-rose-200 hover:bg-rose-50/50 text-slate-400 hover:text-rose-600 rounded-lg transition duration-200 cursor-pointer"
              title="Remove asset records"
            >
              <Trash2 size={11} strokeWidth={2.5} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}