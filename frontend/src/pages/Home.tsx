import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import SideBar from "../components/SideBar";

const Home = () => {
  return (
    <div>
      <SideBar />
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Home;
