"use client";

import { useState } from "react";
import axios from "../../../lib/api/axios";
import { toast } from "react-toastify";
import { ImagePlus, Loader2, Sparkles, X } from "lucide-react";

interface BookFormProps {
  onSuccess: () => void;
}

export default function BookForm({ onSuccess }: BookFormProps) {
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    description: "",
    publisher: "",
    publishedYear: "",
    language: "English",
    totalCopies: "",
    availableCopies: "",
    shelfLocation: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setBook({
      ...book,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formData = new FormData();

      Object.entries(book).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (image) {
        formData.append("coverImage", image);
      }

      await axios.post("/books", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      toast.success("Book added successfully.");

      setBook({
        title: "",
        author: "",
        isbn: "",
        category: "",
        description: "",
        publisher: "",
        publishedYear: "",
        language: "English",
        totalCopies: "",
        availableCopies: "",
        shelfLocation: "",
      });
      removeImage();
      onSuccess();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to add book data records."
      );
    } finally {
      setLoading(false);
    }
  };

  // Shared dynamic class styles for inputs
  const inputStyles = "w-full border border-slate-200 bg-slate-50/30 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all duration-200 font-medium";
  const labelStyles = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Cover Asset Manager */}
        <div className="md:col-span-1">
          <span className={labelStyles}>Media Cover Asset</span>
          
          {!imagePreview ? (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-indigo-500/60 bg-slate-50/50 hover:bg-indigo-50/10 rounded-2xl p-6 cursor-pointer text-center group h-[325px] transition-all duration-300">
              <div className="p-3 bg-white shadow-xs rounded-xl text-slate-400 group-hover:text-indigo-600 group-hover:scale-110 transition-transform duration-300 border border-slate-100">
                <ImagePlus size={20} strokeWidth={2.2} />
              </div>
              <p className="mt-3 text-xs font-bold text-slate-700">Upload high-res art</p>
              <p className="text-[11px] text-slate-400 max-w-[160px] mt-1">
                Drag drop or click to browse JPG, PNG format artwork
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs h-[325px] group bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Upload Preview"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <button
                  type="button"
                  onClick={removeImage}
                  className="bg-white/90 hover:bg-white text-slate-900 p-2.5 rounded-xl shadow-md transition-transform duration-200 hover:scale-110 flex items-center gap-1.5 text-xs font-bold"
                >
                  <X size={14} strokeWidth={2.5} />
                  Change File
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Columns: Descriptive Data Fields Grid */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
          
          <div className="sm:col-span-2">
            <label className={labelStyles}>Book Title</label>
            <input
              name="title"
              placeholder="e.g., The Design of Everyday Things"
              value={book.title}
              onChange={handleChange}
              className={inputStyles}
              required
            />
          </div>

          <div>
            <label className={labelStyles}>Author / Creator</label>
            <input
              name="author"
              placeholder="e.g., Don Norman"
              value={book.author}
              onChange={handleChange}
              className={inputStyles}
              required
            />
          </div>

          <div>
            <label className={labelStyles}>ISBN Registry Code</label>
            <input
              name="isbn"
              placeholder="e.g., 978-0465050659"
              value={book.isbn}
              onChange={handleChange}
              className={inputStyles}
              required
            />
          </div>

          <div>
            <label className={labelStyles}>Classification Category</label>
            <input
              name="category"
              placeholder="e.g., Design, Technology"
              value={book.category}
              onChange={handleChange}
              className={inputStyles}
              required
            />
          </div>

          <div>
            <label className={labelStyles}>Publisher Agency</label>
            <input
              name="publisher"
              placeholder="e.g., Basic Books"
              value={book.publisher}
              onChange={handleChange}
              className={inputStyles}
              required
            />
          </div>

          <div>
            <label className={labelStyles}>Release Year</label>
            <input
              type="number"
              name="publishedYear"
              placeholder="e.g., 2013"
              value={book.publishedYear}
              onChange={handleChange}
              className={inputStyles}
              required
            />
          </div>

          <div>
            <label className={labelStyles}>Primary Language</label>
            <input
              name="language"
              placeholder="English"
              value={book.language}
              onChange={handleChange}
              className={inputStyles}
            />
          </div>

        </div>
      </div>

      {/* Row Split: Expanded Description and Stock Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <label className={labelStyles}>Abstract Description</label>
          <textarea
            name="description"
            placeholder="Provide a comprehensive narrative summary or chapter guide synopsis..."
            value={book.description}
            onChange={handleChange}
            className={`${inputStyles} resize-none`}
            rows={4}
            required
          />
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyles}>Total Copies</label>
              <input
                type="number"
                name="totalCopies"
                placeholder="0"
                value={book.totalCopies}
                onChange={handleChange}
                className={inputStyles}
                required
              />
            </div>
            <div>
              <label className={labelStyles}>Available Copies</label>
              <input
                type="number"
                name="availableCopies"
                placeholder="0"
                value={book.availableCopies}
                onChange={handleChange}
                className={inputStyles}
                required
              />
            </div>
          </div>

          <div>
            <label className={labelStyles}>Shelf Grid Location</label>
            <input
              name="shelfLocation"
              placeholder="e.g., Floor 2, Aisle B-4"
              value={book.shelfLocation}
              onChange={handleChange}
              className={inputStyles}
              required
            />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end pt-4 border-t border-slate-100">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md shadow-indigo-600/10 cursor-pointer disabled:cursor-not-allowed select-none min-w-[150px]"
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Registering...</span>
            </>
          ) : (
            <>
              <Sparkles size={14} />
              <span>Commit Asset</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}