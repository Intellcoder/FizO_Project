"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddlewaree_1 = __importDefault(require("../middlewares/authMiddlewaree"));
const worker_controller_1 = require("../controllers/worker.controller");
const router = (0, express_1.Router)();
router.route("/payments/my-payments").get(authMiddlewaree_1.default, worker_controller_1.getPaymentInfo);
router.route("/payment/accountdetails").patch(authMiddlewaree_1.default, worker_controller_1.updatePayment);
exports.default = router;
//# sourceMappingURL=payment.route.js.map