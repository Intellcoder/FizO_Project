import { useAuth } from "../context/AuthContext";
import DataTable from "../components/DataTable";
import Loader from "../components/Loader";

const Dashboard = () => {
  const { loadingReports } = useAuth();

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

  return (
    <div className="p-2">
      <div>
        <DataTable />
      </div>
    </div>
  );
};

export default Dashboard;
