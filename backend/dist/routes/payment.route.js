"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddlewaree_1 = __importDefault(require("../middlewares/authMiddlewaree"));
const payroll_controller_1 = require("controllers/payroll.controller");
const router = (0, express_1.Router)();
router.route("/payment").get(authMiddlewaree_1.default, payroll_controller_1.getpaymentDetails);
exports.default = router;
//# sourceMappingURL=payment.route.js.map