import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;

  studentId?: string;
  phoneNumber: string;

  department?: string;
  semester?: number;
  address?: string;

  profilePicture?: string;

  role: "Student" | "Librarian";

  isVerified: boolean;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    studentId: {
      type: String,
      unique: true,
      sparse: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    department: {
      type: String,
    },

    semester: {
      type: Number,
    },

    address: {
      type: String,
    },

    profilePicture: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["Student", "Librarian"],
      default: "Student",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IUser>("User", UserSchema);