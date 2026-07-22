"use client";

import { useEffect, useState } from "react";
import api from "../../../../lib/api/axios";
import { API } from "../../../../lib/api/endpoints";

interface ActivityLog {
  _id: string;
  fullName: string;
  role: string;
  action: string;
  description: string;
  ipAddress?: string;
  createdAt: string;
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(API.ADMIN.ACTIVITY_LOGS.GET_ALL, {
        withCredentials: true,
      });

      setLogs(response.data.data || []);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to load activity logs."
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper for user avatar initials
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Color badge based on action type
  const renderActionBadge = (action: string) => {
    const act = (action || "").toUpperCase();

    let colorStyles = "bg-slate-100 text-slate-700 border-slate-200";
    let dotColor = "bg-slate-400";

    if (act.includes("CREATE") || act.includes("ADD") || act.includes("POST")) {
      colorStyles = "bg-emerald-50 text-emerald-700 border-emerald-200/80";
      dotColor = "bg-emerald-500";
    } else if (act.includes("DELETE") || act.includes("REMOVE")) {
      colorStyles = "bg-rose-50 text-rose-700 border-rose-200/80";
      dotColor = "bg-rose-500";
    } else if (act.includes("UPDATE") || act.includes("EDIT") || act.includes("PUT")) {
      colorStyles = "bg-amber-50 text-amber-700 border-amber-200/80";
      dotColor = "bg-amber-500";
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-md border ${colorStyles}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
        {action}
      </span>
    );
  };

  // Search & Role Filtering
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      selectedRole === "ALL" ||
      log.role?.toLowerCase() === selectedRole.toLowerCase();

    return matchesSearch && matchesRole;
  });

  const availableRoles = Array.from(new Set(logs.map((l) => l.role).filter(Boolean)));

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 animate-pulse p-4 sm:p-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-slate-200 rounded-lg" />
          <div className="h-9 w-28 bg-slate-200 rounded-xl" />
        </div>
        <div className="h-14 bg-slate-200 rounded-2xl" />
        <div className="h-96 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">
            Activity Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Track user actions, systemic modifications, and access history in real time.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition-all self-start sm:self-auto cursor-pointer"
        >
          <svg
            className="w-4 h-4 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold p-4 rounded-2xl shadow-xs">
          <svg
            className="w-5 h-5 text-rose-600 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
          {error}
        </div>
      )}

      {/* Toolbar: Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs">
        <div className="relative w-full md:w-80">
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Dynamic Role Tabs */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedRole("ALL")}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              selectedRole === "ALL"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200/70 text-slate-600"
            }`}
          >
            All Roles
          </button>
          {availableRoles.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all capitalize whitespace-nowrap cursor-pointer ${
                selectedRole === role
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200/70 text-slate-600"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 bg-slate-50 border border-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5A3.375 3.375 0 0 0 10.125 2.25H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              No activity logs found
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Try modifying your search or changing the role filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Admin</th>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">IP Address</th>
                  <th className="py-3.5 px-4 text-right">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredLogs.map((log) => (
                  <tr
                    key={log._id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    {/* User Profile */}
                    <td className="py-3.5 px-4 min-w-[180px]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200/80 text-slate-700 flex items-center justify-center font-bold text-[11px] shrink-0">
                          {getInitials(log.fullName)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">
                            {log.fullName || "Unknown User"}
                          </p>
                          <span className="inline-block text-[10px] font-semibold text-slate-500 capitalize bg-slate-100 px-1.5 py-0.5 rounded mt-0.5">
                            {log.role || "User"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {renderActionBadge(log.action)}
                    </td>

                    {/* Description */}
                    <td className="py-3.5 px-4 min-w-[260px]">
                      <p className="text-slate-600 leading-relaxed max-w-md">
                        {log.description || "—"}
                      </p>
                    </td>

                    {/* IP Address */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono text-[11px] text-slate-500 bg-slate-50 border border-slate-200/60 px-2 py-1 rounded-md">
                        {log.ipAddress || "N/A"}
                      </span>
                    </td>

                    {/* Timestamp */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="text-[11px]">
                        <p className="font-bold text-slate-800">
                          {new Date(log.createdAt).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </p>
                        <p className="text-slate-400 font-mono text-[10px]">
                          {new Date(log.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}