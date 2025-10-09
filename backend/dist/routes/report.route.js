"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const report_controller_1 = require("../controllers/report.controller");
const authMiddlewaree_1 = __importDefault(require("../middlewares/authMiddlewaree"));
const validateRequest_1 = require("../middlewares/validateRequest");
const upload = (0, multer_1.default)({ dest: "uploads/screenshots" });
const router = (0, express_1.Router)();
router
    .route("/submit")
    .post(upload.single("file"), authMiddlewaree_1.default, validateRequest_1.sanitizeRequest, report_controller_1.submitReport);
router.route("/own-report").get(authMiddlewaree_1.default, report_controller_1.getMyReports);
router
    .route("/report/:id")
    .delete(authMiddlewaree_1.default, validateRequest_1.validateRequest, report_controller_1.removeReport);
router
    .route("/report/:id")
    .patch(authMiddlewaree_1.default, validateRequest_1.validateRequest, report_controller_1.updateReport);
exports.default = router;
//# sourceMappingURL=report.route.js.map