import { Router } from "express";
import authMiddleware from "../middlewares/authMiddlewaree";
import {
  getPaymentInfo,
  updatePayment,
} from "../controllers/worker.controller";

const router = Router();

router.route("/payments/my-payments").get(authMiddleware, getPaymentInfo);
//route for updating account details
router.route("/payment/accountdetails").patch(authMiddleware, updatePayment);

export default router;
