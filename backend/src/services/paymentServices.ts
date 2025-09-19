import { Types } from "mongoose";
import { PaymentData } from "../database/models/payment.model";

interface PaymentDataLogger {
  date: Date;
  accountOwner: Types.ObjectId;
  totalSeconds: number;
  totalAmount: number;
}

export async function paymentLogger({
  date,
  accountOwner,
  totalSeconds,
  totalAmount,
}: PaymentDataLogger) {
  const paymentInfo = await PaymentData.findOneAndUpdate(accountOwner, {
    date,
    totalSeconds,
    totalAmount,
  });
}

export async function createPaymentData({
  date,
  accountOwner,
  totalSeconds,
  totalAmount,
}: PaymentDataLogger) {
  const paymentData = await PaymentData.create({
    date,
    accountOwner,
    totalSeconds,
    totalAmount,
  });
}
