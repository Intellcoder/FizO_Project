import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReportForm from "../pages/ReportForm";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";
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
    id: number;
    account_name: string;
    locale: string;
  };
};

export default function AdminReport() {
  const {
    reports,
    excelDownload,
    user,
    refreshReports,
    deleteReport,
    loadingReports,
  } = useAuth();
  const [selected, setSelected] = useState<Report | null>(null);
  const [isFormOpen, setIsFormOpened] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // ✅ Delete report
  const handleDelete = async () => {
    if (!selected) return;
    try {
      console.log("Deleting..");
      deleteReport(selected.id);
      setIsDeleteOpen(false);
      setSelected(null);
      refreshReports();
    } catch (err) {
      toast.error("Failed to delete report.");
    }
  };

  // ✅ Edit report
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    try {
      await api.put(`/reports/${selected.id}`, {
        name: selected.account.account_name,
        workhour: selected.workHours,
        date: selected.updatedAt,
      });
      toast.success("Report updated!");
      setIsEditOpen(false);
      setSelected(null);
      refreshReports();
    } catch (err) {
      toast.error("Failed to update report.");
    }
  };

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
    <div className="p-6 space-y-8">
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
            className="px-4 py-2 bg-[#4153ef] text-white cursor-pointer rounded-lg hover:bg-[#3542c8]"
          >
            + Add New Report
          </button>
          {reports.length > 0 && (
            <button
              onClick={excelDownload}
              className="px-4 py-2 border cursor-pointer rounded-lg hover:bg-gray-50"
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
          className="bg-white rounded-xl shadow p-12 text-center"
        >
          <div className="flex flex-col items-center gap-4">
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
            <h2 className="text-2xl font-semibold text-gray-700">
              No Reports Yet
            </h2>
            <p className="text-gray-500 max-w-md">
              Get started by adding your first report. Click the "Add New
              Report" button above to create one.
            </p>
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
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-3 font-semibold">
                    {r.account.account_name}
                  </td>
                  <td className="px-6 py-3">{r.account.locale}</td>
                  <td className="px-6 py-3">
                    {r.updatedAt.toString().substring(0, 10)}
                  </td>
                  <td className="px-6 py-3 font-bold">
                    {formatWorkHours(r.workHours)}
                  </td>
                  <td className="px-6 py-3">{r.account?.account_name}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        r.submitter
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {r.submitter ? "True" : "False"}
                    </span>
                  </td>
                  <td className="px-6 py-3 flex gap-2">
                    <button
                      onClick={() => {
                        setSelected(r);
                        setIsOpen(true);
                      }}
                      className="text-blue-600 underline"
                    >
                      View
                    </button>

                    {user?.role === "admin" && (
                      <>
                        <button
                          onClick={() => {
                            setSelected(r);
                            setIsEditOpen(true);
                          }}
                          className="text-green-600 underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelected(r);
                            setIsDeleteOpen(true);
                          }}
                          className="text-red-600 underline"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* 🔹 Edit Modal */}
      <AnimatePresence>
        {isEditOpen && selected && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.form
              onSubmit={handleEdit}
              className="bg-white p-6 rounded-xl w-full max-w-md"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h2 className="text-lg font-bold mb-4">Edit Report</h2>
              <input
                type="text"
                value={selected.account?.account_name || ""}
                onChange={(e) =>
                  setSelected({
                    ...selected,
                    account: {
                      ...selected.account,
                      account_name: e.target.value,
                    },
                  })
                }
                className="w-full border rounded px-3 py-2 mb-3"
              />

              <input
                type="number"
                value={selected.todaysHour}
                onChange={(e) =>
                  setSelected({ ...selected, todaysHour: e.target.value })
                }
                className="w-full border rounded px-3 py-2 mb-3"
              />
              <input
                type="date"
                value={selected.updatedAt.toString().substring(0, 10)}
                onChange={(e) =>
                  setSelected({
                    ...selected,
                    updatedAt: new Date(e.target.value),
                  })
                }
                className="w-full border rounded px-3 py-2 mb-3"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 Delete Confirmation */}
      <AnimatePresence>
        {isDeleteOpen && selected && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl w-full max-w-sm text-center"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h2 className="text-lg font-bold mb-4">Delete this report?</h2>
              <p className="mb-6 text-gray-600">
                This action cannot be undone.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setIsDeleteOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 View Modal */}
      <AnimatePresence>
        {isOpen && selected && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl w-full max-w-lg"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h2 className="text-xl font-bold mb-4">Report Details</h2>
              <p>
                <strong>Employee:</strong> {selected.account.account_name}
              </p>
              <p>
                <strong>Locale:</strong> {selected.account.locale}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {selected.updatedAt.toString().substring(0, 10)}
              </p>
              <p>
                <strong>Work Hours:</strong> {selected.todaysHour}
              </p>
              <p>
                <strong>Worked By:</strong> {selected.submitter?.name}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {selected.submitter ? "Outsourced" : "In-house"}
              </p>

              {/* Image preview */}
              {selected.imageUrl && (
                <img
                  src={selected.imageUrl}
                  alt="Report"
                  className="mt-4 rounded-lg border"
                />
              )}

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 Add Report Form */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl w-full max-w-xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="flex justify-end">
                <button
                  onClick={() => setIsFormOpened(false)}
                  className="text-red-500 mb-3 text-xl"
                >
                  close
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
