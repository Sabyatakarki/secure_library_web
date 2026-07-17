export default function AdminDashboardPage() {
  const stats = [
    {
      title: "Total Reservations",
      value: "0",
      color: "bg-blue-500",
    },
    {
      title: "Pending Reservations",
      value: "0",
      color: "bg-yellow-500",
    },
    {
      title: "Active Rentals",
      value: "0",
      color: "bg-green-500",
    },
    {
      title: "Total Books",
      value: "0",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-8">

      {/* Page Heading */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Admin Dashboard
        </h1>

        <p className="text-slate-500 mt-2">
          Manage library reservations and rentals.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <div
              className={`w-3 h-3 rounded-full ${stat.color} mb-4`}
            />

            <p className="text-gray-500 text-sm">
              {stat.title}
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Recent Reservations */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">
          Recent Reservation Requests
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b">
              <tr>
                <th className="py-3">Student</th>
                <th>Book</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td
                  colSpan={3}
                  className="text-center py-8 text-gray-500"
                >
                  No reservation requests found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Rentals */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">
          Active Rentals
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b">
              <tr>
                <th className="py-3">Student</th>
                <th>Book</th>
                <th>Due Date</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td
                  colSpan={3}
                  className="text-center py-8 text-gray-500"
                >
                  No active rentals.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}