import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
  useState,
} from "react";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";
import Report from "../pages/ReportForm";
import { getUserFromLocalstorage } from "../utils/getUser";
import { type AxiosProgressEvent } from "axios";

type User = {
  id: number;
  email: string;
  name: string;
  username: string;
  locale: string;
  totalTask: number;
  totalSeconds: number;
  role: string;
};
type Payment = {
  totalPay: number;
  totalHours: number;
  account_name: string;
  account_number: string;
  bank: string;
};

type Account = {
  id: number;
  account_name: string;
  locale: string;
  ownerId: number;
};

type Assignment = {
  workerId: number;
  accountId: number;
  type: string;
  active: boolean;
  startedAt: string;
  endedAt: string;
  account: Account;
};

type Worker = {
  id: number;
  name: string;
  email: string;
  role: string;
  workerId: string;
  payment?: Payment;
  accounts?: Account[];
  assignments?: Assignment[];
};

type Report = {
  id: number;
  imageUrl: string;
  todaysHour: string;
  workHours: number;
  updatedAt: Date;
  submitter: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  account: {
    id: 1;
    account_name: string;
    locale: string;
  };
};

type TotalProps = {
  totalSeconds: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type AuthContextType = {
  user: User | null;
  team: Worker[];
  setUser: (user: User | null) => void;
  reports: Report[];
  myAccounts: Account[];
  totalTime: TotalProps | null;
  loading: boolean;
  progress: number;
  setTotalTime: (totals: TotalProps) => void;
  loadingReports: boolean;
  refreshReports: () => Promise<void>;
  refreshUser: () => Promise<void>;
  getMyAccounts: () => Promise<void>;
  excelDownload: () => void;
  workerExcel: () => void;
  uploadReport: (
    file: File,
    options: any,
    onProgress: (percent: number) => void,
  ) => Promise<void>;
  editReport: (id: number, updates: Partial<Report>) => Promise<void>;
  deleteReport: (id: number) => Promise<void>;
  deleteProfile: (id: number) => Promise<void>;
  editProfile: (id: number, updates: Partial<Worker>) => Promise<void>;
  refreshTeam: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  team: [],
  myAccounts: [],
  reports: [],
  totalTime: null,
  progress: 0,
  setTotalTime: async () => {},
  loading: true,
  loadingReports: false,
  excelDownload: async () => {},
  workerExcel: async () => {},
  refreshReports: async () => {},
  refreshUser: async () => {},
  getMyAccounts: async () => {},
  uploadReport: async () => {},
  editReport: async () => {},
  deleteReport: async () => {},
  deleteProfile: async () => {},
  editProfile: async () => {},
  refreshTeam: async () => {},
});
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [team, setTeam] = useState<Worker[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingReports, setLoadingReports] = useState(false);
  const [totalTime, setTotalTime] = useState<TotalProps | null>(null);
  const [myAccounts] = useState<Account[]>([]);
  //fetch reports
  const fetchReports = async () => {
    try {
      setLoadingReports(true);
      const res = await api.get("/own-report");
      setReports(res.data.reports || []);
      // refreshUser();
      setLoadingReports(false);
    } catch (error) {
      toast.error("Failed to fetch report");
    } finally {
      setLoadingReports(false);
    }
  };

  //Profile details
  const refreshUser = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/auth/me`); // adjust route
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (error) {
      console.error("Failed to refresh user");
    }
  };

  const fetchTeam = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/worker/profile`); // adjust route

      const teamData = Array.isArray(res.data) ? res.data : res.data || [];
      setTeam(teamData);
    } catch (error) {
      console.error("Failed to get team");
    }
  };

  const getMyAccounts = async () => {
    if (!user) return;
    try {
      //   const res = await api.get("/worker/myaccounts");
      // const myaccounts = Array.isArray(res.data) ? res.data : res.data || [];
      // setMyAccounts(myaccounts);
    } catch (error) {
      console.log("Failed to get accounts");
    }
  };

  //add new report
  const uploadReport = async (
    file: File,
    options?: {
      isOutsourced: boolean;
      acctOwnerName?: string;
      accountId: number;
      submitterId: number;
      workerId: number;
    },

    onProgress?: (percent: number) => void,
  ) => {
    const formData = new FormData();
    formData.append("file", file);

    if (options?.isOutsourced !== undefined) {
      formData.append("isOutsourced", String(options.isOutsourced));
    }
    if (options?.acctOwnerName) {
      formData.append("acctOwnerName", options.acctOwnerName);
    }
    formData.append("accountId", String(options?.accountId));
    formData.append("submitterId", String(options?.submitterId));
    formData.append("workerId", String(options?.workerId));

    try {
      const res = await api.post("/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );

            if (onProgress) {
              onProgress(percent);
            }
          }
        },
      });

      setTotalTime(res.data.totalSeconds || 0);
      toast.success(res.data.message || "Report uploaded successfully", {
        duration: 2000,
      });
      await refreshUser();
    } catch (error) {
      toast.error("File upload failed.Please try again", { duration: 2000 });
    }
  };

  //Edit Report (only admin can edit )
  const editReport = async (id: number, updates: Partial<Report>) => {
    if (user?.role !== "admin") {
      toast.error("Only admins can edit reports", { duration: 2000 });
      return;
    }

    try {
      const res = await api.patch(`/report/${id}`, updates);
      const updatedReport = res.data?.report || res.data;

      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updatedReport } : r)),
      );

      toast.success("Report updated successfully!", { duration: 2000 });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update report", { duration: 2000 });
    }
  };

  //delete a report
  const deleteReport = async (id: number) => {
    console.log(id);
    if (user?.role !== "admin") {
      toast.error("Only admins can delete reports", { duration: 2000 });
      return;
    }
    try {
      const res = await api.delete(`/report/${id}`);
      console.log(res.data.message);
      toast.success(res.data.message || "Report deleted", { duration: 2000 });
      refreshUser();
      fetchReports();
    } catch (error) {
      toast.error("Failed to delete report", { duration: 2000 });
    }
  };

  //delete user profile
  const deleteProfile = async (id: number) => {
    try {
      const res = await api.delete(`/worker/${id}`);
      toast.success(res.data.message || "UserProfile deleted");
    } catch (error) {
      toast.error("Failed to delete User");
    }
  };

  //delete user profile
  const editProfile = async (id: number, updates: Partial<Worker>) => {
    try {
      const res = await api.patch(`/team/${id}`, updates);
      toast.success(res.data.message || "UserProfile Updated successfully!");
    } catch (error: any) {
      const errorMsg = error.response?.data.message || "Failed to Update user";
      toast.error(errorMsg);
    }
  };

  //download excel worksheet

  const excelDownload = async () => {
    try {
      toast.loading("Preparing download...", { duration: 1500 });

      // Get auth token from your auth context or storage
      const token = localStorage.getItem("token"); // or however you store your token

      const response = await fetch(
        "http://localhost:4000/api/v1/report/summary?startDate=2024-01-01&endDate=2024-12-31",
        {
          method: "GET",
          headers: {
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            Authorization: `Bearer ${token}`, // Add auth header
          },
        },
      );

      console.log("passed 1.0");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Download failed");
      }
      console.log("passed 1.1");
      console.log("passed 2");
      // Get the blob
      const blob = await response.blob();

      if (blob.size === 0) {
        throw new Error("Empty file received");
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      console.log("passed 2");
      // Get filename from Content-Disposition header
      const disposition = response.headers.get("Content-Disposition");
      let filename =
        disposition?.split("filename=")[1]?.replace(/"/g, "") ??
        "summary_report.xlsx";

      if (disposition) {
        const filenameMatch = disposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
        );
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, "");
        }
      }
      console.log("passed 4");
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      console.log("passed 5");
      // Cleanup
      setTimeout(() => {
        a.remove();
        window.URL.revokeObjectURL(url);
      }, 100);

      toast.dismiss();
      toast.success("Download completed", { duration: 2000 });
    } catch (error: any) {
      console.error("Download error:", error);
      toast.dismiss();
      toast.error(error.message || "Failed to download excel report", {
        duration: 2000,
      });
    }
  };
  const workerExcel = async () => {
    try {
      toast.loading("Preparing download...", { duration: 1500 });

      // Get auth token from your auth context or storage
      const token = localStorage.getItem("token"); // or however you store your token

      const response = await fetch(
        "http://localhost:4000/api/v1/report/sheet?startDate=2024-01-01&endDate=2024-12-31",
        {
          method: "GET",
          headers: {
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            Authorization: `Bearer ${token}`, // Add auth header
          },
        },
      );

      console.log("passed 1.0");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Download failed");
      }
      console.log("passed 1.1");
      console.log("passed 2");
      // Get the blob
      const blob = await response.blob();

      if (blob.size === 0) {
        throw new Error("Empty file received");
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      console.log("passed 2");
      // Get filename from Content-Disposition header
      const disposition = response.headers.get("Content-Disposition");
      let filename =
        disposition?.split("filename=")[1]?.replace(/"/g, "") ??
        "summary_report.xlsx";

      if (disposition) {
        const filenameMatch = disposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
        );
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, "");
        }
      }
      console.log("passed 4");
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      console.log("passed 5");
      // Cleanup
      setTimeout(() => {
        a.remove();
        window.URL.revokeObjectURL(url);
      }, 100);

      toast.dismiss();
      toast.success("Download completed", { duration: 2000 });
    } catch (error: any) {
      console.error("Download error:", error);
      toast.dismiss();
      toast.error(error.message || "Failed to download excel report", {
        duration: 2000,
      });
    }
  };

  useEffect(() => {
    const storedUser = getUserFromLocalstorage();
    if (storedUser) {
      setUser(storedUser);
    }
    console.log(team);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      refreshUser();
      fetchReports();
      fetchTeam();
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        team,
        myAccounts,
        getMyAccounts,
        reports,
        loading,
        progress: 0,
        totalTime,
        setTotalTime,
        excelDownload,
        workerExcel,
        loadingReports,
        refreshReports: fetchReports,
        refreshUser,
        uploadReport,
        editReport,
        deleteReport,
        deleteProfile,
        editProfile,
        refreshTeam: fetchTeam,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
