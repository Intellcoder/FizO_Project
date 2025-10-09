"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportSummaryReport = void 0;
const exceljs_1 = __importDefault(require("exceljs"));
const report_model_1 = __importDefault(require("../database/models/report.model"));
function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [
        hours.toString().padStart(2, "0"),
        minutes.toString().padStart(2, "0"),
        seconds.toString().padStart(2, "0"),
    ].join(":");
}
const exportSummaryReport = async (req, res) => {
    try {
        const grouped = await report_model_1.default.aggregate([
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                        worker: "$accountWorker",
                    },
                    totalSeconds: { $sum: "$totalSeconds" },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id.worker",
                    foreignField: "_id",
                    as: "worker",
                },
            },
            {
                $unwind: "$worker",
            },
        ]);
        const employees = Array.from(new Set(grouped.map((g) => g.worker.name)));
        const dates = Array.from(new Set(grouped.map((g) => g._id.date))).sort();
        const pivot = {};
        dates.forEach((d) => {
            pivot[d] = {};
            employees.forEach((e) => (pivot[d][e] = 0));
        });
        grouped.forEach((g) => {
            const date = g._id.date;
            const emp = g.worker.name;
            const hours = g.totalSeconds / 3600;
            pivot[date][emp] = g.totalSeconds;
        });
        const totals = {};
        employees.forEach((e) => (totals[e] = 0));
        const workbook = new exceljs_1.default.Workbook();
        const sheet = workbook.addWorksheet("Work Hours Summary");
        sheet.addRow(["Date", ...employees]);
        dates.forEach((d) => {
            const rowData = employees.map((e) => {
                const secs = pivot[d][e];
                totals[e] += secs;
                return formatTime(secs);
            });
            sheet.addRow([d, ...rowData]);
        });
        const totalRow = employees.map((e) => formatTime(totals[e]));
        sheet.addRow(["Total", ...totalRow]);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=workhours-summary.xlsx");
        await workbook.xlsx.write(res);
        res.end();
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.exportSummaryReport = exportSummaryReport;
//# sourceMappingURL=logger.js.map