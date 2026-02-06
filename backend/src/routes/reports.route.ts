import { Router } from "express";
import multer from "multer";
import {
  submitNewReport,
  getAllReportsController,
  removeReport,
  updateReportDetails,
} from "../controllers/reports.controller";
import authMiddleware from "../middlewares/authMiddlewaree";
import { sanitizeRequest } from "../middlewares/validateRequest";

const upload = multer({ dest: "uploads/screenshots" });
const router = Router();

//submit image route
router
  .route("/submit")
  .post(
    upload.single("file"),
    authMiddleware,
    sanitizeRequest,
    submitNewReport,
  );

// //worker's own reports for logged-in user
router.route("/own-report").get(authMiddleware, getAllReportsController);

//delete report route
router.route("/report/:id").delete(authMiddleware, removeReport);

//Edit report
router.route("/report/:id").patch(authMiddleware, updateReportDetails);

export default router;
