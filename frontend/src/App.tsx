import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import EmployeeAnalytics from "./pages/Analytics";
import AdminDashBoard from "./admin/AdminDashBoard";
import AdminLayout from "./admin/AdminLayout";
import Team from "./admin/Team";
import Reports from "./pages/Reports";
import Payroll from "./admin/Payroll";
import Analytics from "./admin/Analytics";
import ClientLayout from "./client/ClientLayout";
import ReportPage from "./client/Report";
import Layout from "./user/Layout";
import DashBoard from "./user/DashBoard";
import Payment from "./pages/Payroll";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import SettingsPage from "./pages/Settings";
import AdminReport from "./admin/AdminReport";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Worker routes */}
        <Route element={<ProtectedRoute allowedRoles={["worker"]} />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashBoard />} />
            <Route path="report" element={<Reports />} />
            <Route path="payment" element={<Payment />} />
            <Route path="data" element={<EmployeeAnalytics />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Admin routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashBoard />} />
            <Route path="team" element={<Team />} />
            <Route path="reports" element={<AdminReport />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Client routes */}
        <Route path="/client" element={<ClientLayout />}>
          <Route path="report" element={<ReportPage />} />
        </Route>

        {/* Public routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Fallback */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
