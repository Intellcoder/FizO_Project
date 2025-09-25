import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Types
type Report = {
  id: number;
  name: string;
  role: string;
  department: string;
  date: string;
  hours: number;
  summary: string;
  status: "Submitted" | "Missing";
};

// Sample Reports
const reports: Report[] = [
  {
    id: 1,
    name: "Jane Doe",
    role: "Software Engineer",
    department: "Engineering",
    date: "2025-09-22",
    hours: 7.5,
    summary: "Worked on feature X, fixed bugs in module Y, attended standup.",
    status: "Submitted",
  },
  {
    id: 2,
    name: "John Smith",
    role: "Designer",
    department: "Design",
    date: "2025-09-22",
    hours: 0,
    summary: "",
    status: "Missing",
  },
  {
    id: 3,
    name: "Alice Brown",
    role: "QA Engineer",
    department: "Quality Assurance",
    date: "2025-09-22",
    hours: 8,
    summary: "Tested module Z, logged bugs, reviewed fixes.",
    status: "Submitted",
  },
  {
    id: 4,
    name: "Mike Johnson",
    role: "Product Manager",
    department: "Product",
    date: "2025-09-22",
    hours: 6,
    summary: "Planned sprint backlog, met with stakeholders.",
    status: "Submitted",
  },
];

export default function ReportPage() {
  const [selected, setSelected] = useState<Report | null>(null);

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-2xl font-bold">Reports</h1>
        <button className="px-4 py-2 bg-[#4153ef] text-white rounded-lg hover:bg-[#3542c8] transition">
          Export CSV
        </button>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="overflow-x-auto bg-white rounded-xl shadow"
      >
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 text-left">
            <tr>
              <th className="px-6 py-3">Employee</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Work Hours</th>
              <th className="px-6 py-3">Summary</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r, index) => (
              <motion.tr
                key={r.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelected(r)}
              >
                <td className="px-6 py-3">
                  <div>
                    <p className="font-semibold">{r.name}</p>
                    <p className="text-xs text-gray-500">{r.role}</p>
                  </div>
                </td>
                <td className="px-6 py-3">{r.department}</td>
                <td className="px-6 py-3">{r.date}</td>
                <td
                  className={`px-6 py-3 font-bold ${
                    r.hours >= 8
                      ? "text-green-600"
                      : r.hours > 0
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {r.hours > 0 ? `${r.hours} hrs` : "-"}
                </td>
                <td className="px-6 py-3 max-w-xs truncate">{r.summary}</td>
                <td className="px-6 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      r.status === "Submitted"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-[#4153ef] underline">View</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-md"
            >
              <h2 className="text-lg font-bold mb-4">
                Report - {selected.name}
              </h2>
              <p className="text-sm text-gray-500 mb-2">
                {selected.date} • {selected.department}
              </p>
              <p className="font-bold text-[#4153ef] mb-4">
                Work Hours: {selected.hours} hrs
              </p>
              <p className="text-gray-700">
                {selected.summary || "No report submitted."}
              </p>
              <button
                onClick={() => setSelected(null)}
                className="mt-6 w-full bg-[#4153ef] text-white py-2 rounded-lg hover:bg-[#3542c8]"
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
