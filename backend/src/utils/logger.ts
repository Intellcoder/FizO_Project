import { Request, Response } from "express";
import ExcelJS from "exceljs";
import Report from "../database/models/report.model";

export const exportSummaryReport = async (req: Request, res: Response) => {
  try {
    const grouped = await Report.aggregate([
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

    // Build lists
    const employees = Array.from(new Set(grouped.map((g) => g.worker.name)));
    const dates = Array.from(new Set(grouped.map((g) => g._id.date))).sort();

    // Pivot data
    const pivot: Record<string, Record<string, number>> = {};
    dates.forEach((d) => {
      pivot[d] = {};
      employees.forEach((e) => (pivot[d][e] = 0));
    });

    grouped.forEach((g) => {
      const date = g._id.date;
      const emp = g.worker.name;
      const hours = g.totalSeconds / 3600;
      pivot[date][emp] = hours;
    });

    // Excel
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Work Hours Summary");

    // Header row
    sheet.addRow(["Date", ...employees]);

    // Data rows
    dates.forEach((d) => {
      sheet.addRow([d, ...employees.map((e) => pivot[d][e])]);
    });

    // Stream Excel to response
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=workhours-summary.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
