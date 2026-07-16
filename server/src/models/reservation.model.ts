import { Schema, model, Document, Types } from "mongoose";

export interface IReservation extends Document {
  user: Types.ObjectId;
  book: Types.ObjectId;

  reservedDate: Date;

  status: "Pending" | "Approved" | "Cancelled";

  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema = new Schema<IReservation>(
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

    reservedDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

export default model<IReservation>(
  "Reservation",
  ReservationSchema
);