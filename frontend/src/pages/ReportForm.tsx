import { FaCloudDownloadAlt } from "react-icons/fa";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosInstance";

interface FileWithPreview {
  file: File;
  preview: string;
}

interface Account {
  id: number;
  account_name: string;
}

const MAX_FILE_SIZE = 10; // MB

const Report = () => {
  const { uploadReport, refreshReports, refreshUser, user } = useAuth();
  const navigate = useNavigate();

  const [file, setFile] = useState<FileWithPreview | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<number | "">("");

  console.log(user?.id);
  // ✅ Fetch accounts only once, even if component re-renders
  useEffect(() => {
    let isMounted = true;

    const getMyAccounts = async () => {
      try {
        console.log("Fetching accounts...");
        const res = await api.get("/worker/myaccounts");
        if (isMounted) {
          const myaccounts = Array.isArray(res.data) ? res.data : [];
          setAccounts(myaccounts);
        }
      } catch (error) {
        console.error("Failed to get accounts", error);
      }
    };

    getMyAccounts();
    return () => {
      isMounted = false;
    };
  }, []);

  // ✅ Handle file selection safely
  const handleFiles = useCallback(
    (selectedFileList: FileList | null): void => {
      if (!selectedFileList || selectedFileList.length === 0) return;
      const selectedFile = selectedFileList[0];

      // Validate file size
      if (selectedFile.size / 1024 / 1024 > MAX_FILE_SIZE) {
        toast.error(`File too large. Max size is ${MAX_FILE_SIZE}MB`, {
          duration: 2000,
        });
        return;
      }

      if (!selectedAccountId) {
        toast.error("Please select an account before uploading");
        return;
      }

      const preview = URL.createObjectURL(selectedFile);
      const fileObj: FileWithPreview = { file: selectedFile, preview };
      setFile(fileObj);
      setProgress(0);
      uploadFile(selectedFile);
    },
    [selectedAccountId]
  );

  // ✅ Upload file
  const uploadFile = useCallback(
    async (uploadFile: File) => {
      if (!selectedAccountId || !user) return;

      setIsProcessing(true);

      try {
        await uploadReport(
          uploadFile,
          {
            isOutsourced: false,
            accountId: selectedAccountId,
            submitterId: Number(user.id),
            acctOwnerName:
              accounts.find((a) => a.id === selectedAccountId)?.account_name ||
              "",
            workerId: Number(user.id),
          },
          (percent: number) => setProgress(percent)
        );

        toast.success("Report uploaded successfully");

        // ✅ Reset UI
        setFile(null);
        setProgress(0);
        setIsProcessing(false);

        // ✅ Trigger updates (optional small delay)
        setTimeout(() => {
          refreshUser();
          refreshReports();
          navigate("/report");
        }, 1000);
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error("Upload failed");
        setIsProcessing(false);
      }
    },
    [
      selectedAccountId,
      user,
      accounts,
      refreshUser,
      refreshReports,
      navigate,
      uploadReport,
    ]
  );

  // ✅ Log accounts only when they change
  useEffect(() => {
    console.log("Accounts changed:", accounts);
  }, [accounts]);

  return (
    <div className="mt-3 mb-6">
      {/* Account selection */}
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">
          Select Account:
        </label>
        <select
          value={selectedAccountId}
          onChange={(e) => setSelectedAccountId(Number(e.target.value) || "")}
          className="border rounded-md px-3 py-2 w-full text-lg"
        >
          <option value="">-- Select an account --</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.account_name}
            </option>
          ))}
        </select>
      </div>

      {/* Drop area */}
      <div
        className={`flex flex-col items-center border-dashed border-2 py-4 mt-3 rounded-lg w-full cursor-pointer transition ${
          isDragOver
            ? "border-primary bg-blue-50"
            : "border-blue-600 bg-light-gray"
        }`}
        onClick={() => document.getElementById("fileInput")?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        <h1 className="text-2xl font-medium">Upload File</h1>
        <div className="flex flex-col items-center">
          <FaCloudDownloadAlt className="text-[60px] text-primary" />
          <h1 className="mt-2 mb-2 text-xl">Drag and Drop Image here</h1>
        </div>
        <input
          type="file"
          name="fileinput"
          id="fileInput"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex items-center justify-evenly">
        <button
          onClick={() => document.getElementById("fileInput")?.click()}
          className="text-white text-center text-xl bg-primary rounded-lg px-6 py-2 cursor-pointer"
        >
          Click to Upload Image
        </button>
        <Link
          to={"/outsourced"}
          className="text-xl text-bold ml-2 text-center border-2 rounded-lg cursor-pointer px-6 py-2 text-primary"
        >
          OutSourced Account
        </Link>
      </div>

      {/* File preview */}
      {file && (
        <div className="mt-1 border rounded-lg p-3 flex items-center gap-4">
          <img
            src={file.preview}
            alt={file.file.name}
            className="w-16 h-16 object-cover rounded-md"
          />
          <div className="flex-1">
            <p className="text-sm font-medium">{file.file.name}</p>
            <div className="w-full bg-gray-200 rounded-full transition-all">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{progress}%</p>
          </div>
        </div>
      )}

      {/* Loader */}
      {isProcessing && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <Loader type="dots" color="#ef4444" size={100} speed={0.6} />
          <h1 className="text-4xl text-white font-medium mt-4">
            Please wait while we process your report...
          </h1>
        </div>
      )}
    </div>
  );
};

// ✅ Prevent unnecessary re-renders
export default Report;
