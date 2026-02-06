import Avatar from "@mui/material/Avatar";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiMoreVertical } from "react-icons/fi";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

type SignUpFormInput = {
  name: string;
  account_name: string;
  email: string;
  password: string;
  locale: string;
  role: "Admin" | "Worker" | "Client";
  status: "Active" | "Non-Active";
};

type Payment = {
  totalPay: number;
  totalHours: number;
};

type Account = {
  id: number;
  account_name: string;
  locale: string;
  ownerId: number;
};

type Assignment = {
  workerId: number;
  accountId: number;
  type: string;
  active: boolean;
  startedAt: string;
  endedAt: string;
  account: Account;
};

type Worker = {
  id: number;
  name: string;
  email: string;
  role: string;
  workerId: string;
  payment?: Payment;
  accounts?: Account[];
  assignments?: Assignment[];
};

function stringToColor(string: string) {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

function stringAvatar(name: string) {
  return {
    sx: { bgcolor: stringToColor(name) },
    children: `${name.split(" ")[0][0]}`,
  };
}

const Team = () => {
  const { team, deleteProfile, refreshTeam } = useAuth();

  const { register, handleSubmit, reset } = useForm<SignUpFormInput>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isAssignAccountOpen, setIsAssignAccountOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountLocale, setNewAccountLocale] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null
  );
  const [expandedAccounts, setExpandedAccounts] = useState<number | null>(null);
  // 🔹 Add Team Member
  const onSubmit = async (data: SignUpFormInput) => {
    setLoading(true);
    try {
      const res = await api.post("/worker/auth/register", data);
      toast.success(res.data.message || "Team member added successfully!");
      refreshTeam();
      setIsModalOpen(false);
      reset();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to add team member."
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete Member
  const handleDelete = async () => {
    if (!selectedWorker) return;
    try {
      await deleteProfile(selectedWorker.id);
      refreshTeam();
      setIsDeleteOpen(false);
    } catch {
      toast.error("Failed to delete worker.");
    }
  };

  // 🔹 Edit Member
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorker) return;
    setLoading(true);
    try {
      await api.put(`/admin/updateUser/${selectedWorker.id}`, selectedWorker);
      toast.success("Worker details updated.");
      refreshTeam();
      setIsEditOpen(false);
    } catch (error: any) {
      toast.error("Failed to update worker.");
    } finally {
      setLoading(false);
    }
  };

  console.log(team);
  return (
    <div className="p-6 h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-600">
            Manage your team and their access levels
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-secondary transition"
        >
          + Add Member
        </button>
      </div>
      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50 w-full">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 text-center py-2">Email</th>
              <th className="px-4 py-2">Account Details</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {team.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 flex items-center gap-3">
                  <Avatar {...stringAvatar(member.name)} />
                  <span>{member.name}</span>
                </td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3">{member.role}</td>
                <td className="px-4 py-3">{member.email}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() =>
                      setExpandedAccounts(
                        expandedAccounts === member.id ? null : member.id
                      )
                    }
                    className="px-2 py-1 border rounded hover:bg-gray-100 text-sm"
                  >
                    {member.accounts?.length
                      ? `${member.accounts[0]?.account_name}...`
                      : "-"}
                  </button>

                  {expandedAccounts === member.id && member.accounts && (
                    <div className="absolute mt-1 bg-gray-50 border border-gray-200 rounded-md p-2 z-50">
                      {member.accounts.map((assign) => (
                        <div
                          key={assign.id}
                          className="flex justify-between items-center px-2 py-1 hover:bg-gray-100 rounded"
                        >
                          <span className="font-medium mr-1">
                            {assign?.account_name}
                          </span>
                          <span className="text-gray-500 text-sm">
                            {assign?.locale}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-right relative">
                  <button
                    onClick={() =>
                      setSelectedWorker(
                        selectedWorker?.id === member.id ? null : member
                      )
                    }
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <FiMoreVertical size={18} />
                  </button>
                  {selectedWorker?.id === member.id && (
                    <div className="relative right-0   mt-2 w-44   bg-white border border-gray-200 rounded-md shadow-lg z-50 ">
                      <button
                        onClick={() => setIsAddAccountOpen(true)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Add New Account
                      </button>
                      <button
                        onClick={() => setIsAssignAccountOpen(true)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Assign Existing Account
                      </button>
                      <button
                        onClick={() => setIsEditOpen(true)}
                        className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setIsDeleteOpen(true)}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Add Member Modal */}{" "}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            {" "}
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ duration: 0.3 }}
            >
              {" "}
              <div className="flex justify-end">
                {" "}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 text-2xl hover:text-gray-700"
                >
                  {" "}
                  ×{" "}
                </button>{" "}
              </div>{" "}
              <h1 className="text-lg font-bold text-gray-900 mb-4">
                {" "}
                Add Team Member{" "}
              </h1>{" "}
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                {" "}
                <input
                  type="text"
                  placeholder="Full Name"
                  {...register("name", { required: "Name is required" })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#4153ef]"
                />{" "}
                <input
                  type="text"
                  placeholder="Account Name"
                  {...register("account_name", {
                    required: "Account name is required",
                  })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#4153ef]"
                />{" "}
                <input
                  type="email"
                  placeholder="Email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#4153ef]"
                />{" "}
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#4153ef]"
                />{" "}
                <select
                  {...register("role", { required: "Role is required" })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#4153ef]"
                >
                  {" "}
                  <option>Admin</option> <option>Worker</option>{" "}
                  <option>Client</option>{" "}
                </select>{" "}
                <input
                  type="text"
                  placeholder="Locale"
                  {...register("locale", { required: "Locale is required" })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#4153ef]"
                />{" "}
                <button
                  type="submit"
                  className="w-full bg-[#4153ef] text-white py-2 rounded-lg hover:bg-[#3542c8] transition"
                >
                  {" "}
                  {loading ? "Loading..." : "Add Member"}{" "}
                </button>{" "}
              </form>{" "}
            </motion.div>{" "}
          </motion.div>
        )}{" "}
      </AnimatePresence>
      {/* Delete Confirmation Modal */}{" "}
      <AnimatePresence>
        {isDeleteOpen && selectedWorker && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {" "}
            <motion.div
              className="bg-white p-6 rounded-xl w-full max-w-sm text-center"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              {" "}
              <h2 className="text-lg font-bold mb-4">
                {" "}
                Delete {selectedWorker.name}?{" "}
              </h2>{" "}
              <p className="mb-6 text-gray-600">
                {" "}
                This action cannot be undone.{" "}
              </p>{" "}
              <div className="flex justify-center gap-4">
                {" "}
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
      {/* Edit Modal */}{" "}
      <AnimatePresence>
        {" "}
        {isEditOpen && selectedWorker && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {" "}
            <motion.form
              onSubmit={handleEdit}
              className="bg-white p-6 rounded-xl w-full max-w-md"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              {" "}
              <h2 className="text-lg font-bold mb-4">Edit Worker</h2>{" "}
              <input
                type="text"
                value={selectedWorker.name}
                onChange={(e) =>
                  setSelectedWorker({ ...selectedWorker, name: e.target.value })
                }
                className="w-full border rounded px-3 py-2 mb-3"
              />{" "}
              <input
                type="text"
                value={selectedWorker.email}
                onChange={(e) =>
                  setSelectedWorker({
                    ...selectedWorker,
                    email: e.target.value,
                  })
                }
                className="w-full border rounded px-3 py-2 mb-3"
              />{" "}
              <input
                type="text"
                value={selectedWorker.accounts?.map((a) => a.locale)}
                onChange={() => setSelectedWorker({ ...selectedWorker })}
                className="w-full border rounded px-3 py-2 mb-3"
              />
              <select
                value={selectedWorker.role}
                onChange={(e) =>
                  setSelectedWorker({ ...selectedWorker, role: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#4153ef]"
              >
                <option>Admin</option> <option>Worker</option>
                <option>Client</option>
              </select>
              <div className="flex justify-end gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  {" "}
                  Cancel{" "}
                </button>{" "}
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {" "}
                  {loading ? "Saving..." : "Save"}{" "}
                </button>{" "}
              </div>{" "}
            </motion.form>{" "}
          </motion.div>
        )}{" "}
      </AnimatePresence>
      {/* Mobile Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {team.map((member) => (
          <motion.div
            key={member.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Avatar {...stringAvatar(member.name)} />
                <div>
                  <h1 className="font-semibold text-gray-900">{member.name}</h1>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              </div>
              <button
                onClick={() =>
                  setSelectedWorker(
                    selectedWorker?.id === member.id ? null : member
                  )
                }
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <FiMoreVertical size={18} />
              </button>
              {selectedWorker?.id === member.id && (
                <div className=" mt-10 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <button
                    onClick={() => setIsAddAccountOpen(true)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Add New Account
                  </button>
                  <button
                    onClick={() => setIsAssignAccountOpen(true)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Assign Existing Account
                  </button>
                  <button
                    onClick={() => setIsEditOpen(true)}
                    className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setIsDeleteOpen(true)}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600">{member.email}</p>
            <p className="text-sm text-gray-600">
              <span className="text-black">Accounts:</span>{" "}
              {member.accounts?.map((a) => a.account_name).join(", ") || "-"}
            </p>
          </motion.div>
        ))}
      </div>
      {/* Add Account Modal */}
      <AnimatePresence>
        {isAddAccountOpen && selectedWorker && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
            >
              <h2 className="text-lg font-bold mb-4">
                Add Account for {selectedWorker.name}
              </h2>
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!selectedWorker) return;
                  try {
                    await api.post("/worker/account", {
                      workerId: selectedWorker.id,
                      ownerId: selectedWorker.id,
                      account_name: newAccountName,
                      locale: newAccountLocale,
                    });
                    toast.success("Account created successfully");
                    setIsAddAccountOpen(false);
                    refreshTeam();
                  } catch {
                    toast.error("Failed to create account");
                  }
                }}
              >
                <input
                  type="text"
                  placeholder="Account Name"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Locale"
                  value={newAccountLocale}
                  onChange={(e) => setNewAccountLocale(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddAccountOpen(false)}
                    className="px-4 py-2 bg-gray-200 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Add
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Assign Account Modal */}
      <AnimatePresence>
        {isAssignAccountOpen && selectedWorker && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
            >
              <h2 className="text-lg font-bold mb-4">
                Assign Account to {selectedWorker.name}
              </h2>
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!selectedWorker || !selectedAccountId) return;
                  try {
                    console.log("assinging account");
                    await api.post("/worker/assingaccount", {
                      newOwnerId: selectedWorker.id,
                      accountId: selectedAccountId,
                    });
                    console.log("tryiing assign account");
                    toast.success("Account assigned successfully");
                    setIsAssignAccountOpen(false);
                    refreshTeam();
                  } catch {
                    toast.error("Failed to assign account");
                  }
                }}
              >
                <select
                  value={selectedAccountId || ""}
                  onChange={(e) => setSelectedAccountId(Number(e.target.value))}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select Account</option>
                  {team
                    .flatMap((w) => w.accounts || [])
                    .map((acct) => (
                      <option key={acct.id} value={acct.id}>
                        {acct.account_name} ({acct.locale})
                      </option>
                    ))}
                </select>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAssignAccountOpen(false)}
                    className="px-4 py-2 bg-gray-200 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Assign
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Delete & Edit Modals remain unchanged */}
    </div>
  );
};

export default Team;
