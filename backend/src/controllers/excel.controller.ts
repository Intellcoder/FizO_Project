import path from "path";
import fs from "fs";
import { Response, Request, NextFunction, RequestHandler } from "express";
import * as XLSX from "xlsx";

export const downloadWorkerExcel: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?._id;

    if (!userId) {
      return res.status(401).json({
        message: "userId is required",
      });
    }
    const filePath = path.join(
      __dirname,
      "../uploads/excel",
      `user-${userId}.xlsx`
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "Excel not found",
      });
    }

    res.download(filePath, `workhours-${userId}.xlsx`);
  } catch (error) {
    next(error);
  }
};

export const viewWorkerExcel: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?._id;

    if (!userId) {
      return res.status(401).json({
        message: "userId is required",
      });
    }
    const filePath = path.join(
      __dirname,
      "../uploads/excel",
      `user-${userId}.xlsx`
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "Excel not found",
      });
    }

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    return res.json(data);
  } catch (error) {
    next(error);
  }
};

export const downloadAdminExcel: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;
    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can download file",
      });
    }

    const filePath = path.join(__dirname, "../uploads/excel", `admin.xlsx`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "Excel not found",
      });
    }

    res.download(filePath, "all-workhours.xlsx");
  } catch (error) {
    next(error);
  }
};

export const viewAdminExcel: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;
    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can download file",
      });
    }

    const filePath = path.join(__dirname, "../uploads/excel", `admin.xlsx`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "Excel not found",
      });
    }

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
