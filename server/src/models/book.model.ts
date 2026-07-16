import { Schema, model, Document } from "mongoose";

export interface IBook extends Document {
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

  coverImage?: string;

  status: "Available" | "Unavailable";

  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    isbn: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    publisher: {
      type: String,
      required: true,
      trim: true,
    },

    publishedYear: {
      type: Number,
      required: true,
    },

    language: {
      type: String,
      required: true,
      default: "English",
    },

    totalCopies: {
      type: Number,
      required: true,
      min: 1,
    },

    availableCopies: {
      type: Number,
      required: true,
      min: 0,
    },

    shelfLocation: {
      type: String,
      required: true,
    },

    coverImage: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Available", "Unavailable"],
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

export default model<IBook>("Book", BookSchema);