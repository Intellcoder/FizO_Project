import { IoLogOut } from "react-icons/io5";
import { MdPayments } from "react-icons/md";
import { useState } from "react";
import { IoMdMenu } from "react-icons/io";
import { MdArticle, MdDashboard, MdSettings } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { SiGoogleanalytics } from "react-icons/si";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";

import toast ,{Toaster} from "react-hot-toast";

const navItem = [
  { icon: <MdDashboard />, text: "/admin", to: "/" },
   {
    icon: <PeopleOutlinedIcon />,
    text: "Team",
    to: "/admin/team",
  },
  { icon: <MdArticle />, text: "Report", to: "/admin/reports" },
  { icon: <MdPayments />, text: "Payroll", to: "/admin/payroll" },
  { icon: <SiGoogleanalytics />, text: "Analytics", to: "/admin/analytics" },
  { icon: <MdSettings />, text: "Settings", to: "/admin/settings" },
];

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform actual logout logic here (e.g., clearing tokens, context, etc.)
    // For now, just navigate to login/admin page
    setShowLogoutModal(false);
      localStorage.removeItem("token");
  localStorage.removeItem("user");
  toast.success("Logged out successfully!");

  setTimeout(() => {
    navigate("/login");
  }, 2000);
   
  };

  return (
    <>
      {/* Sidebar for large screens */}
      <Toaster position="top-center" reverseOrder={false} />
      <div
        className={`md:flex flex-col bg-primary transition-all duration-300  ${
          isOpen ? "w-56" : "w-12 md:w-20"
        }`}
      >
        <div className="flex flex-col justify-end p-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 pl-1 md:pl-2 rounded-lg text-white hover:text-primary hover:bg-white"
          >
            <IoMdMenu size={35} />
          </button>
          <nav className="flex-1 space-y-2 mt-4 mb-2">
            {navItem.map((item, index) => (
              <Link
                to={item.to}
                key={index}
                className="flex items-center gap-3 mt-10 mb-10 px-2 py-2 rounded-lg text-white text-2xl hover:bg-white hover:text-primary"
              >
                {item.icon}
                <span
                  className={`transition-opacity duration-300 text-xl font-medium ${
                    isOpen ? "opacity-100" : "opacity-0 hidden"
                  }`}
                >
                  {item.text}
                </span>
              </Link>
            ))}

            {/* Logout Button - opens modal */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-3 mt-10 mb-10 px-2 py-2 rounded-lg text-white text-2xl hover:bg-white hover:text-primary w-full"
            >
              <IoLogOut />
              <span
                className={`transition-opacity duration-300 text-xl font-medium ${
                  isOpen ? "opacity-100" : "opacity-0 hidden"
                }`}
              >
                Log out
              </span>
            </button>
          </nav>
        </div>
      </div>

      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-40 bg-primary shadow-lg w-56 transform transition-transform ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-2">
          <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg">
            <IoMdMenu size={20} />
          </button>
        </div>
        <nav className="space-y-2 mt-4">
          {navItem.map((item, index) => (
            <Link
              to={item.to}
              key={index}
              className="flex items-center gap-3 p-2 text-white text-xl"
            >
              {item.icon}
              <span>{item.text}</span>
            </Link>
          ))}

          {/* Logout for mobile */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 p-2 text-white text-xl w-full"
          >
            <IoLogOut />
            <span>Log out</span>
          </button>
        </nav>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
            <p className="mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SideBar;
