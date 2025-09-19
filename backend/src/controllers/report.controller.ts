import { Request, Response, NextFunction, RequestHandler } from "express";
import { extractTextFromImage } from "../services/ocrServices";
import cropBlackRegion from "../services/imageResizeService";
import {
  logReport,
  getReports,
  getAllReport,
  deleteReportByAdmin,
  updateReportByAdmin,
} from "../services/reportServices";
import path from "path";
import fs from "fs";
import { incrementWorkerTotalTime } from "../services/updateWorkerTime";
import imagekit from "../utils/imageKit";
import { AuthServices } from "../services/authServices";
import { constants } from "fs/promises";

const authServices = new AuthServices();

export const submitReport: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "please upload screenshoot/image",
      });
    }

    const user = (req as any).user; //request user from jwt middleware

    let { isOutsourced, acctOwnerName } = req.body;

    isOutsourced =
      isOutsourced === true ||
      isOutsourced === "true" ||
      isOutsourced === 1 ||
      isOutsourced === "1";

    const filePath = path.resolve(req.file.path);

    //upload image to cloudinary
    // const cloudinaryRes = await cloudinary.uploader.upload(filePath, {
    //   folder: "reports/screenshots",
    // });

    // //storeimage url in database
    // const imageUrl = cloudinaryRes.secure_url;
    // console.log(imageUrl);
    const uploadResult = await imagekit.upload({
      file: fs.readFileSync(filePath),
      fileName: `${user._id}_${Date.now()}_${req.file.originalname}`,
      folder: "/reports",
    });

    const cloudUrl = uploadResult.url;

    //create path for cropped image
    const croppedPath = filePath.replace(/(\.[\w\d_-]+)$/i, "_cropped$1");

    if (!fs.existsSync(filePath)) {
      return res.status(400).json({
        message: "uploaded file not found",
      });
    }

    const imagePath = await cropBlackRegion(filePath, croppedPath);

    if (!imagePath || !fs.existsSync(imagePath)) {
      fs.unlink(filePath, () => {});
      return res.status(400).json({
        message: "No black panel detected in image",
      });
    }

    //extract from ocr services

    ///account parameters
    let accountOwnerId;
    let accountWorkerId;
    let accountWorkerName;
    let accountOwnerName;
    let accountOwnerLocale;
    let payForToday;

    if (isOutsourced) {
      const normalizedOwnerName = acctOwnerName?.toLowerCase().trim();

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
    } else {
      accountOwnerId = user._id;
      accountWorkerId = user._id;
      accountOwnerName = user.name;
      accountOwnerLocale = user.locale;
    }
    //falback
    const { rawText, todaysHours, totalSeconds } = await extractTextFromImage(
      imagePath
    );
    const safeSeconds = totalSeconds ?? 0;
    if (isOutsourced) {
      payForToday = (safeSeconds / 3600) * 2000;
      console.log("PayforToday when outsourced:", payForToday);
    } else {
      payForToday = (safeSeconds / 3600) * 3000;
      console.log("payforToday when not outsourced:", payForToday);
    }

    const report = await logReport({
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

    // remove original image after successful crop
    fs.unlink(filePath, (err) => {
      if (err) console.log("Error deleting original file:", err);
    });

    //update the user total time
    const updatedTime = await incrementWorkerTotalTime(user._id, safeSeconds);

    return res.status(201).json({
      message: "Report uploaded & logged successfully",
      report,
      totalSeconds: updatedTime,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchReports: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user._id;
    const reports = await getReports(userId);
    res.json(reports);
  } catch (error) {
    next(error);
  }
};

export const getMyReports: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;

    let reports;
    if (user.role === "admin") {
      //admin get all reports
      reports = await getAllReport();
    } else {
      reports = await getReports(user._id);
    }
    return res.status(200).json(reports);
  } catch (error) {
    next(error);
  }
};

export const removeReport: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reportId = req.params.id;
    const user = (req as any).user;

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

    const deleted = await deleteReportByAdmin(reportId);

    if (!deleted) {
      return res.status(404).json({
        message: "Report not found",
      });
    }
    return res.status(200).json({
      message: "Report deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateReport: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const user = (req as any).user;

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

    const updatedReport = await updateReportByAdmin(id, updateData);

    if (!updatedReport) {
      return res.status(404).json({
        message: "Report not found",
      });
    }
    return res.status(200).json({
      message: "Report deleted successfully",
      report: updatedReport,
    });
  } catch (error) {
    next(error);
  }
};
