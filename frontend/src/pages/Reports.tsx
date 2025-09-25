import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReportForm from "./ReportForm";
import { useAuth } from "../context/AuthContext";

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

// Sample Reports

export default function ReportPage() {
  const { reports, excelDownload} = useAuth();
  const [selected, setSelected] = useState<Report | null>(null);
  const [isFormOpen, setIsFormOpened] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row  items-center justify-between"
      >
        <h1 className="text-2xl font-bold mb-5 md:mb-0">Reports</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setIsFormOpened(!isFormOpen)}
            className="px-4 py-2 bg-[#4153ef] text-white cursor-pointer rounded-lg hover:bg-[#3542c8] transition"
          >
            + Add New Report
          </button>
          <button 
           onClick={excelDownload}
          className="px-4 py-2 border-1 cursor-pointer rounded-lg hover:bg-white transition">
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
                    <p className="text-xs text-gray-500">{r.locale}</p>
                  </div>
                </td>
                <td className="px-6 py-3">{r.locale}</td>
                <td className="px-6 py-3">
                  {r.date.toString().substring(0, 10)}
                </td>
                <td className={`px-6 py-3 font-bold`}>{r.workhour}</td>
                <td className="px-6 py-3 max-w-xs truncate">
                  {r.accountWorker.name}
                </td>
                <td className="px-6 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      r.isOutsourced
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {r.isOutsourced ? "true" : "False"}
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

              {/*image zooming*/}
              <div onClick={() => setIsOpen(!isOpen)}>
                <img
                  src={selected.imageUrl}
                  alt="Report screenshot"
                  className={`w-full h-30 ${isOpen ? "hidden" : "block"}`}
                />
                {isOpen && (
                  <img
                    src={selected.imageUrl}
                    alt="Report screenshot"
                    className="max-h-[90%] rounded-lg shadow-lg absolute top-0 left-0"
                  />
                )}
              </div>

              <p className="text-sm text-gray-500 mb-2">
                {selected.date.toString().substring(0, 10)} • {selected.locale}
              </p>
              <p className="font-bold text-[#4153ef] mb-4">
                Work Hours: {selected.workhour}
              </p>
              <p className="text-gray-700">
                Account Worked By:
                {selected.accountWorker.name || "No report submitted."}
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

      {/*report form*/}

      {/* Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            className="fixed inset-0 flex items-center  justify-center bg-black/50 backdrop-blur-sm z-50"
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
                  onClick={() => setIsFormOpened(!isFormOpen)}
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
