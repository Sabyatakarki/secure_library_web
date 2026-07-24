import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;

  studentId: string;
  phoneNumber: string;

  department: string;
  semester: number;
  address?: string;

  profilePicture?: string;

  role: "Student" | "Admin";

  isVerified: boolean;
  isActive: boolean;

  lastLogin?: Date;
  failedLoginAttempts: number;
  accountLocked: boolean;
  lockUntil?: Date | null;

  // Password Expiration field
  passwordUpdatedAt: Date;

  // MFA fields
  mfaEnabled: boolean;
  mfaSecret?: string | null;

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
      minlength: 8,
    },

    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },

    address: {
      type: String,
      default: "",
    },

    profilePicture: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["Student", "Admin"],
      default: "Student",
    },

    isVerified: {
      type: Boolean,
      default: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
    },

    failedLoginAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: {
      type: Date,
      default: null,
    },

    accountLocked: {
      type: Boolean,
      default: false,
    },

    // Password Expiration field
    passwordUpdatedAt: {
      type: Date,
      default: Date.now,
    },

    mfaEnabled: {
      type: Boolean,
      default: false,
    },

    mfaSecret: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IUser>("User", UserSchema);