import Header from "../components/Header";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";

type Props = {};

const Layout = (props: Props) => {
  return (
    <>
      <Header />
      <div className="flex-1 flex ">
        <SideBar />
        <main className="flex-1 h-screen overflow-y-scroll bg-gray-300 p-6">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Layout;
