"use client";

import { useState } from "react";
import { ShieldCheck, QrCode, KeyRound, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

export default function MfaPage() {
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [token, setToken] = useState("");
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateMfa = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5050/api/mfa/generate",
        {},
        { withCredentials: true }
      );

      setQrCode(response.data.data.qrCode);
      setSecret(response.data.data.secret);
      toast.success("Scan QR code using Google Authenticator");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to generate MFA"
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyMfa = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5050/api/mfa/verify",
        { token },
        { withCredentials: true }
      );

      toast.success(response.data.message || "MFA successfully activated!");
      setMfaEnabled(true);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Invalid OTP code"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 antialiased text-slate-800">
      
      {/* Header View */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
          <ShieldCheck className="w-5 h-5 stroke-[2.25]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Multi-Factor Authentication
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Keep unauthorized parties from entering your administration workspace.
          </p>
        </div>
      </div>

      {/* Main Panel Surface */}
      <div className="w-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-100/50">
        <div className="flex flex-col gap-6">
          
          {/* System Activation Status Control */}
          <div className="flex justify-between items-start gap-4 p-4 bg-slate-50/60 border border-slate-100 rounded-xl">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-900">
                Authenticator App Verification
              </h3>
              <p className="text-xs text-slate-400 leading-normal font-medium max-w-[280px] sm:max-w-md">
                Protect your account using time-based one-time passwords (TOTP) from your preferred mobile security key.
              </p>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider border ${
                mfaEnabled
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-slate-100 text-slate-500 border-slate-200"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${mfaEnabled ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
              {mfaEnabled ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Flow 1: Initialization State */}
          {!qrCode && (
            <button
              onClick={generateMfa}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 text-white disabled:text-slate-400 font-bold text-xs uppercase tracking-wider py-3.5 transition-all shadow-sm shadow-blue-600/10 active:scale-[0.99] disabled:scale-100 group"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              ) : (
                <>
                  <QrCode className="w-4 h-4 transition-transform group-hover:scale-105" />
                  <span>Setup Security Device</span>
                </>
              )}
            </button>
          )}

          {/* Flow 2: QR Scan State */}
          {qrCode && (
            <div className="flex flex-col items-center text-center gap-4 bg-slate-50/30 border border-dashed border-slate-200 rounded-xl p-5 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Step 1: Link Device</p>
                <p className="text-xs text-slate-500 max-w-xs leading-normal">
                  Open your Authenticator app (Google, Microsoft, 1Password) and scan the digital token layout below.
                </p>
              </div>

              <div className="relative group bg-white p-3.5 rounded-xl border border-slate-200/60 shadow-xs">
                <img
                  src={qrCode}
                  alt="MFA QR Code"
                  className="w-44 h-44 select-none"
                />
              </div>

              <div className="flex flex-col items-center gap-1 max-w-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <KeyRound className="w-3 h-3 text-slate-400" /> Manual Secret Configuration
                </span>
                <p className="text-xs font-mono font-bold bg-slate-100/80 text-slate-600 px-3 py-1.5 rounded-lg select-all break-all border border-slate-200/40">
                  {secret}
                </p>
              </div>
            </div>
          )}

          {/* Flow 3: Code Submission Vector */}
          {qrCode && !mfaEnabled && (
            <div className="space-y-3 pt-2 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 pl-0.5">
                  Step 2: Verification Key
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP code"
                  value={token}
                  onChange={(e) => setToken(e.target.value.replace(/\D/g, ""))}
                  className="w-full tracking-wide rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 outline-none transition font-semibold text-center text-slate-800 placeholder:text-slate-400/80 placeholder:font-normal focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5"
                />
              </div>

              <button
                onClick={verifyMfa}
                disabled={loading || token.length !== 6}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 text-white disabled:text-slate-400 font-bold text-xs uppercase tracking-wider py-3.5 transition active:scale-[0.99] disabled:scale-100 cursor-pointer disabled:cursor-not-allowed shadow-xs"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                ) : (
                  <>
                    <span>Verify & Authenticate</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Flow 4: Success Resolution Interface */}
          {mfaEnabled && (
            <div className="flex flex-col items-center justify-center text-center p-6 bg-emerald-50/30 border border-emerald-100 rounded-xl space-y-3 animate-in zoom-in-95 duration-200">
              <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-sm shadow-emerald-500/20">
                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-emerald-950">System Vector Fully Protected</h4>
                <p className="text-xs text-emerald-700/80 font-medium max-w-xs leading-normal">
                  Two-factor encryption is now running on your workspace account routing parameters. Next logins will ask for standard key confirmation.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}