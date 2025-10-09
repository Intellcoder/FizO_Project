"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controllers_1 = require("../controllers/auth.controllers");
const validateRequest_1 = require("../middlewares/validateRequest");
const router = (0, express_1.Router)();
router.route("/auth/register").post(validateRequest_1.validateRequest, validateRequest_1.sanitizeRequest, auth_controllers_1.register);
router.route("/auth/login").post(validateRequest_1.validateRequest, validateRequest_1.sanitizeRequest, auth_controllers_1.login);
router.route("/verify-email").get(auth_controllers_1.verifyEmail);
router.route("/forgot-password").post(auth_controllers_1.requestPasswordReset);
router.route("/reset-password").post(auth_controllers_1.resetPassword);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map