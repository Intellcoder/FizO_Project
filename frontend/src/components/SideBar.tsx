import Avatar from "@mui/material/Avatar";
import { LuArrowLeftToLine } from "react-icons/lu";

import { MdArticle, MdDashboard, MdLockClock } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout } from "../pages/logout";
import { useSidebar } from "../context/SideBarContext";

const SideBar = () => {
  const { user } = useAuth();
  const { toggle, closeSidebar, isOpen } = useSidebar();
  const navigate = useNavigate();

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

  const name = user?.name || "o";
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
  return (
    <div
      className={`w-[60%] z-50 overflow-y-scroll fixed h-screen  bg-gray-300  p-2 md:w-[20%] no-scrollbar pr-3 ${
        isOpen ? "flex" : "hidden"
      } `}
    >
      <div className="flex flex-col justify-between h-[85%] pb-[10%] w-full ">
        <div className=" flex justify-end md:hidden text-[30px] w-full">
          <button onClick={toggle} className="">
            <LuArrowLeftToLine className="text-grey-100 self-end ml-auto" />
          </button>
        </div>
        <div className="h-[60%] pl-3 p-2">
          <nav className=" h-full">
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "font-bold text-primary text-xl flex items-center  mb-3"
                  : "text-black text-xl font-medium flex items-center  mb-3"
              }
              end
              to={"/"}
              onClick={closeSidebar}
            >
              <span className="mr-[2px]">
                <MdDashboard />
              </span>
              Dashboard
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "font-bold text-primary text-xl flex items-center mt-4 mb-4"
                  : "text-black text-xl font-medium flex items-center mt-4 mb-4"
              }
              to={"/dashboard"}
              onClick={closeSidebar}
            >
              <span className="">
                <MdLockClock />
              </span>
              My Hours
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "font-bold text-primary text-xl mt-4 mb-2 flex items-center"
                  : " text-xl font-medium flex items-center mt-4 mb-2"
              }
              to={"/report"}
              onClick={closeSidebar}
            >
              <span className="">
                <MdArticle />
              </span>
              Reports
            </NavLink>
          </nav>
        </div>

        <div className="h-[30%] pl-2 p-2">
          <div className="mb-5">
            <button
              onClick={() => logout(navigate)}
              className="bg-solid-blue rounded-lg px-6 py-1 text-white"
            >
              Log out
            </button>
          </div>
          <div className="flex items-center mt-10">
            {/*avartar*/}
            <Avatar {...stringAvatar(formattedName)} />
            <p className="ml-2 text-xl font-medium">{formattedName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
