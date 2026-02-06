import { motion } from "framer-motion";
import { MdLockClock } from "react-icons/md";
import { useAuth } from "../context/AuthContext";

import StatsCard from "../components/StatsCard";
import ChartCard from "../components/ChartCard";

import PieGraph from "../components/PieChart";
import TableCard from "../components/TableCard";
import LineChart from "../components/LineChart";
import Loader from "../components/Loader";
import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";

const AdminDashBoard = () => {
  const { user, reports } = useAuth();

  const [paymentInfo, setPaymentInfo] = useState<{
    totalPay: number;
    totalHours: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        const res = await api.get("/payments/my-payments");
        setPaymentInfo(res.data);
      } catch (err: any) {
        setError(err.message);
        toast.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentInfo();
  }, []);

  const formatTime = (seconds: number) => {
    if (!seconds || seconds <= 0) return "0 hrs 0 mins 0 secs";

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hrs} hr${hrs !== 1 ? "s" : ""} ${mins} min${
      mins !== 1 ? "s" : ""
    } ${secs} sec${secs !== 1 ? "s" : ""}`;
  };

  const formatTask = (task?: number | null) => {
    if (loading)
      return (
        <div>
          <div className="flex items-center justify-center">
            <div className="flex flex-col gap-6 items-center justify-center ">
              <Loader type="dots" color="#ef4444" size={100} speed={0.6} />
            </div>
          </div>
        </div>
      );
    if (!task) return "N/A";
    console.log(task);
    return `${task}`;
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
            value={formatTime(paymentInfo?.totalHours ?? 0).toString()}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="h-full"
        >
          <StatsCard
            title="Accumulated Pay"
            icon={<MdLockClock color="green" />}
            value={formatTask(paymentInfo?.totalPay).toString()}
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
            value={user?.locale ?? "N/A"}
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
          header={["Name", "WorkHour", "Date"]}
          rows={[...reports] // copy so original array isn’t mutated
            .sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime(),
            )
            .slice(0, 3) // only first 3
            .map((r) => [
              r.account.account_name,
              r.todaysHour, // or r.workhour if you want instead of email
              new Date(r.updatedAt).toISOString(),
            ])}
        />
      </div>
    </>
  );
};

export default AdminDashBoard;
