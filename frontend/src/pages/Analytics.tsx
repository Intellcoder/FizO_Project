import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

// Chart Data

const Analytics = () => {
  const { reports, loadingReports } = useAuth();
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

  const trendData = reports.map((reports) => ({
    date: reports.date,
    hour: reports.workhour,
  }));

  const COLORS = ["#4CAF50", "#F44336"];
  // Transform reports → bar chart data
  const barData = reports.reduce((acc: any[], report) => {
    const existing = acc.find((d) => d.name === report.name);
    if (existing) {
      existing.value += (report.totalSeconds || 0) / 3600; // convert to hours
    } else {
      acc.push({
        date: report.date,
        value: (report.totalSeconds || 0) / 3600,
      });
    }
    return acc;
  }, []);

  const statusData = [
    {
      name: "Not Outsourced",
      value: reports.filter((r) => r.isOutsourced === true),
    },
    {
      name: "OutSourced",
      value: reports.filter((r) => r.isOutsourced === false),
    },
  ];
  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-2xl font-bold">Analytics</h1>
        <button className="px-4 py-2 bg-[#4153ef] text-white rounded-lg hover:bg-[#3542c8] transition">
          Export Charts
        </button>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white p-6 rounded-xl shadow"
        >
          <h2 className="font-semibold mb-4">Hours per Employee</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hours" fill="#4153ef" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="bg-white p-6 rounded-xl shadow"
        >
          <h2 className="font-semibold mb-4">Hours Trend (Past 5 Days)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="hours"
                stroke="#4153ef"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="bg-white p-6 rounded-xl shadow md:col-span-2"
        >
          <h2 className="font-semibold mb-4">Submission Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${entry.name}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
