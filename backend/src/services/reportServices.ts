import Report from "../database/models/report.model";
import { appendToAdminExcel, appendToWorkerExcel } from "../utils/excellogger";

interface LogReportParams {
  accountOwner: string;
  accountWorker: string;
  accountWorkerName: string;
  name: string;
  rawText: string;
  locale: string;
  workhour: string | null;
  totalSeconds: number;
  isOutsourced: boolean;
  imageUrl: string;
  date: Date;
}
export async function logReport({
  accountOwner,
  accountWorker,
  accountWorkerName,
  isOutsourced,
  name,
  locale,
  rawText,
  workhour,
  totalSeconds,
  imageUrl,
  date,
}: LogReportParams) {
  const report = await Report.create({
    accountOwner,
    accountWorker,
    accountWorkerName,
    isOutsourced,
    name,
    rawText,
    locale,
    workhour,
    totalSeconds,
    imageUrl,
    date,
  });

  //log to worker worksheet
  // await appendToWorkerExcel({
  //   userId,
  //   date,
  //   name,
  //   locale,
  //   workhour: workhour ?? "",
  //   totalSeconds,
  // });

  // //log to admin worksheet
  // await appendToAdminExcel({
  //   userId,
  //   date,
  //   name,
  //   locale,
  //   workhour: workhour ?? "",
  //   totalSeconds,
  // });

  return report.toObject();
}

export async function getReports(accountOwner: string) {
  return await Report.find({ accountOwner })
    .populate("accountOwner", "name email local role")
    .populate("accountWorker", "name email local role")
    .sort({ createdAt: -1 });
}

export async function getAllReport() {
  return await Report.find()
    .populate("accountOwner", "name email locale role")
    .populate("accountWorker", "name email locale role")
    .sort({ createdAt: -1 });
}

export async function deleteReportByAdmin(id: string) {
  return await Report.findByIdAndDelete(id);
}

export async function updateReportByAdmin(
  id: string,
  updateData: Partial<any>
) {
  return await Report.findByIdAndUpdate(id, updateData, { new: true });
}
