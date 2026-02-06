// services/excelService.ts
import ExcelJS from "exceljs";
import { Report } from "../database/models/reports.model";
import { Account } from "../database/models/account.model";
import { Worker } from "../database/models/worker.model";
import { Op } from "sequelize";
import { sequelize } from "database/config/db";
import path from "path";
import fs from "fs";

interface WorkerInfo {
  id: number;
  accountName: string;
  locale: string;
}

interface ExcelGenerationOptions {
  // ownerId: number; // The Worker ID who owns the accounts
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  status?: "pending" | "approved" | "rejected";
}

export class ExcelService {
  /**
   * Generate Master Excel Sheet with all workers' hours
   * Rows = Dates, Columns = Worker Accounts
   */

  async generateMasterSheet(options: ExcelGenerationOptions): Promise<string> {
    try {
      const reports = await Report.findAll({
        include: [
          {
            model: Account,
            as: "workerAccount",
            attributes: ["id", "account_name", "locale"],
            required: true,
          },
        ],
        order: [["workDate", "ASC"]],
      });

      if (!reports.length) throw new Error("No reports found");

      // ---------------------------------------
      // HELPER: Convert seconds to HH:MM:SS
      // ---------------------------------------
      const formatTime = (totalSeconds: number): string => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      };

      // ---------------------------------------
      // 1. GROUP HOURS BY WORKER
      // ---------------------------------------
      const workerMap = new Map<number, { name: string; hours: number[] }>();

      reports.forEach((r) => {
        console.log("WorkMap", workerMap);

        const worker = r.workerAccount as any;
        if (!worker) return;

        if (!workerMap.has(worker.id)) {
          workerMap.set(worker.id, {
            name: worker.account_name,
            hours: [],
          });
        }

        workerMap.get(worker.id)!.hours.push(r.workHours);
      });

      const workers = Array.from(workerMap.values());

      // ---------------------------------------
      // 2. CREATE WORKBOOK
      // ---------------------------------------
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Master Work Hours");

      // ---------------------------------------
      // 3. TITLE
      // ---------------------------------------
      const titleRow = worksheet.addRow(["Work Hours Report (All Records)"]);
      titleRow.font = { bold: true, size: 14 };
      worksheet.mergeCells(1, 1, 1, workers.length);
      worksheet.addRow([]);

      // ---------------------------------------
      // 4. HEADER (WORKER NAMES)
      // ---------------------------------------
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

      // ---------------------------------------
      // 5. FILL WORK HOURS VERTICALLY (FORMATTED)
      // ---------------------------------------
      const maxRows = Math.max(...workers.map((w) => w.hours.length));

      for (let i = 0; i < maxRows; i++) {
        const row = workers.map((w) =>
          w.hours[i] ? formatTime(w.hours[i]) : "",
        );
        worksheet.addRow(row);
      }

      // ---------------------------------------
      // 6. TOTAL ROW
      // ---------------------------------------
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

      // ---------------------------------------
      // 7. AVERAGE ROW
      // ---------------------------------------
      const avgRow = worksheet.addRow(
        workers.map((w) => {
          const avgSeconds = w.hours.length
            ? w.hours.reduce((a, b) => a + b, 0) / w.hours.length
            : 0;
          return formatTime(Math.round(avgSeconds));
        }),
      );
      avgRow.font = { italic: true };

      // ---------------------------------------
      // 8. FORMAT CELLS
      // ---------------------------------------
      worksheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.alignment = { horizontal: "center" };
        });
      });

      // ---------------------------------------
      // 9. AUTO WIDTH
      // ---------------------------------------
      worksheet.columns.forEach((col) => {
        if (!col || !col.eachCell) return;

        let max = 10;
        col?.eachCell({ includeEmpty: true }, (cell) => {
          const len = cell.value ? cell.value.toString().length : 10;
          if (len > max) max = len;
        });
        col!.width = max + 3;
      });

      // ---------------------------------------
      // 10. SAVE FILE
      // ---------------------------------------
      const reportsDir = path.join(process.cwd(), "reports");
      if (!fs.existsSync(reportsDir))
        fs.mkdirSync(reportsDir, { recursive: true });
      console.log("passed here w");
      const filepath = path.join(reportsDir, "master_sheet.xlsx");
      await workbook.xlsx.writeFile(filepath);
      console.log("Passed here");
      return filepath;
    } catch (error) {
      console.error("Excel generation error:", error);
      throw error;
    }
  }

  /**
   * Generate individual worker account report
   */
  async generateWorkerReport(
    workerAccountId: number,
    startDate: string,
    endDate: string,
  ): Promise<string> {
    try {
      const reports = await Report.findAll({
        where: {
          workerId: workerAccountId,
          workDate: {
            [Op.between]: [startDate, endDate],
          },
        },
        include: [
          {
            model: Account,
            as: "workerAccount",
            attributes: ["id", "account_name", "locale"],
          },
        ],
        order: [["workDate", "ASC"]], // Changed to ASC to match master sheet
      });

      if (reports.length === 0) {
        throw new Error(
          "No reports found for this worker in the specified date range",
        );
      }

      // ---------------------------------------
      // HELPER: Convert seconds to HH:MM:SS
      // ---------------------------------------
      const formatTime = (totalSeconds: number): string => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      };

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("My Work Hours");

      const workerAccountName =
        (reports[0].workerAccount as any)?.account_name || "Worker";

      // ---------------------------------------
      // 1. TITLE
      // ---------------------------------------
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

      // ---------------------------------------
      // 2. HEADER (Worker Name)
      // ---------------------------------------
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

      // ---------------------------------------
      // 3. WORK HOURS (Vertical List)
      // ---------------------------------------
      let totalSeconds = 0;
      let approvedSeconds = 0;
      let pendingSeconds = 0;
      let rejectedSeconds = 0;

      reports.forEach((report: any) => {
        const hoursInSeconds = report.workHours;
        const row = worksheet.addRow([formatTime(hoursInSeconds)]);

        // Color code by status
        const cell = row.getCell(1);
        if (report.status === "approved") {
          cell.font = { color: { argb: "FF00B050" } };
          approvedSeconds += hoursInSeconds;
        } else if (report.status === "rejected") {
          cell.font = { color: { argb: "FFFF0000" } };
          rejectedSeconds += hoursInSeconds;
        } else {
          cell.font = { color: { argb: "FFFFC000" } };
          pendingSeconds += hoursInSeconds;
        }

        cell.alignment = { horizontal: "center" };
        totalSeconds += hoursInSeconds;
      });

      // ---------------------------------------
      // 4. TOTAL ROW
      // ---------------------------------------
      worksheet.addRow([]);
      const totalRow = worksheet.addRow([formatTime(totalSeconds)]);
      totalRow.font = { bold: true };
      totalRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF00" },
      };
      totalRow.getCell(1).alignment = { horizontal: "center" };

      // ---------------------------------------
      // 5. AVERAGE ROW
      // ---------------------------------------
      const avgSeconds = reports.length
        ? Math.round(totalSeconds / reports.length)
        : 0;
      const avgRow = worksheet.addRow([formatTime(avgSeconds)]);
      avgRow.font = { italic: true };
      avgRow.getCell(1).alignment = { horizontal: "center" };

      // ---------------------------------------
      // 6. SUMMARY SECTION (Optional detailed stats)
      // ---------------------------------------
      worksheet.addRow([]);
      worksheet.addRow(["Summary"]).font = { bold: true, underline: true };
      worksheet.addRow([`Total Reports: ${reports.length}`]);
      worksheet.addRow([`Approved: ${formatTime(approvedSeconds)}`]);
      worksheet.addRow([`Pending: ${formatTime(pendingSeconds)}`]);
      worksheet.addRow([`Rejected: ${formatTime(rejectedSeconds)}`]);

      // ---------------------------------------
      // 7. AUTO WIDTH
      // ---------------------------------------
      worksheet.columns.forEach((column) => {
        let maxLength = 10;
        column.eachCell?.({ includeEmpty: true }, (cell) => {
          const length = cell.value ? cell.value.toString().length : 10;
          maxLength = Math.max(maxLength, length);
        });
        column.width = Math.min(maxLength + 3, 30);
      });

      // ---------------------------------------
      // 8. SAVE FILE
      // ---------------------------------------
      const reportsDir = path.join(process.cwd(), "reports");
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }

      const filename = `worker_report_${workerAccountId}_${Date.now()}.xlsx`;
      const filepath = path.join(reportsDir, filename);
      await workbook.xlsx.writeFile(filepath);

      return filepath;
    } catch (error) {
      console.error("Worker report generation error:", error);
      throw error;
    }
  }

  /**
   * Generate summary report by owner
   */
  async generateSummaryReport(
    ownerId: number,
    startDate: string,
    endDate: string,
  ): Promise<string> {
    try {
      const { sequelize } = Report;

      // Get all account IDs for this owner
      const ownerAccounts = await Account.findAll({
        where: { ownerId },
        attributes: ["id"],
        raw: true,
      });

      const accountIds = ownerAccounts.map((acc) => acc.id);

      if (accountIds.length === 0) {
        throw new Error("No accounts found for this owner");
      }

      // Get summary statistics
      const summary = await Report.findAll({
        attributes: [
          "status",
          [sequelize!.fn("COUNT", sequelize!.col("Report.id")), "count"],
          [sequelize!.fn("SUM", sequelize!.col("workHours")), "totalHours"],
          [sequelize!.fn("AVG", sequelize!.col("workHours")), "avgHours"],
        ],
        where: {
          accountId: {
            [Op.in]: accountIds,
          },
          workDate: {
            [Op.between]: [startDate, endDate],
          },
        },
        group: ["status"],
        raw: true,
      });

      // Get worker breakdown
      const workerBreakdown = await Report.findAll({
        attributes: [
          "workerId",
          [sequelize!.fn("COUNT", sequelize?.col("Report.id")), "reportCount"],
          [sequelize!.fn("SUM", sequelize?.col("workHours")), "totalHours"],
        ],
        where: {
          accountId: {
            [Op.in]: accountIds,
          },
          workDate: {
            [Op.between]: [startDate, endDate],
          },
          status: "approved",
        },
        include: [
          {
            model: Account,
            as: "workerAccount",
            attributes: ["account_name", "locale"],
          },
        ],
        group: ["workerId", "workerAccount.id"],
        order: [[sequelize!.literal("totalHours"), "DESC"]],
        raw: true,
        nest: true,
      });

      const workbook = new ExcelJS.Workbook();

      // Summary Sheet
      const summarySheet = workbook.addWorksheet("Summary");
      summarySheet.addRow([`Summary Report: ${startDate} to ${endDate}`]);
      summarySheet.addRow([]);
      summarySheet.addRow(["Status", "Count", "Total Hours", "Average Hours"]);

      (summary as any[]).forEach((item: any) => {
        summarySheet.addRow([
          item.status.toUpperCase(),
          item.count,
          parseFloat(item.totalHours || 0),
          parseFloat(item.avgHours || 0),
        ]);
      });

      // Worker Breakdown Sheet
      const workerSheet = workbook.addWorksheet("Worker Breakdown");
      workerSheet.addRow([
        "Worker Account",
        "Locale",
        "Total Reports",
        "Total Hours",
      ]);

      (workerBreakdown as any[]).forEach((item: any) => {
        workerSheet.addRow([
          item.workerAccount.account_name,
          item.workerAccount.locale,
          item.reportCount,
          parseFloat(item.totalHours || 0),
        ]);
      });

      const reportsDir = path.join(process.cwd(), "reports");
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }

      const filename = `summary_report_owner${ownerId}_${Date.now()}.xlsx`;
      const filepath = path.join(reportsDir, filename);
      await workbook.xlsx.writeFile(filepath);

      return filepath;
    } catch (error) {
      console.error("Summary report generation error:", error);
      throw error;
    }
  }

  /**
   * Clean up old report files
   */
  async cleanupOldReports(olderThanDays: number = 7): Promise<void> {
    const reportsDir = path.join(process.cwd(), "reports");
    if (!fs.existsSync(reportsDir)) return;

    const files = fs.readdirSync(reportsDir);
    const now = Date.now();
    const maxAge = olderThanDays * 24 * 60 * 60 * 1000;

    files.forEach((file) => {
      const filepath = path.join(reportsDir, file);
      try {
        const stats = fs.statSync(filepath);
        const age = now - stats.mtimeMs;

        if (age > maxAge) {
          fs.unlinkSync(filepath);
          console.log(`Deleted old report: ${file}`);
        }
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    });
  }
}
