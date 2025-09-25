import { IoLogOut } from "react-icons/io5";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import { MdPayments } from "react-icons/md";
import { useState } from "react";
import { IoMdMenu } from "react-icons/io";
import { SiGoogleanalytics } from "react-icons/si";
import { MdArticle, MdDashboard, MdSettings } from "react-icons/md";
import { Link } from "react-router-dom";

const navItem = [
  { icon: <MdDashboard />, text: "DashBoard", to: "/admin" },
  {
    icon: <PeopleOutlinedIcon />,
    text: "Team",
    to: "/admin/team",
  },
  {
    icon: <MdArticle />,
    text: "Report",
    to: "/admin/report",
  },
  {
    icon: <MdPayments />,
    text: "Payroll",
    to: "/admin/payroll",
  },
  {
    icon: <SiGoogleanalytics />,
    text: "Analytics",
    to: "/admin/analytics",
  },
  {
    icon: <MdSettings />,
    text: "Settings",
    to: "/admin/settings",
  },
  {
    icon: <IoLogOut />,
    text: "Log out",
    to: "/admin",
  },
];

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <>
      <div
        className={` md:flex flex-col bg-primary transition-all duration-300  ${
          isOpen ? "w-56" : "w-20"
        }`}
      >
        {/*sidebar for large screens*/}
        <div className="flex flex-col justify-end p-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-white hover:text-primary hover:bg-white"
          >
            <IoMdMenu size={35} />
          </button>
          <nav className="flex-1 space-y-2 mt-4 mb-2 ">
            {navItem.map((item, index) => (
              <Link
                to={item.to}
                key={index}
                className="flex items-center gap-3 mt-10 mb-10 px-2 py-2 rounded-lg  text-white text-2xl hover:bg-white hover:text-primary"
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
          </nav>
        </div>
      </div>
      <div
        className={`fixed inset-y-0 left-0 z-40 bg-primary shadow-lg w-56 transform transition-transform ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-2">
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg hover:"
          >
            <IoMdMenu size={20} />
          </button>
        </div>
        <nav className="space-y-2 mt-4">
          {navItem.map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-2 ">
              {item.icon}
              <span>{item.text}</span>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
};

export default SideBar;
