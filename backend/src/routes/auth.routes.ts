import { Router } from "express";
import {
  register,
  login,
  getUser,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
} from "../controllers/auth.controllers";
import {
  sanitizeRequest,
  validateRequest,
} from "../middlewares/validateRequest";

const router = Router();

router.route("/auth/register").post(validateRequest, sanitizeRequest, register);
router.route("/auth/login").post(validateRequest, sanitizeRequest, login);
router.route("/verify-email").get(verifyEmail);
router.route("/forgot-password").post(requestPasswordReset);
router.route("/reset-password").post(resetPassword);

export default router;
