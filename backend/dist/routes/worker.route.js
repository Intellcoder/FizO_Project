"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateRequest_1 = require("../middlewares/validateRequest");
const authMiddlewaree_1 = __importDefault(require("../middlewares/authMiddlewaree"));
const worker_controller_1 = require("../controllers/worker.controller");
const admin_controller_1 = require("../controllers/admin.controller");
const router = (0, express_1.Router)();
router
    .route("/worker/auth/register")
    .post(validateRequest_1.validateRequest, validateRequest_1.sanitizeRequest, worker_controller_1.register);
router
    .route("/worker/auth/login")
    .post(validateRequest_1.validateRequest, validateRequest_1.sanitizeRequest, worker_controller_1.login);
router.route("/worker/profile").get(authMiddlewaree_1.default, worker_controller_1.profile);
router.route("/worker/account").post(authMiddlewaree_1.default, admin_controller_1.createNewAccount);
router.route("/worker/assingaccount").post(authMiddlewaree_1.default, admin_controller_1.assignAccount);
router.route("/worker/:id").delete(authMiddlewaree_1.default, worker_controller_1.deleteProfile);
router.route("/worker/myaccounts").get(authMiddlewaree_1.default, worker_controller_1.getMyAccounts);
router.route("/forgot").post(worker_controller_1.resetPasswordRequest);
router
    .route("/resetpassword")
    .post(validateRequest_1.validateRequest, validateRequest_1.sanitizeRequest, worker_controller_1.handleResetPassword);
exports.default = router;
//# sourceMappingURL=worker.route.js.map