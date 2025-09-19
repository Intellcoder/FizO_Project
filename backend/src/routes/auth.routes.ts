import { Router } from "express";
import { register, login, getUser } from "../controllers/auth.controllers";
import {
  sanitizeRequest,
  validateRequest,
} from "../middlewares/validateRequest";

const router = Router();

router.route("/auth/register").post(validateRequest, sanitizeRequest, register);
router.route("/auth/login").post(validateRequest, sanitizeRequest, login);
router.route("/auth/me").get(validateRequest, sanitizeRequest, getUser);

export default router;
