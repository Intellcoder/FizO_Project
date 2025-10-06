import { Router } from "express";
import authMiddleware from "../middlewares/authMiddlewaree";
import { getpaymentDetails } from "../controllers/payroll.controller";

const router = Router();

router.route("/payment").get(authMiddleware, getpaymentDetails);

export default router;
