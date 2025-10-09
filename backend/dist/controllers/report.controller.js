"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReport = exports.removeReport = exports.getMyReports = exports.fetchReports = exports.submitReport = void 0;
const ocrServices_1 = require("../services/ocrServices");
const imageResizeService_1 = __importDefault(require("../services/imageResizeService"));
const reportServices_1 = require("../services/reportServices");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const updateWorkerTime_1 = require("../services/updateWorkerTime");
const imageKit_1 = __importDefault(require("../utils/imageKit"));
const authServices_1 = require("../services/authServices");
const authServices = new authServices_1.AuthServices();
const submitReport = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "please upload screenshoot/image",
            });
        }
        const user = req.user;
        let { isOutsourced, acctOwnerName } = req.body;
        isOutsourced =
            isOutsourced === true ||
                isOutsourced === "true" ||
                isOutsourced === 1 ||
                isOutsourced === "1";
        const filePath = path_1.default.resolve(req.file.path);
        const uploadResult = await imageKit_1.default.upload({
            file: fs_1.default.readFileSync(filePath),
            fileName: `${user._id}_${Date.now()}_${req.file.originalname}`,
            folder: "/reports",
        });
        const cloudUrl = uploadResult.url;
        const croppedPath = filePath.replace(/(\.[\w\d_-]+)$/i, "_cropped$1");
        if (!fs_1.default.existsSync(filePath)) {
            return res.status(400).json({
                message: "uploaded file not found",
            });
        }
        const imagePath = await (0, imageResizeService_1.default)(filePath, croppedPath);
        if (!imagePath || !fs_1.default.existsSync(imagePath)) {
            fs_1.default.unlink(filePath, () => { });
            return res.status(400).json({
                message: "No black panel detected in image",
            });
        }
        let accountOwnerId;
        let accountWorkerId;
        let accountWorkerName;
        let accountOwnerName;
        let accountOwnerLocale;
        let payForToday;
        if (isOutsourced) {
            const normalizedOwnerName = acctOwnerName === null || acctOwnerName === void 0 ? void 0 : acctOwnerName.toLowerCase().trim();
            if (!normalizedOwnerName) {
                return res.status(400).json({
                    message: "Account owner name is required for outsourced account",
                });
            }
            const owner = await authServices.verifyUser(normalizedOwnerName);
            if (!owner) {
                console.log("Account owner is not found");
                return res.status(404).json({
                    message: "Account owner not found",
                });
            }
            if (user._id.equals(owner._id)) {
                return res.status(400).json({
                    message: "Account owner cannot outsource own Account",
                });
            }
            accountOwnerId = owner._id;
            accountOwnerName = owner.name;
            accountOwnerLocale = owner.locale;
            accountWorkerId = user._id;
            accountWorkerName = user.name;
        }
        else {
            accountOwnerId = user._id;
            accountWorkerId = user._id;
            accountOwnerName = user.name;
            accountOwnerLocale = user.locale;
        }
        const { rawText, todaysHours, totalSeconds, todayTasks } = await (0, ocrServices_1.extractTextFromImage)(imagePath);
        const safeSeconds = totalSeconds !== null && totalSeconds !== void 0 ? totalSeconds : 0;
        const safeTodaysTask = todayTasks !== null && todayTasks !== void 0 ? todayTasks : 0;
        if (isOutsourced) {
            payForToday = (safeSeconds / 3600) * 2000;
            console.log("PayforToday when outsourced:", payForToday);
        }
        else {
            payForToday = (safeSeconds / 3600) * 3000;
            console.log("payforToday when not outsourced:", payForToday);
        }
        console.log(rawText);
        const report = await (0, reportServices_1.logReport)({
            accountOwner: accountOwnerId,
            accountWorkerName: accountWorkerName,
            accountWorker: accountWorkerId,
            isOutsourced,
            name: accountOwnerName,
            locale: accountOwnerLocale,
            workhour: todaysHours,
            totalSeconds: safeSeconds,
            rawText: rawText,
            imageUrl: cloudUrl,
            date: new Date(),
        });
        fs_1.default.unlink(filePath, (err) => {
            if (err)
                console.log("Error deleting original file:", err);
        });
        const updatedTime = await (0, updateWorkerTime_1.incrementWorkerTotals)(user._id, safeSeconds, safeTodaysTask);
        const totalHours = updatedTime / 3600;
        return res.status(201).json({
            message: "Report uploaded & logged successfully",
            report,
            totalSeconds: updatedTime,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.submitReport = submitReport;
const fetchReports = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const reports = await (0, reportServices_1.getReports)(userId);
        res.json(reports);
    }
    catch (error) {
        next(error);
    }
};
exports.fetchReports = fetchReports;
const getMyReports = async (req, res, next) => {
    try {
        const user = req.user;
        let reports;
        if (user.role === "admin") {
            reports = await (0, reportServices_1.getAllReport)();
        }
        else {
            reports = await (0, reportServices_1.getReports)(user._id);
        }
        return res.status(200).json(reports);
    }
    catch (error) {
        next(error);
    }
};
exports.getMyReports = getMyReports;
const removeReport = async (req, res, next) => {
    try {
        const reportId = req.params.id;
        const user = req.user;
        if (user.role !== "admin") {
            return res.status(403).json({
                message: "Only Admins can delete Reports",
            });
        }
        if (!reportId) {
            return res.status(400).json({
                message: "Report ID is required",
            });
        }
        const deleted = await (0, reportServices_1.deleteReportByAdmin)(reportId);
        if (!deleted) {
            return res.status(404).json({
                message: "Report not found",
            });
        }
        return res.status(200).json({
            message: "Report deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.removeReport = removeReport;
const updateReport = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const user = req.user;
        if (user.role !== "admin") {
            return res.status(403).json({
                message: "Only Admins can delete Reports",
            });
        }
        if (!id) {
            return res.status(400).json({
                message: "Report ID is required",
            });
        }
        if (!updateData) {
            return res.status(400).json({
                message: "Update details are missing",
            });
        }
        const updatedReport = await (0, reportServices_1.updateReportByAdmin)(id, updateData);
        if (!updatedReport) {
            return res.status(404).json({
                message: "Report not found",
            });
        }
        return res.status(200).json({
            message: "Report deleted successfully",
            report: updatedReport,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateReport = updateReport;
//# sourceMappingURL=report.controller.js.map