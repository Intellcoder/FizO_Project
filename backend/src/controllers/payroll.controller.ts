import { Request, Response, NextFunction } from "express";
import { getAllPaymentInfo, getPaymentInfo } from "../services/paymentServices";

export async function getpaymentDetails(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = (req as any).user;

    let paymentInfo;

    if (user.role === "admin") {
      //get all reports
      paymentInfo = getAllPaymentInfo();
    } else {
      paymentInfo = await getPaymentInfo(user._id);
    }

    res.status(200).json({
      success: true,
      data: paymentInfo,
    });
  } catch (error) {
    next(error);
  }
}
