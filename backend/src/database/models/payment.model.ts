import { timeStamp } from "console";
import { Document, Schema, model } from "mongoose";

export interface IPayment {
  date: Date;
  accountOwner: Schema.Types.ObjectId;
  totalSeconds: number;
  totalAmount: number;
}

const paymentModel = new Schema(
  {
    date: {
      type: Date,
      default: Date.now(),
      required: true,
    },
    accountOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalSeconds: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PaymentData = model<IPayment>("PaymentData", paymentModel);
