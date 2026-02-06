"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const reports_controller_1 = require("../controllers/reports.controller");
const authMiddlewaree_1 = __importDefault(require("../middlewares/authMiddlewaree"));
const validateRequest_1 = require("../middlewares/validateRequest");
const upload = (0, multer_1.default)({ dest: "uploads/screenshots" });
const router = (0, express_1.Router)();
router
    .route("/submit")
    .post(upload.single("file"), authMiddlewaree_1.default, validateRequest_1.sanitizeRequest, reports_controller_1.submitNewReport);
router.route("/own-report").get(authMiddlewaree_1.default, reports_controller_1.getAllReportsController);
router.route("/report/:id").delete(authMiddlewaree_1.default, reports_controller_1.removeReport);
router.route("/report/:id").patch(authMiddlewaree_1.default, reports_controller_1.updateReportDetails);
exports.default = router;
//# sourceMappingURL=reports.route.js.map