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
  const paymentInfo = await PaymentData.findOneAndUpdate(
    accountOwner,
    {
      date,
      totalSeconds,
      totalAmount,
    },
    {
      new: true,
      upsert: true,
    }
  );
  return paymentInfo;
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
  return paymentData;
}

export async function getPaymentInfo(accountOwner: string) {
  return PaymentData.find({ accountOwner }).populate(
    "accountOwner",
    "name locale totalSeconds"
  );
}

export async function getAllPaymentInfo() {
  return PaymentData.find().populate(
    "accountOwner",
    "name locale totalSeconds"
  );
}

export async function incrementPayment({
  accountOwner,
  totalSeconds,
  totalAmount,
}: Omit<PaymentDataLogger, "date">) {
  const updatedPayment = await PaymentData.findOneAndUpdate(
    { accountOwner },
    {
      $inc: {
        totalSeconds,
        totalAmount,
      },
      $set: {
        date: new Date(),
      },
    },
    {
      new: true,
      upsert: true,
    }
  );

  return updatedPayment;
}
