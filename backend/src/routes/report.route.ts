import { Router } from "express";
import multer from "multer";
import {
  submitReport,
  getMyReports,
  removeReport,
  updateReport,
} from "../controllers/report.controller";
import authMiddleware from "../middlewares/authMiddlewaree";
import {
  sanitizeRequest,
  validateRequest,
} from "../middlewares/validateRequest";

const upload = multer({ dest: "uploads/screenshots" });
const router = Router();

//submit image route
router
  .route("/submit")
  .post(upload.single("file"), authMiddleware, sanitizeRequest, submitReport);

//worker's own reports for logged-in user
router.route("/own-report").get(authMiddleware, getMyReports);

//admin delete report
router
  .route("/report/:id")
  .delete(authMiddleware, validateRequest, sanitizeRequest, removeReport);

//admin update report
router
  .route("/report/:id")
  .patch(authMiddleware, validateRequest, sanitizeRequest, updateReport);

export default router;
