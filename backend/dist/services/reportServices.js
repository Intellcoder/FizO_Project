"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logReport = logReport;
exports.getReports = getReports;
exports.getAllReport = getAllReport;
exports.deleteReportByAdmin = deleteReportByAdmin;
exports.updateReportByAdmin = updateReportByAdmin;
const report_model_1 = __importDefault(require("../database/models/report.model"));
async function logReport({ accountOwner, accountWorker, accountWorkerName, isOutsourced, name, locale, rawText, workhour, totalSeconds, imageUrl, date, }) {
    const report = await report_model_1.default.create({
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
    return report.toObject();
}
async function getReports(accountOwner) {
    return await report_model_1.default.find({ accountOwner })
        .populate("accountOwner", "name email locale role")
        .populate("accountWorker", "name email locale role")
        .sort({ createdAt: -1 });
}
async function getAllReport() {
    return await report_model_1.default.find()
        .populate("accountOwner", "name email locale role")
        .populate("accountWorker", "name email locale role")
        .sort({ createdAt: -1 });
}
async function deleteReportByAdmin(id) {
    return await report_model_1.default.findByIdAndDelete(id);
}
async function updateReportByAdmin(id, updateData) {
    return await report_model_1.default.findByIdAndUpdate(id, updateData, { new: true });
}
//# sourceMappingURL=reportServices.js.map