"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendToWorkerExcel = appendToWorkerExcel;
exports.appendToAdminExcel = appendToAdminExcel;
const exceljs_1 = __importDefault(require("exceljs"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const excelDir = path_1.default.join(__dirname, "../../uploads/excel");
if (!fs_1.default.existsSync(excelDir)) {
    fs_1.default.mkdirSync(excelDir, { recursive: true });
}
const WORKER_SHEET = "Work Hours";
const ADMIN_SHEET = "All Work Hours";
function ensureWorksheetExist(workbook, sheetName, isAdmin = false) {
    let worksheet = workbook.getWorksheet(sheetName);
    if (!worksheet) {
        worksheet = workbook.addWorksheet(sheetName);
        worksheet.columns = [
            { header: "Date", key: "date", width: 20 },
            { header: "Name", key: "name", width: 20 },
            { header: "Locale", key: "locale", width: 20 },
            { header: "Work Hour", key: "workhour", width: 35 },
            { header: "Total Seconds", key: "totalSeconds", width: 20 },
        ];
        if (isAdmin) {
            worksheet.getRow(1).font = { bold: true, color: { argb: "1e3a8a" } };
        }
    }
    return worksheet;
}
async function appendToWorkerExcel(data) {
    const filePath = path_1.default.join(excelDir, `user_${data.userId}.xlsx`);
    let workbook = new exceljs_1.default.Workbook();
    if (fs_1.default.existsSync(filePath)) {
        await workbook.xlsx.readFile(filePath);
        console.log("Excel file loaded successfully");
    }
    const worksheet = ensureWorksheetExist(workbook, WORKER_SHEET);
    const excelRowData = {
        date: data.date.toISOString(),
        name: data.name,
        locale: data.locale,
        workhour: data.workhour,
        totalSeconds: data.totalSeconds,
    };
    const excelArrayData = Object.values(excelRowData);
    worksheet.addRow(excelArrayData);
    await workbook.xlsx.writeFile(filePath);
}
async function appendToAdminExcel(data) {
    const filePath = path_1.default.join(excelDir, `admin.xlsx`);
    const workbook = new exceljs_1.default.Workbook();
    if (fs_1.default.existsSync(filePath)) {
        await workbook.xlsx.readFile(filePath);
        console.log("Admin sheet loaded successfuly");
    }
    console.log("Sheets in Admin file before:", workbook.worksheets.map((ws) => ws.name));
    const worksheet = ensureWorksheetExist(workbook, ADMIN_SHEET, true);
    const excelRowData = {
        date: data.date.toISOString(),
        name: data.name,
        locale: data.locale,
        workhour: data.workhour,
        totalSeconds: data.totalSeconds,
    };
    const excelArrayData = Object.values(excelRowData);
    worksheet.addRow(excelArrayData);
    await workbook.xlsx.writeFile(filePath);
}
//# sourceMappingURL=excellogger.js.map