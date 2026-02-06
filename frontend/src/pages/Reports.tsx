import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReportForm from "./ReportForm";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

// Types
type Report = {
  id: number;
  imageUrl: string;
  todaysHour: string;
  workHours: number;
  updatedAt: Date;
  submitter: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  account: {
    id: 1;
    account_name: string;
    locale: string;
  };
};

export default function ReportPage() {
  const { reports, workerExcel, loadingReports } = useAuth();
  const [selected, setSelected] = useState<Report | null>(null);
  const [isFormOpen, setIsFormOpened] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  const formatWorkHours = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  if (loadingReports) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col gap-6 items-center justify-center">
          <Loader type="dots" color="#ef4444" size={100} speed={0.6} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-center justify-between"
      >
        <h1 className="text-2xl font-bold mb-5 md:mb-0">Reports</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setIsFormOpened(!isFormOpen)}
            className="px-4 py-2 bg-[#4153ef] text-white cursor-pointer rounded-lg hover:bg-[#3542c8] transition"
          >
            + Add New Report
          </button>
          {reports.length > 0 && (
            <button
              onClick={workerExcel}
              className="px-4 py-2 border cursor-pointer rounded-lg hover:bg-gray-50 transition"
            >
              Export CSV
            </button>
          )}
        </div>
      </motion.div>

      {/* Conditional Rendering: No Reports or Table */}
      {reports.length === 0 ? (
        // 🔹 No Reports Fallback UI
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow p-16 text-center"
        >
          <div className="flex flex-col items-center gap-4">
            {/* Icon */}
            <svg
              className="w-24 h-24 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>

            {/* Text Content */}
            <h2 className="text-2xl font-semibold text-gray-700">
              No Reports Yet
            </h2>
            <p className="text-gray-500 max-w-md">
              You haven't created any reports yet. Get started by adding your
              first report to track work hours and activities.
            </p>

            {/* CTA Button */}
            <button
              onClick={() => setIsFormOpened(true)}
              className="mt-4 px-6 py-3 bg-[#4153ef] text-white rounded-lg hover:bg-[#3542c8] transition-colors"
            >
              Create Your First Report
            </button>
          </div>
        </motion.div>
      ) : (
        // 🔹 Reports Table
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
                <th className="px-6 py-3">Locale</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Work Hours</th>
                <th className="px-6 py-3">Worked By</th>
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
                      <p className="font-semibold">{r.account.account_name}</p>
                      <p className="text-xs text-gray-500">
                        {r.account.locale}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-3">{r.account.locale}</td>
                  <td className="px-6 py-3">
                    {r.updatedAt.toString().substring(0, 10)}
                  </td>
                  <td className="px-6 py-3 font-bold">
                    {formatWorkHours(r.workHours)}
                  </td>
                  <td className="px-6 py-3 max-w-xs truncate">
                    {r.account.account_name}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        r.submitter
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {r.submitter ? "Submitted" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-[#4153ef] underline">View</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* 🔹 View Report Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isImageZoomed && setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-md relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold mb-4">
                Report - {selected.account.account_name}
              </h2>

              {/* Image with zoom functionality */}
              <div
                onClick={() => setIsImageZoomed(!isImageZoomed)}
                className="cursor-pointer mb-4"
              >
                <img
                  src={selected.imageUrl}
                  alt="Report screenshot"
                  className={`w-full rounded-lg border ${
                    isImageZoomed ? "hidden" : "block"
                  }`}
                />
              </div>

              {/* Zoomed Image Overlay */}
              <AnimatePresence>
                {isImageZoomed && (
                  <motion.div
                    className="fixed inset-0 flex items-center justify-center bg-black/80 z-[60]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsImageZoomed(false)}
                  >
                    <motion.img
                      src={selected.imageUrl}
                      alt="Report screenshot zoomed"
                      className="max-w-[90%] max-h-[90%] rounded-lg shadow-2xl"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.8 }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="text-sm text-gray-500 mb-2">
                {selected.updatedAt.toString().substring(0, 10)} •{" "}
                {selected.account.locale}
              </p>
              <p className="font-bold text-[#4153ef] mb-4">
                Work Hours: {selected.workHours}h
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Account Worked By:</span>{" "}
                {selected.account.account_name || "No account specified"}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Submitter:</span>{" "}
                {selected.submitter?.name || "N/A"}
              </p>

              <button
                onClick={() => {
                  setSelected(null);
                  setIsImageZoomed(false);
                }}
                className="mt-6 w-full bg-[#4153ef] text-white py-2 rounded-lg hover:bg-[#3542c8] transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 Add Report Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
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
              className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-xl"
            >
              <div className="flex justify-end">
                <button
                  onClick={() => setIsFormOpened(false)}
                  className="text-red-500 hover:text-red-700 mb-3 text-xl transition"
                >
                  ✕
                </button>
              </div>

              <ReportForm />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
