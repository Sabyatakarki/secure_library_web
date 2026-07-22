import { Schema, model, Document, Types } from "mongoose";

export interface IActivityLog extends Document {
  user?: Types.ObjectId;

  fullName: string;

  role: string;

  action: string;

  description: string;

  ipAddress?: string;

  createdAt: Date;
}

const ActivityLogSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    fullName: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    action: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    ipAddress: String,
  },
  {
    timestamps: true,
  }
);

export default model("ActivityLog", ActivityLogSchema);