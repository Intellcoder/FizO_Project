import Avatar from "@mui/material/Avatar";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import api from "../api/axiosInstance";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

type SignUpFormInput = {
  name: string;
  email: string;
  password: string;
  locale: string;
  role: "Admin" | "User" | "Client";
  status: "Active" | "Non-Active";
};

type TeamMember = {
  _id: string;
  email: string;
  name: string;
  locale: string;
  totalSeconds: number;
  role: string;
  status: "Active" | "Not Active";
};

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}`,
  };
}

const Team = () => {
  const { team, deleteProfile, refreshTeam } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormInput>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TeamMember | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const onSubmit = async (data: SignUpFormInput) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/register", data);

      //store token if available
      // localStorage.setItem("token", res.data.token);
      // localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success(res.data.message || "Team member added sucessfully!");
      setLoading(false);
      setIsModalOpen(false);
      refreshTeam();
      // Wait 2.5s before redirect
      // setTimeout(() => {
      //   //redirect to home page
      //   navigate("/login");
      // }, 3000);
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        "Something went wrong,Please try again.";
      toast.error(errorMsg);
      setLoading(false);
    }
  };

  //delete modal

  //delete userProfile
  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      deleteProfile(selectedUser._id);
      setIsDeleteOpen(false);
      refreshTeam();
    } catch (error) {
      toast.error("Failed to Delete worker");
    }
  };

  //handle Edit user details
  const handleEdit = async () => {
    if (!selectedUser) return;
    try {
      setIsEditOpen;
    } catch (error) {}
  };

  return (
    <div className="p-6 h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p>Manage your team and their access levels</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-secondary transition"
        >
          + Add Member
        </button>
      </div>
      <div className=" hidden md:block">
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50  mb-3">
            <tr style={{ marginBottom: "2rem" }}>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 ">Locale</th>
              <th className="px-4 py-2 ">Role</th>
              <th className="px-4 py-2 ">Email</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="mt-3">
            {team.map((member) => (
              <tr
                key={member.name}
                className="hover:bg-gray-50 transition mt-3 pt-3"
              >
                <td className="px-4 py-3 flex items-center gap-3">
                  <Avatar {...stringAvatar(member.name)} />

                  <span>{member.name}</span>
                </td>
                <td className="px-4 py-3">{member.locale}</td>
                <td className="px-4 py-3">{member.role}</td>
                <td className="px-4 py-3">{member.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      member.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {member.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => {
                      setSelectedUser(member);
                      setIsEditOpen(true);
                    }}
                    className="text-sm text-primary hover:underline mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(member);
                      setIsDeleteOpen(true);
                    }}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/*mobile card*/}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {team.map((member) => (
          <motion.div
            key={member._id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div>
                <h1 className="font-semibold text-gray-900">{member.name}</h1>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
              <div className="mb-2">
                <div className="mb-2">
                  <p className="text-sm text-gray-500">{member.email}</p>
                  <p className="text-sm text-gray-500">{member.locale}</p>
                </div>
                <div className="flex gap-4">
                  <span
                    className={`mt-2 w-fit px-2 py-1 text-xs font-medium rounded-full ${
                      member.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {member.status}
                  </span>
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={() => {
                        setSelectedUser(member);
                        setIsEditOpen(true);
                      }}
                      className="text-sm text-primary hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(member);
                        setIsDeleteOpen(true);
                      }}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {/*Animated modal*/}

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            {/*backdrop*/}
            <motion.div
              className="bg-white rounded-xl shadow-2xl w-full max-w-md animate- z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/*modal card*/}
              <motion.div
                // onClick={() => setIsModalOpen()}
                className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-md animate-fadeIn z-1"
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 text-2xl hover:text-gray-700"
                  >
                    x
                  </button>
                </div>
                <h1 className="text-lg font-bold text-gray-900 mb-4">
                  Add Team Member
                </h1>
                <form
                  className="space-y-4 bg-white z-10"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="flex flex-col">
                    <input
                      type="text"
                      placeholder="Full Name"
                      {...register("name", { required: "Name is required" })}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#4153ef] outline-none"
                      required
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm ">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <input
                      type="email"
                      placeholder="Email"
                      {...register("email", { required: "Email is required" })}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#4153ef] outline-none"
                      required
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm ">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <input
                      type="text"
                      placeholder="Password"
                      {...register("password", {
                        required: "Password is required",
                      })}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#4153ef] outline-none"
                      required
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm ">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <select
                      {...register("role", {
                        required: "role is required",
                      })}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#4153ef] outline-none"
                    >
                      <option>Admin</option>
                      <option>Worker</option>
                      <option>Client</option>
                    </select>
                    {errors.role && (
                      <p className="text-red-500 text-sm ">
                        {errors.role.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <input
                      type="text"
                      placeholder="locale"
                      {...register("locale", {
                        required: "locale is required",
                      })}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#4153ef] outline-none"
                      required
                    />
                    {errors.locale && (
                      <p className="text-red-500 text-sm ">
                        {errors.locale.message}
                      </p>
                    )}
                    {/* <select
                      {...register("locale", {
                        required: "status is required",
                      })}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#4153ef] outline-none"
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                    {errors.status && (
                      <p className="text-red-500 text-sm ">
                        {errors.status.message}
                      </p>
                    )} */}
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#4153ef] text-white py-2 rounded-lg hover:bg-[#3542c8] transition"
                  >
                    {loading ? (
                      <span className="roundef-full ">Loading..</span>
                    ) : (
                      "Add Member"
                    )}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 Delete Confirmation */}
      <AnimatePresence>
        {isDeleteOpen && selectedUser && (
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
              <h2 className="text-lg font-bold mb-4">Delete this worker </h2>
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

      {/* 🔹 Edit Modal */}
      <AnimatePresence>
        {isEditOpen && selectedUser && (
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
                value={selectedUser.name}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, name: e.target.value })
                }
                className="w-full border rounded px-3 py-2 mb-3"
              />
              <input
                type="text"
                value={selectedUser.email}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
                className="w-full border rounded px-3 py-2 mb-3"
              />
              <input
                type="text"
                value={selectedUser.locale}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    locale: e.target.value,
                  })
                }
                className="w-full border rounded px-3 py-2 mb-3"
              />
              <select
                name="role"
                id="role"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#4153ef] outline-none"
              >
                <option value="admin">Admin</option>
                <option value="worker"> Worker</option>
                <option value="client">Client</option>
              </select>
              <div className="flex justify-end gap-3 mt-5">
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
    </div>
  );
};

export default Team;
