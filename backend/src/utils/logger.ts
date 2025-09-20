import { Request, Response } from "express";
import ExcelJS from "exceljs";
import Report from "../database/models/report.model";

function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ].join(":");
}
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
      pivot[date][emp] = g.totalSeconds;
    });

    //track totals per employee
    const totals: Record<string, number> = {};
    employees.forEach((e) => (totals[e] = 0));

    // Excel
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Work Hours Summary");

    // Header row
    sheet.addRow(["Date", ...employees]);

    // Data rows per date
    dates.forEach((d) => {
      const rowData = employees.map((e) => {
        const secs = pivot[d][e];
        totals[e] += secs; // accumulate total
        return formatTime(secs); // format for display
      });
      sheet.addRow([d, ...rowData]);
    });

    // Totals row
    const totalRow = employees.map((e) => formatTime(totals[e]));
    sheet.addRow(["Total", ...totalRow]);
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
