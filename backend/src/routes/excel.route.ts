// routes/workRoutes.ts
import express from "express";

import { exportSummaryReport } from "../utils/logger";

const router = express.Router();

// router.post("/log", logWork);
// router.get("/report", exportReport); // raw detailed logs
router.get("/report/summary", exportSummaryReport); // pivot-style summary

export default router;
