import { motion } from "framer-motion";
import { MdLockClock } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import StatsCard from "../components/StatsCard";
import ChartCard from "../components/ChartCard";
import BarGraph from "../components/BarChart";
import PieGraph from "../components/PieChart";
import TableCard from "../components/TableCard";
import Loader from "../components/Loader";

const AdminDashBoard = () => {
  const { loadingReports, reports, team } = useAuth();

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
    if (!seconds || seconds <= 0) return "N/A";

    hours = Math.floor(seconds / 3600);
    minutes = Math.floor((seconds % 3600) / 60);
    sec = seconds % 60;
    return `${hours} hrs ${minutes} mins ${sec} secs`;
  };

  const workers = Array.isArray(team) ? team : [];

  // 📊 Stats
  const totalEmployees = workers.length;

  const totalHours = workers.reduce(
    (sum, w) => sum + (w.payment?.totalHours || 0),

    0,
  );
  console.log("Team:", team);
  return (
    <>
      <div className="mb-3">
        <h1 className="text-[30px]">Welcome Back,Admin</h1>
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
            value={formatSeconds(totalHours).toString()}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="h-full"
        >
          <StatsCard
            title="Total Submitted Reports"
            icon={<MdLockClock color="green" />}
            value={reports.length.toString()}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="h-full"
        >
          <StatsCard
            title="No of Employees"
            icon={<MdLockClock color="green" />}
            value={totalEmployees.toString()}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="h-full"
        >
          <StatsCard
            title="Cycle:"
            icon={<MdLockClock color="green" />}
            value="2"
          />
        </motion.div>
      </div>
      <div className="mt-4 grid grid-cols-1 xl:grid-cols-[60%_40%] gap-3">
        <ChartCard title="Report submitted" children={<BarGraph />} />
        <ChartCard title="Work Hours" children={<PieGraph />} />
      </div>
      <div className="mt-4">
        <TableCard
          title="Recent SignUps"
          header={["Name", "Email", "Date"]}
          rows={[...reports] // copy so original array isn’t mutated
            .sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime(),
            )
            .slice(0, 4) // only first 3
            .map((r) => [
              r.account.account_name,
              r.todaysHour, // or r.workhour if you want instead of email
              new Date(r.updatedAt).toLocaleDateString(),
            ])}
        />
      </div>
    </>
  );
};

export default AdminDashBoard;
