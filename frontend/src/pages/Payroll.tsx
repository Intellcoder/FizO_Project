import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  Button,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const payments = [
  { date: "2025-09-01", hours: 40, rate: 15, amount: 600, status: "Paid" },
  { date: "2025-09-08", hours: 35, rate: 15, amount: 525, status: "Paid" },
  { date: "2025-09-15", hours: 30, rate: 15, amount: 450, status: "Pending" },
];

const lineData = [
  { week: "Week 1", total: 600 },
  { week: "Week 2", total: 1125 },
  { week: "Week 3", total: 1575 },
];

const pieData = [
  { name: "Paid", value: 2 },
  { name: "Pending", value: 1 },
];
const COLORS = ["#4CAF50", "#F44336"];

export default function WorkerPaymentPage() {
  const totalPay = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div style={{ padding: "2rem" }}>
      <Grid container justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          My Payments
        </Typography>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#4153ef", borderRadius: "8px" }}
        >
          Download Payslip (PDF)
        </Button>
      </Grid>

      {/* Overview Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid>
          <Paper sx={{ p: 3 }}>
            <Typography>Total Accumulated Pay</Typography>
            <Typography variant="h5" fontWeight="bold" color="#4153ef">
              ${totalPay}
            </Typography>
          </Paper>
        </Grid>
        <Grid>
          <Paper sx={{ p: 3 }}>
            <Typography>Last Payment</Typography>
            <Typography variant="h6" fontWeight="bold">
              {payments[0].date}
            </Typography>
          </Paper>
        </Grid>
        <Grid>
          <Paper sx={{ p: 3 }}>
            <Typography>Pending Payments</Typography>
            <Typography variant="h6" fontWeight="bold" color="error">
              {payments.filter((p) => p.status === "Pending").length}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Payment History Table */}
      <Paper sx={{ mb: 4, width: "100%" }}>
        <Table sx={{ overflow: "scroll" }}>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Hours Worked</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((p, i) => (
              <TableRow key={i}>
                <TableCell>{p.date}</TableCell>
                <TableCell>{p.hours}</TableCell>
                <TableCell>${p.rate}</TableCell>
                <TableCell>${p.amount}</TableCell>
                <TableCell
                  sx={{
                    color:
                      p.status === "Pending" ? "error.main" : "success.main",
                    fontWeight: 600,
                  }}
                >
                  {p.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {/* Line Chart */}
        <div className="rounded-xl">
          <Paper sx={{ p: 3 }}>
            <Typography fontWeight="bold" mb={2}>
              Accumulated Pay Trend
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#4153ef"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </div>

        {/* Pie Chart */}
        <div>
          <Paper sx={{ p: 3 }}>
            <Typography fontWeight="bold" mb={2}>
              Payment Status
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </div>
      </div>
    </div>
  );
}
