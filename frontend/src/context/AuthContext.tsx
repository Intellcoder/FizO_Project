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
  id: string;
  email: string;
  name: string;
  username: string;
  locale: string;
  totalTask: number;
  totalSeconds: number;
  role: string;
};
type Team = {
  _id: string;
  email: string;
  name: string;
  locale: string;
  totalSeconds: number;
  role: string;
  status: "Active" | "Not Active";
};

type Report = {
  id: string;
  _id: string;
  date: Date;
  imageUrl: string;
  locale: string;
  name: string;
  workhour: string;
  isOutsourced: boolean;
  totalSeconds: number;
  accountOwner: {
    _id: string;
    email: string;
    name: string;
    role: "admin" | "user" | "client";
  };
  accountWorker: {
    _id: string;
    email: string;
    name: string;
    role: "admin" | "user" | "client";
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
  team: Team[];
  setUser: (user: User | null) => void;
  reports: Report[];
  totalTime: TotalProps | null;
  loading: boolean;
  progress: number;
  setTotalTime: (totals: TotalProps) => void;
  loadingReports: boolean;
  refreshReports: () => Promise<void>;
  refreshUser: () => Promise<void>;
  excelDownload: () => void;
  uploadReport: (
    file: File,
    options: any,
    onProgress: (percent: number) => void
  ) => Promise<void>;
  editReport: (id: string, updates: Partial<Report>) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;
  editProfile: (id: string, updates: Partial<Team>) => Promise<void>;
  refreshTeam: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  team: [],
  reports: [],
  totalTime: null,
  progress: 0,
  setTotalTime: async () => {},
  loading: true,
  loadingReports: false,
  excelDownload: async () => {},
  refreshReports: async () => {},
  refreshUser: async () => {},
  uploadReport: async () => {},
  editReport: async () => {},
  deleteReport: async () => {},
  deleteProfile: async () => {},
  editProfile: async () => {},
  refreshTeam: async () => {},
});
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [team, setTeam] = useState<Team[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingReports, setLoadingReports] = useState(false);
  const [totalTime, setTotalTime] = useState<TotalProps | null>(null);

  //fetch reports
  const fetchReports = async () => {
    try {
      setLoadingReports(true);
      const res = await api.get("/own-report");
      setReports(res.data || []);
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
      const res = await api.get(`/team`); // adjust route
      setTeam(res.data);
    } catch (error) {
      console.error("Failed to get team");
    }
  };

  //add new report
  const uploadReport = async (
    file: File,
    options?: { isOutsourced: boolean; acctOwnerName?: string },
    onProgress?: (percent: number) => void
  ) => {
    const formData = new FormData();
    formData.append("file", file);

    if (options?.isOutsourced !== undefined) {
      formData.append("isOutsourced", String(options.isOutsourced));
    }
    if (options?.acctOwnerName) {
      formData.append("acctOwnerName", options.acctOwnerName);
    }

    try {
      const res = await api.post("/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
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
  const editReport = async (id: string, updates: Partial<Report>) => {
    if (user?.role !== "admin") {
      toast.error("only admins can edit reports", { duration: 2000 });
      return;
    }
    try {
      const res = await api.patch(`/report${id}`, updates);
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, title: res.data.report } : r))
      );
      toast.success("Report updated successfully!", { duration: 2000 });
    } catch (error) {
      toast.error("Failed to update report", { duration: 2000 });
    }
  };

  //delete a report
  const deleteReport = async (id: string) => {
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
  const deleteProfile = async (id: string) => {
    try {
      const res = await api.delete(`/team/${id}`);
      toast.success(res.data.message || "UserProfile deleted");
    } catch (error) {
      toast.error("Failed to delete User");
    }
  };

  //delete user profile
  const editProfile = async (id: string, updates: Partial<Team>) => {
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
      window.open(
        "https://fizo-backend-api-v1.onrender.com/api/v1/report/summary",
        "_blank"
      );
      toast.success("Downloading...", { duration: 2000 });
    } catch (error) {
      toast.error("Failed to download excel report", { duration: 2000 });
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
        reports,
        loading,
        progress: 0,
        totalTime,
        setTotalTime,
        excelDownload,
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
