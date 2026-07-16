"use client";

import { z } from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestPasswordReset } from "../../../lib/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loader2, Mail } from "lucide-react";

export const RequestPasswordResetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type RequestPasswordResetDTO = z.infer<typeof RequestPasswordResetSchema>;

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestPasswordResetDTO>({
    resolver: zodResolver(RequestPasswordResetSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: RequestPasswordResetDTO) => {
    try {
      const response = await requestPasswordReset(data.email);
      if (response.success) toast.success(response.message || "Reset link sent!");
      else toast.error(response.message || "Failed to send reset link.");
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong.");
    }
  };

  return (
    // Changed to full screen white background
    <div className="min-h-screen bg-white px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Card: Subtle border and soft shadow for a clean look */}
        <div className="rounded-2xl border border-emerald-100 bg-white p-8 shadow-xl shadow-emerald-900/5">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Forget password?
            </h1>
            <p className="mt-3 text-sm text-slate-500">
              Enter your email and we’ll send you a reset link.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email address
              </label>

              <div
                className={[
                  "flex items-center gap-2 rounded-xl border px-4 py-3 bg-slate-50 transition-all duration-200",
                  errors.email
                    ? "border-red-300 ring-4 ring-red-50"
                    : "border-slate-200 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-50",
                ].join(" ")}
              >
                <Mail className={`h-5 w-5 ${errors.email ? 'text-red-400' : 'text-slate-400'}`} />
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 outline-none"
                />
              </div>

              {errors.email && (
                <p className="text-red-500 text-sm mt-2 font-medium">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={[
                "w-full rounded-xl py-3.5 font-bold text-white transition-all duration-200",
                "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98]",
                "disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100",
                "shadow-lg shadow-emerald-200",
              ].join(" ")}
            >
              {isSubmitting ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending link...
                </span>
              ) : (
                "Send reset link"
              )}
            </button>

            {/* Footer links */}
            <div className="pt-2 text-center text-sm">
              <div className="flex items-center justify-center gap-2 text-slate-500">
                <span>Remembered?</span>
                <Link href="/login" className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline">
                  Log in
                </Link>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-slate-500">
                <span>New here?</span>
                <Link href="/register" className="text-slate-900 font-bold hover:text-emerald-600 hover:underline">
                  Create account
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <p className="text-xs text-slate-400 text-center italic">
                Check your spam folder if the email doesn't arrive within a few minutes.
              </p>
            </div>
          </form>
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          Secure password recovery powered by your platform.
        </p>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
}