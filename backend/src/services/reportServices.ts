// import { Report } from "../database/models/reports.model";
// import { appendToAdminExcel, appendToWorkerExcel } from "../utils/excellogger";

// interface LogReportParams {
//   accountId: number;
//   workerId: number;
//   submitterId: number;
//   imageUrl: string;
//   workHours: number;
// }
// export async function logReport({accountId,workerId,workHours,submitterId,imageUrl}: LogReportParams) {
//   const report = await Report.create({
//     accountId,
//     workerId,
//     workHours,
//     submitterId,
//     imageUrl,
//   });

//   //log to worker worksheet
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

//   return report.toObject();
// }

// export async function getReports(accountOwner: string) {
//   return await Report.find({ accountOwner })
//     .populate("accountOwner", "name email locale role")
//     .populate("accountWorker", "name email locale role")
//     .sort({ createdAt: -1 });
// }

// export async function getAllReport() {
//   return await Report.find()
//     .populate("accountOwner", "name email locale role")
//     .populate("accountWorker", "name email locale role")
//     .sort({ createdAt: -1 });
// }

// export async function deleteReportByAdmin(id: string) {
//   return await Report.findByIdAndDelete(id);
// }

// export async function updateReportByAdmin(
//   id: string,
//   updateData: Partial<any>
// // ) {
// //   return await Report.findByIdAndUpdate(id, updateData, { new: true });
// // }
