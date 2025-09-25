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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute allowedRoles={["worker"]}/>}></Route>
        <Route element={<Layout />} path="/">
          <Route element={<DashBoard />} index />
          <Route element={<Reports />} path="/report" />
          <Route element={<Payment />} path="/payment" />
          <Route element={<EmployeeAnalytics />} path="/data" />
          <Route element={<SettingsPage />} path="/settings" />
        </Route>
    

        {/*Admin routes*/}
     <Route element={<ProtectedRoute allowedRoles={["admin"]}/>}>
        <Route element={<AdminLayout />} path="/admin">
          <Route element={<AdminDashBoard />} index />
          <Route element={<Team />} path="team" />
          <Route element={<AdminReport />} path="reports" />
          <Route element={<Payroll />} path="payroll" />
          <Route element={<Analytics />} path="analytics" />
        <Route element={<SettingsPage />} path="settings" />
        </Route>
        </Route>
        
      

         {/*Client routes*/}
        <Route element={<ClientLayout />} path="/client">
          <Route element={<ReportPage />} path="client" />
        </Route>


        <Route path="*" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
         <Route element={<SignUp />} path="/signup" />
        <Route element={<Login />} path="/login" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
