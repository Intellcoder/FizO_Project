"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewAdminExcel = exports.downloadAdminExcel = exports.viewWorkerExcel = exports.downloadWorkerExcel = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const XLSX = __importStar(require("xlsx"));
const downloadWorkerExcel = async (req, res, next) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            return res.status(401).json({
                message: "userId is required",
            });
        }
        const filePath = path_1.default.join(__dirname, "../uploads/excel", `user-${userId}.xlsx`);
        if (!fs_1.default.existsSync(filePath)) {
            return res.status(404).json({
                message: "Excel not found",
            });
        }
        res.download(filePath, `workhours-${userId}.xlsx`);
    }
    catch (error) {
        next(error);
    }
};
exports.downloadWorkerExcel = downloadWorkerExcel;
const viewWorkerExcel = async (req, res, next) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            return res.status(401).json({
                message: "userId is required",
            });
        }
        const filePath = path_1.default.join(__dirname, "../uploads/excel", `user-${userId}.xlsx`);
        if (!fs_1.default.existsSync(filePath)) {
            return res.status(404).json({
                message: "Excel not found",
            });
        }
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        return res.json(data);
    }
    catch (error) {
        next(error);
    }
};
exports.viewWorkerExcel = viewWorkerExcel;
const downloadAdminExcel = async (req, res, next) => {
    try {
        const user = req.user;
        if (user.role !== "admin") {
            return res.status(403).json({
                message: "Only admin can download file",
            });
        }
        const filePath = path_1.default.join(__dirname, "../uploads/excel", `admin.xlsx`);
        if (!fs_1.default.existsSync(filePath)) {
            return res.status(404).json({
                message: "Excel not found",
            });
        }
        res.download(filePath, "all-workhours.xlsx");
    }
    catch (error) {
        next(error);
    }
};
exports.downloadAdminExcel = downloadAdminExcel;
const viewAdminExcel = async (req, res, next) => {
    try {
        const user = req.user;
        if (user.role !== "admin") {
            return res.status(403).json({
                message: "Only admin can download file",
            });
        }
        const filePath = path_1.default.join(__dirname, "../uploads/excel", `admin.xlsx`);
        if (!fs_1.default.existsSync(filePath)) {
            return res.status(404).json({
                message: "Excel not found",
            });
        }
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        return res.status(200).json(data);
    }
    catch (error) {
        next(error);
    }
};
exports.viewAdminExcel = viewAdminExcel;
//# sourceMappingURL=excel.controller.js.map