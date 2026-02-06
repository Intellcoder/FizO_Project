import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useAuth } from "../context/AuthContext";

const BarGraph = () => {
  const { reports } = useAuth();

  // Transform reports → bar chart data
  const data = reports.reduce((acc: any[], report) => {
    const existing = acc.find((d) => d.name === report.account.account_name);
    if (existing) {
      existing.value += (report.workHours || 0) / 3600; // convert to hours
    } else {
      acc.push({
        name: report.account.account_name,
        value: (report.workHours || 0) / 3600,
      });
    }
    return acc;
  }, []);

  return (
    <ResponsiveContainer width="100%" height={"100%"}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#4153ef" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarGraph;
