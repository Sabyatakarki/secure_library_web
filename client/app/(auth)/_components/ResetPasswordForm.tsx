"use client";

import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleResetPassword } from "../../../lib/actions/auth-actions";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Lock, ArrowLeft } from "lucide-react";

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordDTO = z.infer<typeof ResetPasswordSchema>;

export default function ResetPasswordForm({ token }: { token: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordDTO>({
    resolver: zodResolver(ResetPasswordSchema),
    mode: "onSubmit",
  });

  const router = useRouter();

  const onSubmit = async (data: ResetPasswordDTO) => {
    try {
      const response = await handleResetPassword(token, data.password);
      if (response.success) {
        toast.success("Password reset successfully");
        router.replace("/login");
      } else {
        toast.error(response.message || "Failed to reset password");
      }
    } catch {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="rounded-3xl border border-slate-100 bg-white p-8 sm:p-10 shadow-2xl shadow-emerald-900/10">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6">
              <Lock className="h-7 w-7 text-emerald-600" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              New Password
            </h1>

            <p className="mt-3 text-sm text-slate-500">
              Please choose a strong password to secure your account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  {...register("password")}
                  className={[
                    "w-full rounded-xl border px-4 py-3 bg-slate-50 text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200",
                    errors.password
                      ? "border-red-300 focus:ring-4 focus:ring-red-50"
                      : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50",
                  ].join(" ")}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-2 font-medium">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  {...register("confirmPassword")}
                  className={[
                    "w-full rounded-xl border px-4 py-3 bg-slate-50 text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200",
                    errors.confirmPassword
                      ? "border-red-300 focus:ring-4 focus:ring-red-50"
                      : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50",
                  ].join(" ")}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-2 font-medium">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={[
                "w-full rounded-xl py-3.5 font-bold text-white transition-all duration-200",
                "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98]",
                "disabled:opacity-70 disabled:cursor-not-allowed",
                "shadow-lg shadow-emerald-200",
              ].join(" ")}
            >
              {isSubmitting ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Updating...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>

            {/* Links */}
            <div className="pt-2 text-center text-sm">
              <div className="flex flex-col gap-4">
                <Link 
                  href="/login" 
                  className="inline-flex items-center justify-center gap-2 text-emerald-600 font-bold hover:text-emerald-700 hover:underline transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </Link>
                <Link
                  href="/request-password-reset"
                  className="text-slate-400 font-medium hover:text-slate-600 hover:underline transition-colors"
                >
                  Request another link
                </Link>
              </div>
            </div>
          </form>
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          Tip: Use at least 8 characters and a mix of symbols.
        </p>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}