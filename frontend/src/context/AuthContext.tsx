import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
  useState,
} from "react";
import api from "../api/axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import Report from "../pages/Report";
import { getUserFromLocalstorage } from "../utils/getUser";
import { type AxiosProgressEvent } from "axios";

type User = {
  id: string;
  email: string;
  name: string;
  username: string;
  locale: string;
  totalSeconds: number;
  role: string;
};
type Team = {
  id: string;
  email: string;
  name: string;
  locale: string;
  totalSeconds: number;
  role: string;
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
  excelDownload: () => void;
  uploadReport: (
    file: File,
    options: any,
    onProgress: (percent: number) => void
  ) => Promise<void>;
  editReport: (id: string, updates: Partial<Report>) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
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
  uploadReport: async () => {},
  editReport: async () => {},
  deleteReport: async () => {},
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
      setTotalTime(res.data.totalSeconds || 0);
      setLoadingReports(false);
    } catch (error) {
      toast.error("Failed to fetch report");
    } finally {
      setLoadingReports(false);
    }
  };

  //get userProlfe
  const getUserProfile = async () => {
    try {
      const res = await api.get(`/team`);
      setTeam(res.data || null);
    } catch (error) {
      //toast.error("failed to fetch profile");
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
      toast.success(res.data.message || "Report uploaded successfully");
    } catch (error) {
      toast.error("File upload failed.Please try again");
    }
  };

  //Edit Report (only admin can edit )
  const editReport = async (id: string, updates: Partial<Report>) => {
    if (user?.role !== "admin") {
      toast.error("only admins can edit reports");
      return;
    }
    try {
      const res = await api.patch(`/report${id}`, updates);
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, title: res.data.report } : r))
      );
      toast.success("Report updated successfully!");
    } catch (error) {
      toast.error("Failed to update report");
    }
  };

  //delete a report
  const deleteReport = async (id: string) => {
    if (user?.role !== "admin") {
      toast.error("Only admins can delete reports");
      return;
    }
    try {
      await api.delete(`/report/${id}`);
      toast.success("Report deleted successfully!");
      fetchReports();
    } catch (error) {
      toast.error("Failed to delete report");
    }
  };

  //download excel worksheet
  const excelDownload = async () => {
    try {
      window.open("https://your-backend/api/v1/reports/summary", "_blank");
      toast.success("Downloading...");
    } catch (error) {
      toast.error("Failed to download excel report");
    }
  };
  useEffect(() => {
    const storedUser = getUserFromLocalstorage();
    if (storedUser) {
      setUser(storedUser);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      getUserProfile();
      fetchReports();
      console.log(reports);
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
        uploadReport,
        editReport,
        deleteReport,
      }}
    >
      <Toaster position="top-center" reverseOrder={false} />
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
