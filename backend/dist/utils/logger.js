"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcelService = void 0;
const exceljs_1 = __importDefault(require("exceljs"));
const reports_model_1 = require("../database/models/reports.model");
const account_model_1 = require("../database/models/account.model");
const sequelize_1 = require("sequelize");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class ExcelService {
    async generateMasterSheet(options) {
        try {
            const reports = await reports_model_1.Report.findAll({
                include: [
                    {
                        model: account_model_1.Account,
                        as: "workerAccount",
                        attributes: ["id", "account_name", "locale"],
                        required: true,
                    },
                ],
                order: [["workDate", "ASC"]],
            });
            if (!reports.length)
                throw new Error("No reports found");
            const formatTime = (totalSeconds) => {
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;
                return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
            };
            const workerMap = new Map();
            reports.forEach((r) => {
                console.log("WorkMap", workerMap);
                const worker = r.workerAccount;
                if (!worker)
                    return;
                if (!workerMap.has(worker.id)) {
                    workerMap.set(worker.id, {
                        name: worker.account_name,
                        hours: [],
                    });
                }
                workerMap.get(worker.id).hours.push(r.workHours);
            });
            const workers = Array.from(workerMap.values());
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet("Master Work Hours");
            const titleRow = worksheet.addRow(["Work Hours Report (All Records)"]);
            titleRow.font = { bold: true, size: 14 };
            worksheet.mergeCells(1, 1, 1, workers.length);
            worksheet.addRow([]);
            const headerRow = worksheet.addRow(workers.map((w) => w.name));
            headerRow.font = { bold: true };
            headerRow.alignment = { horizontal: "center" };
            headerRow.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF0070C0" },
            };
            headerRow.eachCell((c) => {
                c.font = { bold: true, color: { argb: "FFFFFFFF" } };
            });
            const maxRows = Math.max(...workers.map((w) => w.hours.length));
            for (let i = 0; i < maxRows; i++) {
                const row = workers.map((w) => w.hours[i] ? formatTime(w.hours[i]) : "");
                worksheet.addRow(row);
            }
            worksheet.addRow([]);
            const totals = workers.map((w) => {
                const totalSeconds = w.hours.reduce((sum, h) => sum + h, 0);
                return formatTime(totalSeconds);
            });
            const totalRow = worksheet.addRow(totals);
            totalRow.font = { bold: true };
            totalRow.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFFF00" },
            };
            const avgRow = worksheet.addRow(workers.map((w) => {
                const avgSeconds = w.hours.length
                    ? w.hours.reduce((a, b) => a + b, 0) / w.hours.length
                    : 0;
                return formatTime(Math.round(avgSeconds));
            }));
            avgRow.font = { italic: true };
            worksheet.eachRow((row) => {
                row.eachCell((cell) => {
                    cell.alignment = { horizontal: "center" };
                });
            });
            worksheet.columns.forEach((col) => {
                if (!col || !col.eachCell)
                    return;
                let max = 10;
                col === null || col === void 0 ? void 0 : col.eachCell({ includeEmpty: true }, (cell) => {
                    const len = cell.value ? cell.value.toString().length : 10;
                    if (len > max)
                        max = len;
                });
                col.width = max + 3;
            });
            const reportsDir = path_1.default.join(process.cwd(), "reports");
            if (!fs_1.default.existsSync(reportsDir))
                fs_1.default.mkdirSync(reportsDir, { recursive: true });
            console.log("passed here w");
            const filepath = path_1.default.join(reportsDir, "master_sheet.xlsx");
            await workbook.xlsx.writeFile(filepath);
            console.log("Passed here");
            return filepath;
        }
        catch (error) {
            console.error("Excel generation error:", error);
            throw error;
        }
    }
    async generateWorkerReport(workerAccountId, startDate, endDate) {
        var _a;
        try {
            const reports = await reports_model_1.Report.findAll({
                where: {
                    workerId: workerAccountId,
                    workDate: {
                        [sequelize_1.Op.between]: [startDate, endDate],
                    },
                },
                include: [
                    {
                        model: account_model_1.Account,
                        as: "workerAccount",
                        attributes: ["id", "account_name", "locale"],
                    },
                ],
                order: [["workDate", "ASC"]],
            });
            if (reports.length === 0) {
                throw new Error("No reports found for this worker in the specified date range");
            }
            const formatTime = (totalSeconds) => {
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;
                return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
            };
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet("My Work Hours");
            const workerAccountName = ((_a = reports[0].workerAccount) === null || _a === void 0 ? void 0 : _a.account_name) || "Worker";
            const titleRow = worksheet.addRow([
                `Work Hours Report - ${workerAccountName}`,
            ]);
            titleRow.font = { size: 14, bold: true };
            worksheet.mergeCells(1, 1, 1, 1);
            const periodRow = worksheet.addRow([
                `Period: ${startDate} to ${endDate}`,
            ]);
            periodRow.font = { italic: true };
            worksheet.addRow([]);
            const headerRow = worksheet.addRow([workerAccountName]);
            headerRow.font = { bold: true };
            headerRow.alignment = { horizontal: "center" };
            headerRow.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF0070C0" },
            };
            headerRow.getCell(1).font = {
                bold: true,
                color: { argb: "FFFFFFFF" },
            };
            let totalSeconds = 0;
            let approvedSeconds = 0;
            let pendingSeconds = 0;
            let rejectedSeconds = 0;
            reports.forEach((report) => {
                const hoursInSeconds = report.workHours;
                const row = worksheet.addRow([formatTime(hoursInSeconds)]);
                const cell = row.getCell(1);
                if (report.status === "approved") {
                    cell.font = { color: { argb: "FF00B050" } };
                    approvedSeconds += hoursInSeconds;
                }
                else if (report.status === "rejected") {
                    cell.font = { color: { argb: "FFFF0000" } };
                    rejectedSeconds += hoursInSeconds;
                }
                else {
                    cell.font = { color: { argb: "FFFFC000" } };
                    pendingSeconds += hoursInSeconds;
                }
                cell.alignment = { horizontal: "center" };
                totalSeconds += hoursInSeconds;
            });
            worksheet.addRow([]);
            const totalRow = worksheet.addRow([formatTime(totalSeconds)]);
            totalRow.font = { bold: true };
            totalRow.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFFF00" },
            };
            totalRow.getCell(1).alignment = { horizontal: "center" };
            const avgSeconds = reports.length
                ? Math.round(totalSeconds / reports.length)
                : 0;
            const avgRow = worksheet.addRow([formatTime(avgSeconds)]);
            avgRow.font = { italic: true };
            avgRow.getCell(1).alignment = { horizontal: "center" };
            worksheet.addRow([]);
            worksheet.addRow(["Summary"]).font = { bold: true, underline: true };
            worksheet.addRow([`Total Reports: ${reports.length}`]);
            worksheet.addRow([`Approved: ${formatTime(approvedSeconds)}`]);
            worksheet.addRow([`Pending: ${formatTime(pendingSeconds)}`]);
            worksheet.addRow([`Rejected: ${formatTime(rejectedSeconds)}`]);
            worksheet.columns.forEach((column) => {
                var _a;
                let maxLength = 10;
                (_a = column.eachCell) === null || _a === void 0 ? void 0 : _a.call(column, { includeEmpty: true }, (cell) => {
                    const length = cell.value ? cell.value.toString().length : 10;
                    maxLength = Math.max(maxLength, length);
                });
                column.width = Math.min(maxLength + 3, 30);
            });
            const reportsDir = path_1.default.join(process.cwd(), "reports");
            if (!fs_1.default.existsSync(reportsDir)) {
                fs_1.default.mkdirSync(reportsDir, { recursive: true });
            }
            const filename = `worker_report_${workerAccountId}_${Date.now()}.xlsx`;
            const filepath = path_1.default.join(reportsDir, filename);
            await workbook.xlsx.writeFile(filepath);
            return filepath;
        }
        catch (error) {
            console.error("Worker report generation error:", error);
            throw error;
        }
    }
    async generateSummaryReport(ownerId, startDate, endDate) {
        try {
            const { sequelize } = reports_model_1.Report;
            const ownerAccounts = await account_model_1.Account.findAll({
                where: { ownerId },
                attributes: ["id"],
                raw: true,
            });
            const accountIds = ownerAccounts.map((acc) => acc.id);
            if (accountIds.length === 0) {
                throw new Error("No accounts found for this owner");
            }
            const summary = await reports_model_1.Report.findAll({
                attributes: [
                    "status",
                    [sequelize.fn("COUNT", sequelize.col("Report.id")), "count"],
                    [sequelize.fn("SUM", sequelize.col("workHours")), "totalHours"],
                    [sequelize.fn("AVG", sequelize.col("workHours")), "avgHours"],
                ],
                where: {
                    accountId: {
                        [sequelize_1.Op.in]: accountIds,
                    },
                    workDate: {
                        [sequelize_1.Op.between]: [startDate, endDate],
                    },
                },
                group: ["status"],
                raw: true,
            });
            const workerBreakdown = await reports_model_1.Report.findAll({
                attributes: [
                    "workerId",
                    [sequelize.fn("COUNT", sequelize === null || sequelize === void 0 ? void 0 : sequelize.col("Report.id")), "reportCount"],
                    [sequelize.fn("SUM", sequelize === null || sequelize === void 0 ? void 0 : sequelize.col("workHours")), "totalHours"],
                ],
                where: {
                    accountId: {
                        [sequelize_1.Op.in]: accountIds,
                    },
                    workDate: {
                        [sequelize_1.Op.between]: [startDate, endDate],
                    },
                    status: "approved",
                },
                include: [
                    {
                        model: account_model_1.Account,
                        as: "workerAccount",
                        attributes: ["account_name", "locale"],
                    },
                ],
                group: ["workerId", "workerAccount.id"],
                order: [[sequelize.literal("totalHours"), "DESC"]],
                raw: true,
                nest: true,
            });
            const workbook = new exceljs_1.default.Workbook();
            const summarySheet = workbook.addWorksheet("Summary");
            summarySheet.addRow([`Summary Report: ${startDate} to ${endDate}`]);
            summarySheet.addRow([]);
            summarySheet.addRow(["Status", "Count", "Total Hours", "Average Hours"]);
            summary.forEach((item) => {
                summarySheet.addRow([
                    item.status.toUpperCase(),
                    item.count,
                    parseFloat(item.totalHours || 0),
                    parseFloat(item.avgHours || 0),
                ]);
            });
            const workerSheet = workbook.addWorksheet("Worker Breakdown");
            workerSheet.addRow([
                "Worker Account",
                "Locale",
                "Total Reports",
                "Total Hours",
            ]);
            workerBreakdown.forEach((item) => {
                workerSheet.addRow([
                    item.workerAccount.account_name,
                    item.workerAccount.locale,
                    item.reportCount,
                    parseFloat(item.totalHours || 0),
                ]);
            });
            const reportsDir = path_1.default.join(process.cwd(), "reports");
            if (!fs_1.default.existsSync(reportsDir)) {
                fs_1.default.mkdirSync(reportsDir, { recursive: true });
            }
            const filename = `summary_report_owner${ownerId}_${Date.now()}.xlsx`;
            const filepath = path_1.default.join(reportsDir, filename);
            await workbook.xlsx.writeFile(filepath);
            return filepath;
        }
        catch (error) {
            console.error("Summary report generation error:", error);
            throw error;
        }
    }
    async cleanupOldReports(olderThanDays = 7) {
        const reportsDir = path_1.default.join(process.cwd(), "reports");
        if (!fs_1.default.existsSync(reportsDir))
            return;
        const files = fs_1.default.readdirSync(reportsDir);
        const now = Date.now();
        const maxAge = olderThanDays * 24 * 60 * 60 * 1000;
        files.forEach((file) => {
            const filepath = path_1.default.join(reportsDir, file);
            try {
                const stats = fs_1.default.statSync(filepath);
                const age = now - stats.mtimeMs;
                if (age > maxAge) {
                    fs_1.default.unlinkSync(filepath);
                    console.log(`Deleted old report: ${file}`);
                }
            }
            catch (error) {
                console.error(`Error processing file ${file}:`, error);
            }
        });
    }
}
exports.ExcelService = ExcelService;
//# sourceMappingURL=logger.js.map