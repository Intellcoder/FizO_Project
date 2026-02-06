// routes/workRoutes.ts
import express from "express";

import { ExcelService } from "../utils/logger";
import {
  downloadMasterSheet,
  downloadSummaryReport,
  downloadWorkerReport,
} from "../controllers/excel.controller";
import authMiddleware from "../middlewares/authMiddlewaree";

const excelllogger = new ExcelService();

const router = express.Router();

// router.post("/log", logWork);
// router.get("/report", exportReport); // raw detailed logs
router.get("/report/summary", downloadMasterSheet); // pivot-style summary
router.get("/report/sheet", authMiddleware, downloadWorkerReport); // pivot-style summary

export default router;
