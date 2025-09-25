import {
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart as ReLineChart,
} from "recharts";
import { useAuth } from "../context/AuthContext";

const LineChart = () => {
  const { reports } = useAuth();

  // 🔹 Transform reports → { date, hours }
  const trendData = reports.map((r) => ({
    date: new Date(r.date).toLocaleDateString(), // format date
    hours: (r.totalSeconds || 0) / 3600, // convert seconds → hours
  }));

  return (
    <div className="w-full h-full bg-white p-4 rounded-xl shadow-md">
      <ResponsiveContainer width="100%" height="100%">
        <ReLineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="hours"
            stroke="#4153ef"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
            isAnimationActive={true} // 🔹 animate line drawing
          />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
