"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_1 = require("../utils/logger");
const excel_controller_1 = require("../controllers/excel.controller");
const authMiddlewaree_1 = __importDefault(require("../middlewares/authMiddlewaree"));
const excelllogger = new logger_1.ExcelService();
const router = express_1.default.Router();
router.get("/report/summary", excel_controller_1.downloadMasterSheet);
router.get("/report/sheet", authMiddlewaree_1.default, excel_controller_1.downloadWorkerReport);
exports.default = router;
//# sourceMappingURL=excel.route.js.map