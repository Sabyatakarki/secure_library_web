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

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        API.ADMIN.ACTIVITY_LOGS.GET_ALL,
        {
          withCredentials: true,
        }
      );

      setLogs(response.data.data || []);
    } catch (error: any) {
      console.error(error);
      setError(
        error.response?.data?.message ||
          "Failed to load activity logs."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold">
          Loading Activity Logs...
        </h2>
      </div>
    );
  }

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Activity Logs
        </h1>

        <button
          onClick={fetchLogs}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Refresh
        </button>
      </div>

      {error && (
        <p className="text-red-600 mb-4">
          {error}
        </p>
      )}

      {logs.length === 0 ? (
        <p>No activity logs found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">

            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Admin</th>
                <th className="border p-2">Role</th>
                <th className="border p-2">Action</th>
                <th className="border p-2">Description</th>
                <th className="border p-2">IP Address</th>
                <th className="border p-2">Date & Time</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50">

                  <td className="border p-2">
                    {log.fullName}
                  </td>

                  <td className="border p-2">
                    {log.role}
                  </td>

                  <td className="border p-2">
                    {log.action}
                  </td>

                  <td className="border p-2">
                    {log.description}
                  </td>

                  <td className="border p-2">
                    {log.ipAddress || "N/A"}
                  </td>

                  <td className="border p-2">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}