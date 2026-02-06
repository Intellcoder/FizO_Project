import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function PayrollPage() {
  const { team, refreshTeam } = useAuth(); // ✅ use real team data
  const [selected, setSelected] = useState<any | null>(null);

  // Ensure team is always an array
  const workers = Array.isArray(team) ? team : [];

  // 📊 Stats
  const totalEmployees = workers.length;
  // const totalPayroll = workers.reduce(
  //   (sum, w) => sum + (w.payment?.totalHours || 0),
  //   0,
  // );
  const totalHours = workers.reduce(
    (sum, w) => sum + (w.payment?.totalHours || 0),
    0,
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-5 md:gap-2">
        <h1 className="text-2xl font-bold">Payroll Overview</h1>
        <div className="space-x-2">
          <button
            onClick={refreshTeam}
            className="px-4 py-2 mb-2 md:mb-0 bg-[#4153ef] text-white rounded-lg hover:bg-[#3542c8] transition"
          >
            Refresh
          </button>
          <button className="px-4 py-2 mt-2 md:mt-0 border rounded-lg hover:bg-gray-100">
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-xl p-4 flex flex-col items-start">
          <p className="text-sm text-gray-500">Employees</p>
          <p className="text-2xl font-bold">{totalEmployees}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4 flex flex-col items-start">
          <p className="text-sm text-gray-500">Total Payroll</p>
          <p className="text-2xl font-bold text-[#4153ef]">
            ₦{(totalHours * 3000).toFixed(2).toString()}
          </p>
        </div>
        <div className="bg-white shadow rounded-xl p-4 flex flex-col items-start">
          <p className="text-sm text-gray-500">Total Hours</p>
          <p className="text-2xl font-bold text-green-600">
            {(totalHours / 3600).toFixed(1)} hrs
          </p>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 text-left">
            <tr>
              <th className="px-6 py-3">Worker</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Accounts</th>
              <th className="px-6 py-3">Total Hours</th>
              <th className="px-6 py-3">Total Pay</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((w) => (
              <tr
                key={w.id}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelected(w)}
              >
                <td className="px-6 py-3 font-semibold">{w.name}</td>
                <td className="px-6 py-3 text-gray-600">{w.email}</td>
                <td className="px-6 py-3">
                  {w.accounts?.length
                    ? w.accounts.map((a: any) => a.account_name).join(", ")
                    : "—"}
                </td>
                <td className="px-6 py-3">
                  {w.payment?.totalHours
                    ? `${(w.payment.totalHours / 3600).toFixed(1)} hrs`
                    : "0 hrs"}
                </td>
                <td className="px-6 py-3 font-bold text-[#4153ef]">
                  ₦{(w.payment?.totalPay || 0).toLocaleString()}
                </td>
                <td className="px-6 py-3 text-[#4153ef] underline">View</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slide-Over Worker Details */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 flex justify-end z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setSelected(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Panel */}
            <motion.div
              className="relative w-full max-w-md bg-white shadow-2xl p-6 z-10"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <h2 className="text-lg font-bold mb-4">
                Worker Details — {selected.name}
              </h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong>Email:</strong> {selected.email}
                </li>
                <li>
                  <strong>Role:</strong> {selected.role}
                </li>
                <li>
                  <strong>Total Pay:</strong> ₦
                  {selected.payment?.totalPay?.toLocaleString() || 0}
                </li>
                <li>
                  <strong>Total Hours:</strong>{" "}
                  {selected.payment
                    ? (selected.payment.totalHours / 3600).toFixed(1) + " hrs"
                    : "—"}
                </li>
                <li>
                  <strong>Account Name:</strong>
                  {selected.payment?.account_name}
                </li>
                <li>
                  <strong>Account Number:</strong>
                  {selected.payment?.account_number}
                </li>
                <li>
                  <strong>Bank:</strong> {selected.payment?.bank}
                </li>
                <li>
                  <strong>Accounts:</strong>{" "}
                  {selected.accounts?.length
                    ? selected.accounts
                        .map((a: any) => a.account_name)
                        .join(", ")
                    : "None"}
                </li>
                <li>
                  <strong>Assignments:</strong>{" "}
                  {selected.assignments?.length
                    ? selected.assignments
                        .map((a: any) => a.task_name || a.project_name || "—")
                        .join(", ")
                    : "None"}
                </li>
              </ul>

              <button
                onClick={() => setSelected(null)}
                className="mt-6 w-full bg-[#4153ef] text-white py-2 rounded-lg hover:bg-[#3542c8] transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
