import { FaGlobeAfrica } from "react-icons/fa";
import bannerimage from "../assets/welcome illustartion.png";
import Container from "../components/Container";
import { FiArrowUpRight } from "react-icons/fi";
import { MdReport } from "react-icons/md";
import { MdTaskAlt } from "react-icons/md";
import { MdLockClock } from "react-icons/md";
import { MdMoreVert } from "react-icons/md";
import Report from "./Report";
import { useAuth } from "../context/AuthContext";

const MainDashboard = () => {
  const { user, reports, totalTime, excelDownload, loadingReports } = useAuth();

  let hours, minutes, sec;

  const formatSeconds = (seconds?: number | null) => {
    if (loadingReports) return "Calculating...";
    if (!seconds || seconds <= 0) return "0 hrs 0 mins 0 secs";

    hours = Math.floor(seconds / 3600);
    minutes = Math.floor((seconds % 3600) / 60);
    sec = seconds % 60;
    return `${hours} hrs ${minutes} mins ${sec} secs`;
  };

  return (
    <div>
      <div className="grid lg:grid-cols-[55%_45%] md:gap-3 pt-[3%] md:px-[1%] mb-6">
        <div>
          <div className="grid md:grid-cols-[45%_30%_25%] bg-light-gray m-3 mb-6 mt-0 p-3 rounded-lg  pb-3 place-content-center-safe">
            {/*welcome banner*/}
            <div className="flex-1 pt-5 pl-3 items-center">
              <h1 className="text-xl md:text-3xl text-start font-medium">
                Welcome back,
              </h1>
              <h1 className="text-base">Get all your works recorded</h1>
              <h1 className="text-base">its fast and reliable</h1>
            </div>
            <div className="h-[90%] hidden md:flex">
              <img src={bannerimage} alt="welcome image " className="h-full" />
            </div>
            <div className="flex flex-col justify-evenly pt-3 pb-3">
              <button
                className="bg-solid-blue m-4 md:m-0  cursor-pointer text-center text-nowrap text-white py-2 px-4 rounded-lg"
                onClick={excelDownload}
              >
                Download Report
              </button>
              <button className="bg-white m-4 md:m-0 text-solid-blue py-2 px-4 rounded-lg">
                View Worksheet
              </button>
            </div>
          </div>
          <div className="p-2 mt-5 w-full">
            {/*upload File*/}

            <div className="w-full">
              <Report />
            </div>
          </div>
        </div>
        <div className="  md:flex flex-col md:px-2">
          <div className="flex justify-between px-3">
            <h1 className=" text-xl font-medium mb-3">Account Details</h1>
            <MdMoreVert className="text-[30px] bg-gray-300 font-black rounded-lg " />
          </div>
          <div className="grid md:grid-cols-2 p-2 mb-3 ">
            <Container
              icon={<MdLockClock color="green" />}
              backgroundColor="solid-blue"
              title="Total Hours:"
              iconColor="green-500"
              textColor="gray-300"
              backgroundColor2="white"
              value={formatSeconds(totalTime?.totalSeconds ?? 0)}
              icon2={<FiArrowUpRight />}
            />
            <Container
              icon={<MdTaskAlt />}
              backgroundColor="gray-200"
              title={`Total Task:`}
              textColor="black"
              iconColor="primary"
              value={"800"}
              icon2={<FiArrowUpRight />}
              backgroundColor2="white"
            />
            <Container
              icon={<FaGlobeAfrica />}
              backgroundColor="gray-200"
              title="Locale:"
              textColor="black"
              iconColor="primary"
              value={user?.locale || ""}
              icon2={<FiArrowUpRight />}
              backgroundColor2="white"
            />
            <Container
              icon={<MdReport />}
              backgroundColor="gray-200"
              title="Reports Submitted:"
              textColor="black"
              iconColor="primary"
              value={String(reports.length)}
              icon2={<FiArrowUpRight />}
              backgroundColor2="white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
