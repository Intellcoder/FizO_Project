import { motion } from "framer-motion";
import { MdLockClock } from "react-icons/md";
import { useAuth } from "../context/AuthContext";

import StatsCard from "../components/StatsCard";
import ChartCard from "../components/ChartCard";

import PieGraph from "../components/PieChart";
import TableCard from "../components/TableCard";
import LineChart from "../components/LineChart";
import Loader from "../components/Loader";

const AdminDashBoard = () => {
  const { loadingReports, totalTime, user, reports } = useAuth();

  let hours, minutes, sec;

  const formatSeconds = (seconds?: number | null) => {
    if (loadingReports)
      return (
        <div>
          <div className="flex items-center justify-center">
            <div className="flex flex-col gap-6 items-center justify-center ">
              <Loader type="dots" color="#ef4444" size={100} speed={0.6} />
            </div>
          </div>
        </div>
      );
    if (!seconds || seconds <= 0) return "0 hrs 0 mins 0 secs";

    hours = Math.floor(seconds / 3600);
    minutes = Math.floor((seconds % 3600) / 60);
    sec = seconds % 60;
    return `${hours} hrs ${minutes} mins ${sec} secs`;
  };
  return (
    <>
      <div className="mb-3">
        <h1 className="text-[30px]">Welcome Back,{user?.name}</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="h-full"
        >
          <StatsCard
            title="Total Hours Worked"
            icon={<MdLockClock color="green" />}
            value={formatSeconds(totalTime?.totalSeconds).toString()}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="h-full"
        >
          <StatsCard
            title="Total Task submitted"
            icon={<MdLockClock color="green" />}
            value="800"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="h-full"
        >
          <StatsCard
            title="Locale"
            icon={<MdLockClock color="green" />}
            value={user!.locale}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="h-full"
        >
          <StatsCard
            title="No of Reports Submitted"
            icon={<MdLockClock color="green" />}
            value={reports.length.toString()}
          />
        </motion.div>
      </div>
      <div className="mt-4 grid grid-cols-1 xl:grid-cols-[60%_40%] gap-3">
        <ChartCard title="Report submitted" children={<LineChart />} />
        <ChartCard title="Work Hours" children={<PieGraph />} />
      </div>
      <div className="mt-4">
        <TableCard
          title="Recent Reports submitted"
          header={["Name", "Email", "Date"]}
          rows={[
            ["Jane Doe", "Jane@gmail.com", "2025-09-22"],
            ["John Smith", "john@gmail.com", "2025-09-21"],
          ]}
        />
      </div>
    </>
  );
};

export default AdminDashBoard;
