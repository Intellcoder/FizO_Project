import { Router } from "express";
import {
  validateRequest,
  sanitizeRequest,
} from "../middlewares/validateRequest";
import authMiddleware from "../middlewares/authMiddlewaree";
import {
  register,
  login,
  profile,
  deleteProfile,
  getMyAccounts,
  resetPasswordRequest,
  handleResetPassword,
} from "../controllers/worker.controller";
import {
  createNewAccount,
  assignAccount,
} from "../controllers/admin.controller";

const router = Router();

router
  .route("/worker/auth/register")
  .post(validateRequest, sanitizeRequest, register);
router
  .route("/worker/auth/login")
  .post(validateRequest, sanitizeRequest, login);

router.route("/worker/profile").get(authMiddleware, profile);
router.route("/worker/account").post(authMiddleware, createNewAccount);
router.route("/worker/assingaccount").post(authMiddleware, assignAccount);
router.route("/worker/:id").delete(authMiddleware, deleteProfile);
router.route("/worker/myaccounts").get(authMiddleware, getMyAccounts);

router.route("/forgot").post(resetPasswordRequest);
router
  .route("/resetpassword")
  .post(validateRequest, sanitizeRequest, handleResetPassword);

export default router;
