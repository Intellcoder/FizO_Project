"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupOldFiles = exports.getAvailableDateRanges = exports.downloadSummaryReport = exports.downloadWorkerReport = exports.downloadMasterSheet = void 0;
const logger_1 = require("../utils/logger");
const reports_model_1 = require("../database/models/reports.model");
const account_model_1 = require("../database/models/account.model");
const db_1 = require("../database/config/db");
const sequelize_1 = require("sequelize");
const fs_1 = __importDefault(require("fs"));
const excelService = new logger_1.ExcelService();
const downloadMasterSheet = async (req, res) => {
    try {
        const filepath = await excelService.generateMasterSheet({
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            status: req.query.status,
        });
        if (!fs_1.default.existsSync(filepath)) {
            return res.status(500).json({ error: "File was not generated" });
        }
        const filename = "master_work_hours.xlsx";
        const stat = fs_1.default.statSync(filepath);
        res.status(200);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader("Content-Length", stat.size);
        res.setHeader("Access-Control-Expose-Headers", "Content-Disposition, Content-Length");
        const stream = fs_1.default.createReadStream(filepath);
        stream.pipe(res);
        stream.on("end", () => {
            fs_1.default.unlink(filepath, () => { });
        });
        stream.on("error", (err) => {
            console.error("Stream error:", err);
            if (!res.headersSent)
                res.status(500).end();
        });
    }
    catch (error) {
        console.error("Download master sheet error:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: error.message });
        }
    }
};
exports.downloadMasterSheet = downloadMasterSheet;
const downloadWorkerReport = async (req, res) => {
    try {
        const workerAccountId = req.user.id;
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({
                error: "Start date and end date are required",
            });
        }
        if (!workerAccountId) {
            return res.status(400).json({
                error: "Worker Account ID is required",
            });
        }
        console.log("workerId:", workerAccountId);
        const filepath = await excelService.generateWorkerReport(parseInt(workerAccountId), startDate, endDate);
        const filename = `worker_report_${workerAccountId}_${startDate}_to_${endDate}.xlsx`;
        res.download(filepath, filename, (err) => {
            if (err) {
                console.error("Download error:", err);
            }
            setTimeout(() => {
                try {
                    if (fs_1.default.existsSync(filepath)) {
                        fs_1.default.unlinkSync(filepath);
                    }
                }
                catch (unlinkErr) {
                    console.error("Error deleting temp file:", unlinkErr);
                }
            }, 1000);
        });
    }
    catch (error) {
        console.error("Download worker report error:", error);
        res.status(500).json({
            error: "Failed to generate worker report",
            details: error.message,
        });
    }
};
exports.downloadWorkerReport = downloadWorkerReport;
const downloadSummaryReport = async (req, res) => {
    var _a, _b;
    try {
        const { startDate, endDate } = req.query;
        const ownerId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.workerId);
        if (!startDate || !endDate) {
            return res.status(400).json({
                error: "Start date and end date are required",
            });
        }
        if (!ownerId) {
            return res.status(401).json({
                error: "User not authenticated",
            });
        }
        const filepath = await excelService.generateSummaryReport(ownerId, startDate, endDate);
        if (!fs_1.default.existsSync(filepath)) {
            return res.status(500).json({ error: "File was not generated" });
        }
        const filename = `summary_report_${startDate}_to_${endDate}.xlsx`;
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader("Content-Length", fs_1.default.statSync(filepath).size);
        const stream = fs_1.default.createReadStream(filepath);
        stream.on("error", (err) => {
            console.error("Stream error:", err);
            if (!res.headersSent) {
                res.status(500).json({ error: "Failed to stream file" });
            }
        });
        stream.pipe(res);
        res.on("finish", () => {
            setTimeout(() => {
                try {
                    if (fs_1.default.existsSync(filepath)) {
                        fs_1.default.unlinkSync(filepath);
                    }
                }
                catch (unlinkErr) {
                    console.error("Error deleting temp file:", unlinkErr);
                }
            }, 2000);
        });
    }
    catch (error) {
        console.error("Download summary report error:", error);
        if (!res.headersSent) {
            res.status(500).json({
                error: "Failed to generate summary report",
                details: error.message,
            });
        }
    }
};
exports.downloadSummaryReport = downloadSummaryReport;
const getAvailableDateRanges = async (req, res) => {
    var _a, _b;
    try {
        const ownerId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.workerId);
        const ownerAccounts = await account_model_1.Account.findAll({
            where: { ownerId },
            attributes: ["id"],
            raw: true,
        });
        const accountIds = ownerAccounts.map((acc) => acc.id);
        if (accountIds.length === 0) {
            return res.json({
                minDate: null,
                maxDate: null,
                totalReports: 0,
                message: "No accounts found",
            });
        }
        const result = await reports_model_1.Report.findOne({
            attributes: [
                [db_1.sequelize.fn("MIN", db_1.sequelize.col("workDate")), "minDate"],
                [db_1.sequelize.fn("MAX", db_1.sequelize.col("workDate")), "maxDate"],
                [db_1.sequelize.fn("COUNT", db_1.sequelize.col("id")), "totalReports"],
            ],
            where: {
                accountId: {
                    [sequelize_1.Op.in]: accountIds,
                },
            },
            raw: true,
        });
        if (!result || !result.totalReports) {
            return res.json({
                minDate: null,
                maxDate: null,
                totalReports: 0,
                message: "No reports available",
            });
        }
        res.json({
            minDate: result.minDate,
            maxDate: result.maxDate,
            totalReports: result.totalReports,
        });
    }
    catch (error) {
        console.error("Get date ranges error:", error);
        res.status(500).json({ error: "Failed to fetch date ranges" });
    }
};
exports.getAvailableDateRanges = getAvailableDateRanges;
const cleanupOldFiles = async (req, res) => {
    try {
        const { days } = req.query;
        const olderThanDays = days ? parseInt(days) : 7;
        await excelService.cleanupOldReports(olderThanDays);
        res.json({
            message: `Successfully cleaned up reports older than ${olderThanDays} days`,
        });
    }
    catch (error) {
        console.error("Cleanup error:", error);
        res.status(500).json({ error: "Failed to cleanup old files" });
    }
};
exports.cleanupOldFiles = cleanupOldFiles;
//# sourceMappingURL=excel.controller.js.map