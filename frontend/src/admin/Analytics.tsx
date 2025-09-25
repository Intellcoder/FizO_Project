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

const trendData = [
  { date: "2025-09-18", hours: 7 },
  { date: "2025-09-19", hours: 8 },
  { date: "2025-09-20", hours: 6 },
  { date: "2025-09-21", hours: 8 },
  { date: "2025-09-22", hours: 7.5 },
];

const COLORS = ["#4CAF50", "#F44336"];

const Analytics = () => {
  const { reports } = useAuth();

  // Chart Data
  // Transform reports → bar chart data
  const barData = reports.reduce((acc: any[], report) => {
    const existing = acc.find((d) => d.name === report.name);
    if (existing) {
      existing.value += (report.totalSeconds || 0) / 3600; // convert to hours
    } else {
      acc.push({
        name: report.name,
        value: (report.totalSeconds || 0) / 3600,
      });
    }
    return acc;
  }, []);

  const statusData = [
    {
      name: "Not Outsourced",
      value: reports.filter((r) => r.isOutsourced === true).length,
    },
    {
      name: "Outsourced",
      value: reports.filter((r) => r.isOutsourced === false).length,
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
              <XAxis dataKey="name" />
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
              <XAxis dataKey="date" />
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
