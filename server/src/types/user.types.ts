import { z } from "zod";

export const UserSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),

  email: z.string().email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),

  studentId: z.string().min(1, "Student ID is required"),

  phoneNumber: z.string().min(10, "Invalid phone number"),

  department: z.string().min(1, "Department is required"),

  semester: z.number().min(1).max(8),

  address: z.string().optional(),

  profilePicture: z.string().optional(),

  role: z.enum(["Student", "Librarian"]).default("Student"),

  isVerified: z.boolean().default(false),

  isActive: z.boolean().default(true),
});

export type UserType = z.infer<typeof UserSchema>;