import { Payment } from "../database/models/paymentInfo.model";

export async function createPaymentInfo(workerId: number) {
  console.log(workerId);
  const paymentDetails = await Payment.create({
    workerId: workerId,
  });
  return paymentDetails;
}

export async function updateWorkerPay(
  workerId: number,
  payToAdd: number,
  totalHours: number,
  t: any
) {
  const [payment, created] = await Payment.findOrCreate({
    where: { workerId },
    defaults: { totalPay: payToAdd, workerId: Number(workerId), totalHours },
    transaction: t,
  });

  if (!created) {
    payment.totalPay += payToAdd;
    await payment.save({ transaction: t });
  }

  return payment;
}
