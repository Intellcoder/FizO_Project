import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReportForm from "../pages/ReportForm";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";

// Types
type Report = {
  id: string;
  _id: string;
  date: Date;
  imageUrl: string;
  locale: string;
  name: string;
  workhour: string;
  isOutsourced: boolean;
  accountOwner: {
    _id: string;
    email: string;
    name: string;
    role: "admin" | "user" | "client";
  };
  accountWorker: {
    _id: string;
    email: string;
    name: string;
    role: "admin" | "user" | "client";
  };
};

export default function AdminReport() {
  const { reports, excelDownload, user, refreshReports } = useAuth();
  const [selected, setSelected] = useState<Report | null>(null);
  const [isFormOpen, setIsFormOpened] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // ✅ Delete report
  const handleDelete = async () => {
    if (!selected) return;
    try {
      await api.delete(`/reports/${selected._id}`);
      toast.success("Report deleted!");
      setIsDeleteOpen(false);
      setSelected(null);
      refreshReports(); // refresh list
    } catch (err) {
      toast.error("Failed to delete report.");
    }
  };

  // ✅ Edit report
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    try {
      await api.put(`/reports/${selected._id}`, {
        name: selected.name,
        workhour: selected.workhour,
        date: selected.date,
      });
      toast.success("Report updated!");
      setIsEditOpen(false);
      setSelected(null);
      refreshReports();
    } catch (err) {
      toast.error("Failed to update report.");
    }
  };

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
          <button
            onClick={excelDownload}
            className="px-4 py-2 border cursor-pointer rounded-lg hover:bg-gray-50"
          >
            Export CSV
          </button>
        </div>
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
                key={r._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b hover:bg-gray-50"
              >
                <td className="px-6 py-3 font-semibold">{r.name}</td>
                <td className="px-6 py-3">{r.locale}</td>
                <td className="px-6 py-3">{r.date.toString().substring(0, 10)}</td>
                <td className="px-6 py-3 font-bold">{r.workhour}</td>
                <td className="px-6 py-3">{r.accountWorker?.name}</td>
                <td className="px-6 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      r.isOutsourced
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {r.isOutsourced ? "True" : "False"}
                  </span>
                </td>
                <td className="px-6 py-3 flex gap-2">
                  <button
                    onClick={() => setSelected(r)}
                    className="text-blue-600 underline"
                  >
                    View
                  </button>
                  {user?.role === "worker" && (
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
                value={selected.name}
                onChange={(e) =>
                  setSelected({ ...selected, name: e.target.value })
                }
                className="w-full border rounded px-3 py-2 mb-3"
              />
              <input
                type="number"
                value={selected.workhour}
                onChange={(e) =>
                  setSelected({ ...selected, workhour: e.target.value })
                }
                className="w-full border rounded px-3 py-2 mb-3"
              />
              <input
                type="date"
                value={selected.date.toString().substring(0, 10)}
                onChange={(e) =>
                  setSelected({ ...selected, date: new Date(e.target.value) })
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
              <h2 className="text-lg font-bold mb-4">
                Delete this report?
              </h2>
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
