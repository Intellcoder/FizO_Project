import { FaCloudDownloadAlt } from "react-icons/fa";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";

interface FileWithPreview {
  file: File;
  preview: string;
}

const Report = () => {
  const { uploadReport, refreshReports } = useAuth();
  const Navigate = useNavigate();
  const [file, setFile] = useState<FileWithPreview | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsprocessing] = useState(false);

  //maximum size of file
  const MAX_FILE_SIZE = 10;

  const handleFiles = (selectedFileList: FileList | null): void => {
    if (!selectedFileList || selectedFileList.length === 0) return;
    const selectedFile = selectedFileList[0];

    //validate filesize

    if (selectedFile.size / 1024 / 1024 > MAX_FILE_SIZE) {
      toast.error(
        `File is too LargestContentfulPaint.Max size is ${MAX_FILE_SIZE}`
      );

      return;
    }

    //create vile preview
    const preview = URL.createObjectURL(selectedFile);
    const fileObj: FileWithPreview = { file: selectedFile, preview };

    setFile(fileObj);
    setProgress(0);
    UploadFile(selectedFile);
  };

  const UploadFile = async (uploadFile: File) => {
    setIsprocessing(true);

    await uploadReport(uploadFile, { isOutsourced: false }, (percent: number) =>
      setProgress(percent)
    );

    //Processing finished
    setIsprocessing(false);

    setFile(null);

    // Wait 2.5s before redirect
    setTimeout(() => {
      Navigate("/dashboard");
    }, 3000);
    refreshReports();
  };

  return (
    <div className=" mt-3 mb-6">
      {/*drop area*/}
      <Toaster position="top-center" reverseOrder={false} />
      <div></div>
      <div
        className={`flex flex-col items-center border-dashed border-2 border-solid-blue bg-light-gray py-4 pb-4 mt-3 rounded-lg w-full cursor-pointer ${
          isDragOver ? "border-blue-800 bg-blue-50" : "border-blue-600"
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
          <FaCloudDownloadAlt className="text-[60px] text-solid-blue" />
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
      <div className="mt-4 flex items-center justify-evenly">
        <button
          onClick={() => document.getElementById("fileInput")?.click()}
          className="text-white text-center text-xl bg-solid-blue rounded-lg px-6 py-2 cursor-pointer"
        >
          Click to Upload Image
        </button>
        <Link
          to={"/outsourced"}
          className="text-blue text-xl text-bold ml-2 text-center border-2 rounded-lg cursor-pointer px-6 py-2 text-solid-blue"
        >
          OutSourced Account
        </Link>
      </div>

      {/*preview file*/}
      {file && (
        <div className="mt-1 border rounded-lg p-3 flex items-cnter gap-4">
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

      {/*Processing Loader*/}
      {isProcessing && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm  z-50">
          <Loader type="dots" color="#ef4444" size={100} speed={0.6} />
          <h1 className="text-4xl text-red-500 font-medium">
            Please Wait while we Process your report.....
          </h1>
        </div>
      )}
    </div>
  );
};

export default Report;
