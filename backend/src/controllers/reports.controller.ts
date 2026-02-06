import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import cropBlackRegion from "../services/imageResizeService";
import imagekit from "../utils/imageKit";
import { extractTextFromImage } from "../services/ocrServices";
import { submitReport } from "../services/accountServices";
import {
  getAllReports,
  deleteReport,
  updateReport,
} from "../services/reportsServices";
import { customError } from "../middlewares/errors";

export const submitNewReport = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "please upload screenshot/image",
      });
    }

    const user = (req as any).user; // from JWT middleware
    const { accountId, submitterId, workerId, isOutsourced, workDate } =
      req.body;
    console.log(req.body);
    const filePath = path.resolve(req.file.path);

    const uploadResult = await imagekit.upload({
      file: fs.readFileSync(filePath),
      fileName: `${user._id}_${Date.now()}_${req.file.originalname}`,
      folder: "/reports",
    });

    const cloudUrl = uploadResult.url;

    const croppedPath = filePath.replace(/(\.[\w\d_-]+)$/i, "_cropped$1");

    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ message: "uploaded file not found" });
    }

    console.log("passed here 1");
    const imageUrl = await cropBlackRegion(filePath, croppedPath);

    if (!imageUrl || !fs.existsSync(imageUrl)) {
      fs.unlink(filePath, () => {});
      return res
        .status(400)
        .json({ message: "No black panel detected in image" });
    }
    console.log("Passed here");
    console.log("imageUrl:", imageUrl);
    const { rawText, todaysHours, totalSeconds, todayTasks } =
      await extractTextFromImage(imageUrl);

    console.log("totalSeconds:", totalSeconds);
    const workHours = totalSeconds;
    console.log("passed here");
    const report = await submitReport(
      accountId,
      submitterId,
      workHours ?? 0,
      imageUrl,
      workerId,
      workDate,
      isOutsourced,
    );

    console.log("report:", report);
    return res.status(200).json({
      message: "Report Submitted successfully",
      report,
    });
  } catch (error) {
    console.log("error:", error);
    return next(customError(error, 500));
  }
};

export const getAllReportsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = (req as any).user;
    const { cutoff } = req.query;

    const cutoffDate = cutoff ? new Date(cutoff as string) : undefined;

    const reports = await getAllReports(
      user.id,
      user.role === "admin",
      cutoffDate,
    );

    res.status(200).json({
      message: "Reports fetched successfully",
      count: reports.length,
      reports,
    });
  } catch (error) {
    next(error);
  }
};

export const removeReport = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    if (user.role != "admin") {
      return res.status(403).json("You are not Authorised");
    }

    if (!id) return res.status(400).json("Report Id is needed");

    const deleted = await deleteReport(Number(id));

    if (!deleted) {
      return res.status(400).json({ message: "Failed to delete Report" });
    }
    return res.status(200).json({ message: "Report Deleted successfully" });
  } catch (error) {
    next(error);
  }
};

//controller to update report
export const updateReportDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const user = (req as any).user;

    if (user.role != "admin") {
      return res.status(403).json("You are not Authorised");
    }

    if (!id) return res.status(400).json("Report Id is needed");

    const updated = await updateReport(Number(id), updates);

    if (!updated) {
      return res.status(400).json({ message: "Failed to update Report" });
    }
    return res.status(200).json({ message: "Report updated successfully" });
  } catch (error) {
    next(error);
  }
};
