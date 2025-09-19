import { BiSearch } from "react-icons/bi";
import { Link, NavLink } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { logout } from "../pages/logout";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { MdArticle } from "react-icons/md";
import { IoMdMenu } from "react-icons/io";
import { MdLockClock } from "react-icons/md";
import { useSidebar } from "../context/SideBarContext";

const Header = () => {
  const { user } = useAuth();
  const { toggle } = useSidebar();
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
    <div>
      <header className="bg-blue-50 flex justify-between py-4 px-3 items-center">
        <IoMdMenu onClick={toggle} className="text-3xl font-bold md:hidden" />
        <Link to={"/"}>
          <h1 className="text-2xl font-bold text-gradient">
            FizO <span className="text-primary">Taggers</span>
          </h1>
        </Link>
        <div className="md:flex lg:w-[30%] hidden">
          <nav className="flex justify-between items-center md:gap-3 w-full">
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "font-bold text-primary text-xl flex items-center"
                  : "text-black text-xl font-medium flex items-center"
              }
              end
              to={"/"}
            >
              <span className="mr-[2px]">
                <MdDashboard />
              </span>
              Dashboard
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "font-bold text-primary text-xl flex items-center"
                  : "text-black text-xl font-medium flex items-center"
              }
              to={"/dashboard"}
            >
              <span className="">
                <MdLockClock />
              </span>
              My Hours
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "font-bold text-primary text-xl flex items-center"
                  : " text-xl font-medium flex items-center"
              }
              to={"/report"}
            >
              <span className="">
                <MdArticle />
              </span>
              Reports
            </NavLink>
          </nav>
        </div>
        <div className="hidden lg:flex items-center p-2 px-4 rounded-full bg-white">
          <BiSearch className="text-xl" />
          <input
            type="text"
            placeholder="search any document"
            className="pl-2 outline-none"
          />
        </div>
        <div className="hidden md:flex">
          <button
            onClick={() => logout(navigate)}
            className="bg-solid-blue rounded-lg px-6 py-1 text-white"
          >
            Log out
          </button>
        </div>
        <div className="flex items-center">
          {/*avartar*/}
          <Avatar {...stringAvatar(formattedName)} />
          <p className="ml-2 text-xl font-medium">{formattedName}</p>
        </div>
      </header>
    </div>
  );
};

export default Header;
