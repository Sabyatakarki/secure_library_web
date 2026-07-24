"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import api from "../../lib/api/axios";

interface UserProfile {
  fullName: string;
  role: string;
  mfaEnabled: boolean;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25a2.25 2.25 0 0 1-2.25 2.25h-2.25A2.25 2.25 0 0 1 13.5 8V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
      </svg>
    ),
  },
  {
    label: "Browse Books",
    href: "/dashboard/books",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    label: "My Rentals",
    href: "/dashboard/rentals",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
  },
  {
    label: "Reservations",
    href: "/dashboard/reservations",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
      </svg>
    ),
  },
  {
    label: "Favorites",
    href: "/dashboard/favorites",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.172-.377.72-.377.892 0l2.122 4.36 4.819.702c.415.061.58.566.279.856l-3.487 3.398.823 4.793c.071.413-.362.727-.736.533L12 17.654l-4.316 2.27c-.374.194-.814-.12-.743-.532l.823-4.793L4.278 9.416c-.302-.29-.137-.796.279-.856l4.819-.702 2.122-4.36Z" />
      </svg>
    ),
  },
  {
    label: "Settings",
    href: "/settings",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.767c-.29.223-.443.59-.413.957.002.042.002.085.002.128 0 .042-.002.085-.002.127-.03.367.124.734.413.957l1.003.767a1.125 1.125 0 0 1 .26 1.43l-1.296 2.247a1.125 1.125 0 0 1-1.37.49l-1.216-.456c-.356-.133-.751-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.767c.29-.223.443-.59.412-.957a4.97 4.97 0 0 1-.002-.128c0-.042.002-.085.002-.127.03-.367-.124-.734-.412-.957L4.178 9.2c-.414-.317-.54-.9-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.49l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
  },
];

export default function SettingsPage() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordStatus, setPasswordStatus] = useState({ success: "", error: "" });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // MFA State Expansion
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [showMfaSetup, setShowMfaSetup] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [mfaToken, setMfaToken] = useState("");
  const [mfaLoading, setMfaLoading] = useState(false);
  const [mfaStatus, setMfaStatus] = useState({ success: "", error: "" });

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchUserProfile() {
      try {
        const response = await api.get("/users/profile", {
          signal: controller.signal,
        });

        const data = response.data.data;

        if (isMounted) {
          setUser({
            fullName: data.fullName || "Welcome Student",
            role: data.role || "Student",
            mfaEnabled: !!data.mfaEnabled,
          });

          setMfaEnabled(!!data.mfaEnabled);
        }
      } catch (error: any) {
        if (error.name !== "CanceledError" && isMounted) {
          setUser({
            fullName: "Welcome Student",
            role: "Student",
            mfaEnabled: false,
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchUserProfile();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const getInitials = useCallback((name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }, []);

  // Password Action Handler
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus({ success: "", error: "" });

    if (!passwordData.currentPassword) {
      setPasswordStatus({ success: "", error: "Please enter your current password." });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {

      if (
  passwordData.currentPassword === passwordData.newPassword
) {
  setPasswordStatus({
    success: "",
    error: "New password must be different from your current password.",
  });
  return;
}
      setPasswordStatus({ success: "", error: "New passwords do not match." });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordStatus({ success: "", error: "Password must be at least 8 characters long." });
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const response = await api.put("/users/change-password", {
  currentPassword: passwordData.currentPassword,
  newPassword: passwordData.newPassword,
});

      setPasswordStatus({
        success: response.data.message || "Password successfully updated.",
        error: "",
      });
      
      // Reset input fields
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      setPasswordStatus({
        success: "",
        error: error.response?.data?.message || "Failed to update security credentials.",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // MFA API Actions
  const handleConfigureMfa = async () => {
    setMfaLoading(true);
    setMfaStatus({ success: "", error: "" });

    try {
      const response = await api.post("/mfa/generate");
      setQrCode(response.data.data?.qrCode || response.data?.qrCode);
      setShowMfaSetup(true);
    } catch (error: any) {
      setMfaStatus({
        success: "",
        error: error.response?.data?.message || "Failed to generate MFA setup keys.",
      });
    } finally {
      setMfaLoading(false);
    }
  };

  const handleVerifyMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaToken.length !== 6) {
      setMfaStatus({ success: "", error: "Please enter a valid 6-digit TOTP token." });
      return;
    }

    setMfaLoading(true);
    setMfaStatus({ success: "", error: "" });

    try {
      await api.post("/mfa/verify", { token: mfaToken });
      setMfaEnabled(true);
      setShowMfaSetup(false);
      setQrCode(null);
      setMfaToken("");
      setMfaStatus({
        success: "Two-Factor Shield activated successfully!",
        error: "",
      });
    } catch (error: any) {
      setMfaStatus({
        success: "",
        error: error.response?.data?.message || "Invalid authenticator code. Please try again.",
      });
    } finally {
      setMfaLoading(false);
    }
  };

  const handleDisableMfa = async () => {
    setMfaLoading(true);
    setMfaStatus({ success: "", error: "" });

    try {
      await api.put("/mfa/disable");
      setMfaEnabled(false);
      setShowMfaSetup(false);
      setQrCode(null);
      setMfaToken("");
      setMfaStatus({
        success: "Two-Factor Shield deactivated.",
        error: "",
      });
    } catch (error: any) {
      setMfaStatus({
        success: "",
        error: error.response?.data?.message || "Failed to disable MFA. Please try again.",
      });
    } finally {
      setMfaLoading(false);
    }
  };

  const NavigationMenu = ({ onItemClick }: { onItemClick?: () => void }) => (
    <nav className="flex flex-col gap-1" aria-label="Main Navigation">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-150 group ${
              isActive
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
            }`}
          >
            <span
              className={`transition-transform group-hover:scale-105 ${
                isActive
                  ? "opacity-100 text-white"
                  : "opacity-70 text-slate-400 group-hover:opacity-100 group-hover:text-slate-100"
              }`}
            >
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );






  return (
    <div className="flex h-screen w-screen max-h-screen max-w-full overflow-hidden bg-slate-50 font-sans antialiased text-slate-800 relative">
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900 p-6 hidden md:flex flex-col justify-between shrink-0 h-full overflow-y-auto shadow-xl">
        <div>
          <div className="flex items-center gap-2.5 mb-8 px-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center font-black tracking-tighter text-base text-white shadow-md shadow-blue-500/20">
              L
            </div>
            <span className="font-extrabold text-xs uppercase tracking-widest text-slate-100">
              Secure Library
            </span>
          </div>
          <NavigationMenu />
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <aside className="relative w-64 max-w-xs bg-slate-900 p-6 flex flex-col justify-between h-full overflow-y-auto shadow-2xl z-10">
            <div>
              <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center font-black tracking-tighter text-base text-white">
                    L
                  </div>
                  <span className="font-extrabold text-xs uppercase tracking-widest text-slate-100">
                    Secure Library
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                  aria-label="Close navigation menu"
                >
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <NavigationMenu onItemClick={() => setIsMobileMenuOpen(false)} />
            </div>
          </aside>
        </div>
      )}

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 sm:px-8 shrink-0 z-10 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 active:scale-95 transition-all md:hidden"
              aria-label="Open navigation menu"
            >
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <h1 className="text-base font-bold text-slate-900 tracking-tight sm:text-lg">
              Security Settings
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-3 px-3 py-1.5 rounded-2xl bg-blue-50/40 border border-blue-200/60 transition-all duration-200 hover:bg-blue-100 cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center gap-3 animate-pulse">
                  <div className="w-7 h-7 rounded-full bg-slate-200" />
                  <div className="hidden sm:flex flex-col gap-1">
                    <div className="h-3 w-24 bg-slate-200 rounded" />
                    <div className="h-2 w-16 bg-slate-200 rounded" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black text-white uppercase">
                    {getInitials(user?.fullName || "ST")}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800 leading-tight">
                      {user?.fullName}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none mt-0.5">
                      {user?.role}
                    </span>
                  </div>
                </>
              )}
            </Link>
          </div>
        </header>

        {/* Scrollable Content Body */}
        <main className="p-6 sm:p-8 flex-1 overflow-y-auto min-h-0">
          <div className="max-w-3xl mx-auto space-y-6">

            {/* Password Update Module */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Update Authentication Password</h2>
                <p className="text-xs text-slate-500 mt-0.5">Change your system password regularly to maintain account integrity.</p>
              </div>

              {passwordStatus.success && (
                <div className="mb-4 p-3.5 bg-emerald-50 text-emerald-900 border border-emerald-100 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  {passwordStatus.success}
                </div>
              )}

              {passwordStatus.error && (
                <div className="mb-4 p-3.5 bg-rose-50 text-rose-900 border border-rose-100 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                  {passwordStatus.error}
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="grid sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-12 flex flex-col gap-1.5">
                    <label htmlFor="currentPassword" className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-0.5">
                      Current Password
                    </label>
                    <input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      required
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white px-3.5 py-2 rounded-xl text-sm outline-none transition"
                    />
                  </div>

                  <div className="sm:col-span-6 flex flex-col gap-1.5">
                    <label htmlFor="newPassword" className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-0.5">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      required
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white px-3.5 py-2 rounded-xl text-sm outline-none transition"
                    />
                  </div>

                  <div className="sm:col-span-6 flex flex-col gap-1.5">
                    <label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-0.5">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      required
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white px-3.5 py-2 rounded-xl text-sm outline-none transition"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-950 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-xs active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed"
                  >
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                    {isUpdatingPassword ? "Updating Credentials..." : "Commit Password Change"}
                  </button>
                </div>
              </form>
            </div>

            {/* MFA Security Shield Module */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">Two-Factor Security Shield</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Add an extra verification layer to safeguard your session.</p>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                    mfaEnabled
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {mfaEnabled ? "Protected" : "Inactive"}
                </span>
              </div>

              {mfaStatus.success && (
                <div className="mt-4 p-3.5 bg-emerald-50 text-emerald-900 border border-emerald-100 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  {mfaStatus.success}
                </div>
              )}

              {mfaStatus.error && (
                <div className="mt-4 p-3.5 bg-rose-50 text-rose-900 border border-rose-100 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                  {mfaStatus.error}
                </div>
              )}

              <div className="mt-5 p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                      mfaEnabled ? "bg-emerald-500 text-white shadow-xs" : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Authenticator App Authentication</h3>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium leading-normal">
                      Generate verification codes using authenticator apps like Google Authenticator or Microsoft Authenticator.
                    </p>
                  </div>
                </div>

                <button
                  onClick={mfaEnabled ? handleDisableMfa : handleConfigureMfa}
                  disabled={mfaLoading}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition active:scale-[0.98] whitespace-nowrap border shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    mfaEnabled
                      ? "bg-white border-rose-200 hover:bg-rose-50 text-rose-600"
                      : "bg-blue-600 hover:bg-blue-700 text-white border-transparent shadow-xs"
                  }`}
                >
                  {mfaLoading ? "Processing..." : mfaEnabled ? "Deactivate" : "Configure MFA"}
                </button>
              </div>

              {!mfaEnabled && showMfaSetup && qrCode && (
                <div className="mt-5 p-5 bg-white border border-blue-100 rounded-xl space-y-5 shadow-xs">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="p-3 bg-white border border-slate-200 rounded-2xl shrink-0 shadow-xs">
                      <img src={qrCode} alt="MFA QR Code" className="w-36 h-36 object-contain rounded-lg" />
                    </div>

                    <div className="space-y-2 text-center sm:text-left">
                      <h4 className="text-sm font-bold text-slate-900">Scan QR Code</h4>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                        Open your authenticator app (Google Authenticator, Authy, etc.), scan the QR code on the left, and enter the generated 6-digit verification code below.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleVerifyMfa} className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
                    <div className="w-full sm:w-48">
                      <input
                        type="text"
                        maxLength={6}
                        value={mfaToken}
                        onChange={(e) => setMfaToken(e.target.value.replace(/\D/g, ""))}
                        placeholder="6-digit code"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white px-3.5 py-2 rounded-xl text-center text-sm font-mono tracking-widest outline-none transition"
                        required
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="submit"
                        disabled={mfaLoading || mfaToken.length !== 6}
                        className="flex-1 sm:flex-initial px-4 py-2 bg-slate-950 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer disabled:cursor-not-allowed"
                      >
                        {mfaLoading ? "Verifying..." : "Verify & Enable"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowMfaSetup(false);
                          setQrCode(null);
                          setMfaToken("");
                          setMfaStatus({ success: "", error: "" });
                        }}
                        className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 uppercase tracking-wider rounded-xl transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}