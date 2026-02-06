// controllers/excelController.ts
import { Request, Response } from "express";
import { ExcelService } from "../utils/logger";
import { Report } from "../database/models/reports.model";
import { Account } from "../database/models/account.model";
import { sequelize } from "../database/config/db"; // Import directly
import { Op } from "sequelize";
import fs from "fs";

const excelService = new ExcelService();

export const downloadMasterSheet = async (req: Request, res: Response) => {
  try {
    const filepath = await excelService.generateMasterSheet({
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      status: req.query.status as any,
    });

    if (!fs.existsSync(filepath)) {
      return res.status(500).json({ error: "File was not generated" });
    }

    const filename = "master_work_hours.xlsx";

    const stat = fs.statSync(filepath);
    res.status(200);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    res.setHeader("Content-Length", stat.size);
    res.setHeader(
      "Access-Control-Expose-Headers",
      "Content-Disposition, Content-Length",
    );

    const stream = fs.createReadStream(filepath);

    stream.pipe(res);

    stream.on("end", () => {
      fs.unlink(filepath, () => {});
    });

    stream.on("error", (err) => {
      console.error("Stream error:", err);
      if (!res.headersSent) res.status(500).end();
    });
  } catch (error: any) {
    console.error("Download master sheet error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
};

export const downloadWorkerReport = async (req: Request, res: Response) => {
  try {
    const workerAccountId = (req as any).user.id;
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
    const filepath = await excelService.generateWorkerReport(
      parseInt(workerAccountId),
      startDate as string,
      endDate as string,
    );

    const filename = `worker_report_${workerAccountId}_${startDate}_to_${endDate}.xlsx`;

    res.download(filepath, filename, (err) => {
      if (err) {
        console.error("Download error:", err);
      }
      setTimeout(() => {
        try {
          if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
          }
        } catch (unlinkErr) {
          console.error("Error deleting temp file:", unlinkErr);
        }
      }, 1000);
    });
  } catch (error: any) {
    console.error("Download worker report error:", error);
    res.status(500).json({
      error: "Failed to generate worker report",
      details: error.message,
    });
  }
};

export const downloadSummaryReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const ownerId = (req as any).user?.id || (req as any).user?.workerId;

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

    const filepath = await excelService.generateSummaryReport(
      ownerId,
      startDate as string,
      endDate as string,
    );

    // Check if file exists
    if (!fs.existsSync(filepath)) {
      return res.status(500).json({ error: "File was not generated" });
    }

    const filename = `summary_report_${startDate}_to_${endDate}.xlsx`;

    // Set headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", fs.statSync(filepath).size);

    // Stream the file
    const stream = fs.createReadStream(filepath);

    stream.on("error", (err) => {
      console.error("Stream error:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to stream file" });
      }
    });

    stream.pipe(res);

    // Cleanup after sending
    res.on("finish", () => {
      setTimeout(() => {
        try {
          if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
          }
        } catch (unlinkErr) {
          console.error("Error deleting temp file:", unlinkErr);
        }
      }, 2000);
    });
  } catch (error: any) {
    console.error("Download summary report error:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Failed to generate summary report",
        details: error.message,
      });
    }
  }
};

export const getAvailableDateRanges = async (req: Request, res: Response) => {
  try {
    const ownerId = (req as any).user?.id || (req as any).user?.workerId;

    // Get account IDs for this owner
    const ownerAccounts = await Account.findAll({
      where: { ownerId },
      attributes: ["id"],
      raw: true,
    });

    const accountIds = ownerAccounts.map((acc: any) => acc.id);

    if (accountIds.length === 0) {
      return res.json({
        minDate: null,
        maxDate: null,
        totalReports: 0,
        message: "No accounts found",
      });
    }

    // Use imported sequelize directly
    const result = await Report.findOne({
      attributes: [
        [sequelize.fn("MIN", sequelize.col("workDate")), "minDate"],
        [sequelize.fn("MAX", sequelize.col("workDate")), "maxDate"],
        [sequelize.fn("COUNT", sequelize.col("id")), "totalReports"],
      ],
      where: {
        accountId: {
          [Op.in]: accountIds,
        },
      },
      raw: true,
    });

    if (!result || !(result as any).totalReports) {
      return res.json({
        minDate: null,
        maxDate: null,
        totalReports: 0,
        message: "No reports available",
      });
    }

    res.json({
      minDate: (result as any).minDate,
      maxDate: (result as any).maxDate,
      totalReports: (result as any).totalReports,
    });
  } catch (error) {
    console.error("Get date ranges error:", error);
    res.status(500).json({ error: "Failed to fetch date ranges" });
  }
};

export const cleanupOldFiles = async (req: Request, res: Response) => {
  try {
    const { days } = req.query;
    const olderThanDays = days ? parseInt(days as string) : 7;

    await excelService.cleanupOldReports(olderThanDays);

    res.json({
      message: `Successfully cleaned up reports older than ${olderThanDays} days`,
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    res.status(500).json({ error: "Failed to cleanup old files" });
  }
};
