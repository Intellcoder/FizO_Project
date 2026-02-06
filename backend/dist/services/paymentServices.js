"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentInfo = createPaymentInfo;
exports.updateWorkerPay = updateWorkerPay;
const paymentInfo_model_1 = require("../database/models/paymentInfo.model");
async function createPaymentInfo(workerId) {
    console.log(workerId);
    const paymentDetails = await paymentInfo_model_1.Payment.create({
        workerId: workerId,
    });
    return paymentDetails;
}
async function updateWorkerPay(workerId, payToAdd, totalHours, t) {
    const [payment, created] = await paymentInfo_model_1.Payment.findOrCreate({
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
//# sourceMappingURL=paymentServices.js.map