import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Payroll = {
  id: number;
  name: string;
  role: string;
  department: string;
  period: string;
  salary: number;
  allowances: number;
  deductions: number;
  net: number;
  status: "Paid" | "Pending" | "Failed";
};

const payrollData: Payroll[] = [
  {
    id: 1,
    name: "Jane Doe",
    role: "Software Engineer",
    department: "Engineering",
    period: "Sept 2025",
    salary: 3000,
    allowances: 500,
    deductions: 200,
    net: 3300,
    status: "Paid",
  },
  {
    id: 2,
    name: "John Smith",
    role: "Designer",
    department: "Design",
    period: "Sept 2025",
    salary: 2500,
    allowances: 400,
    deductions: 150,
    net: 2750,
    status: "Pending",
  },
];

export default function PayrollPage() {
  const [selected, setSelected] = useState<Payroll | null>(null);

  // 📊 Stats
  const totalEmployees = payrollData.length;
  const totalPayroll = payrollData.reduce((sum, p) => sum + p.net, 0);
  const pendingCount = payrollData.filter((p) => p.status === "Pending").length;
  const paidCount = payrollData.filter((p) => p.status === "Paid").length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-5 md:gap-2">
        <h1 className="text-2xl font-bold">Payroll</h1>
        <div className="space-x-2 ">
          <button className="px-4 py-2 mb-2 md:mb-0 bg-[#4153ef] text-white rounded-lg hover:bg-[#3542c8] transition">
            Add Payroll
          </button>
          <button className="px-4 py-2 mt-2 md:mt-0 border rounded-lg hover:bg-gray-100">
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-xl p-4 flex flex-col items-start">
          <p className="text-sm text-gray-500">Employees</p>
          <p className="text-2xl font-bold">{totalEmployees}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4 flex flex-col items-start">
          <p className="text-sm text-gray-500">Total Payroll</p>
          <p className="text-2xl font-bold">${totalPayroll}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4 flex flex-col items-start">
          <p className="text-sm text-gray-500">Paid</p>
          <p className="text-2xl font-bold text-green-600">{paidCount}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4 flex flex-col items-start">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 text-left">
            <tr>
              <th className="px-6 py-3">Employee</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Period</th>
              <th className="px-6 py-3">Net Pay</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payrollData.map((row) => (
              <tr
                key={row.id}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelected(row)}
              >
                <td className="px-6 py-3">
                  <div>
                    <p className="font-semibold">{row.name}</p>
                    <p className="text-gray-500 text-xs">{row.role}</p>
                  </div>
                </td>
                <td className="px-6 py-3">{row.department}</td>
                <td className="px-6 py-3">{row.period}</td>
                <td className="px-6 py-3 font-bold">${row.net}</td>
                <td className="px-6 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      row.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : row.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-[#4153ef] underline">View</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slide-Over Modal */}
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
                Payroll Details - {selected.name}
              </h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="font-medium">Role:</span> {selected.role}
                </li>
                <li>
                  <span className="font-medium">Department:</span>{" "}
                  {selected.department}
                </li>
                <li>
                  <span className="font-medium">Period:</span> {selected.period}
                </li>
                <li>
                  <span className="font-medium">Salary:</span> $
                  {selected.salary}
                </li>
                <li>
                  <span className="font-medium">Allowances:</span> $
                  {selected.allowances}
                </li>
                <li>
                  <span className="font-medium">Deductions:</span> $
                  {selected.deductions}
                </li>
                <li className="font-bold text-[#4153ef]">
                  Net Pay: ${selected.net}
                </li>
                <li>
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      selected.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : selected.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selected.status}
                  </span>
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
