import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ReportDetails from "./pages/ReportDetails";
import Home from "./pages/Home";
import MainDashboard from "./pages/MainDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import OutSourcedReport from "./pages/OutSourcedReport";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Home />} path="/">
          <Route
            element={
              <ProtectedRoute>
                <MainDashboard />
              </ProtectedRoute>
            }
            index
          />

          <Route
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
            path="/dashboard"
          />
          <Route
            element={
              <ProtectedRoute>
                <ReportDetails />
              </ProtectedRoute>
            }
            path="/report"
          />
          <Route
            element={
              <ProtectedRoute>
                <OutSourcedReport />
              </ProtectedRoute>
            }
            path="/outsourced"
          />
        </Route>
        <Route path="*" element={<Login />} />

        <Route element={<SignUp />} path="/signup" />
        <Route element={<Login />} path="/login" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
