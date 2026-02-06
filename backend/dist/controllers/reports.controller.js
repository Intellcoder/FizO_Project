"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReportDetails = exports.removeReport = exports.getAllReportsController = exports.submitNewReport = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const imageResizeService_1 = __importDefault(require("../services/imageResizeService"));
const imageKit_1 = __importDefault(require("../utils/imageKit"));
const ocrServices_1 = require("../services/ocrServices");
const accountServices_1 = require("../services/accountServices");
const reportsServices_1 = require("../services/reportsServices");
const errors_1 = require("../middlewares/errors");
const submitNewReport = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "please upload screenshot/image",
            });
        }
        const user = req.user;
        const { accountId, submitterId, workerId, isOutsourced, workDate } = req.body;
        console.log(req.body);
        const filePath = path_1.default.resolve(req.file.path);
        const uploadResult = await imageKit_1.default.upload({
            file: fs_1.default.readFileSync(filePath),
            fileName: `${user._id}_${Date.now()}_${req.file.originalname}`,
            folder: "/reports",
        });
        const cloudUrl = uploadResult.url;
        const croppedPath = filePath.replace(/(\.[\w\d_-]+)$/i, "_cropped$1");
        if (!fs_1.default.existsSync(filePath)) {
            return res.status(400).json({ message: "uploaded file not found" });
        }
        console.log("passed here 1");
        const imageUrl = await (0, imageResizeService_1.default)(filePath, croppedPath);
        if (!imageUrl || !fs_1.default.existsSync(imageUrl)) {
            fs_1.default.unlink(filePath, () => { });
            return res
                .status(400)
                .json({ message: "No black panel detected in image" });
        }
        console.log("Passed here");
        console.log("imageUrl:", imageUrl);
        const { rawText, todaysHours, totalSeconds, todayTasks } = await (0, ocrServices_1.extractTextFromImage)(imageUrl);
        console.log("totalSeconds:", totalSeconds);
        const workHours = totalSeconds;
        console.log("passed here");
        const report = await (0, accountServices_1.submitReport)(accountId, submitterId, workHours !== null && workHours !== void 0 ? workHours : 0, imageUrl, workerId, workDate, isOutsourced);
        console.log("report:", report);
        return res.status(200).json({
            message: "Report Submitted successfully",
            report,
        });
    }
    catch (error) {
        console.log("error:", error);
        return next((0, errors_1.customError)(error, 500));
    }
};
exports.submitNewReport = submitNewReport;
const getAllReportsController = async (req, res, next) => {
    try {
        const user = req.user;
        const { cutoff } = req.query;
        const cutoffDate = cutoff ? new Date(cutoff) : undefined;
        const reports = await (0, reportsServices_1.getAllReports)(user.id, user.role === "admin", cutoffDate);
        res.status(200).json({
            message: "Reports fetched successfully",
            count: reports.length,
            reports,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllReportsController = getAllReportsController;
const removeReport = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = req.user;
        if (user.role != "admin") {
            return res.status(403).json("You are not Authorised");
        }
        if (!id)
            return res.status(400).json("Report Id is needed");
        const deleted = await (0, reportsServices_1.deleteReport)(Number(id));
        if (!deleted) {
            return res.status(400).json({ message: "Failed to delete Report" });
        }
        return res.status(200).json({ message: "Report Deleted successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.removeReport = removeReport;
const updateReportDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const user = req.user;
        if (user.role != "admin") {
            return res.status(403).json("You are not Authorised");
        }
        if (!id)
            return res.status(400).json("Report Id is needed");
        const updated = await (0, reportsServices_1.updateReport)(Number(id), updates);
        if (!updated) {
            return res.status(400).json({ message: "Failed to update Report" });
        }
        return res.status(200).json({ message: "Report updated successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.updateReportDetails = updateReportDetails;
//# sourceMappingURL=reports.controller.js.map