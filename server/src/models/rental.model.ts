import { Schema, model, Document, Types } from "mongoose";

export interface IRental extends Document {
  user: Types.ObjectId;
  book: Types.ObjectId;
  reservation: Types.ObjectId;

  rentalDate: Date;
  dueDate: Date;
  returnDate?: Date;

  status: "Borrowed" | "Returned" | "Overdue";

  createdAt: Date;
  updatedAt: Date;
}

const RentalSchema = new Schema<IRental>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    reservation: {
      type: Schema.Types.ObjectId,
      ref: "Reservation",
      required: true,
      unique: true,
    },

    rentalDate: {
      type: Date,
      default: Date.now,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    returnDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["Borrowed", "Returned", "Overdue"],
      default: "Borrowed",
    },
  },
  {
    timestamps: true,
  }
);

export default model<IRental>("Rental", RentalSchema);