"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentLogger = paymentLogger;
exports.createPaymentData = createPaymentData;
exports.getPaymentInfo = getPaymentInfo;
exports.getAllPaymentInfo = getAllPaymentInfo;
exports.incrementPayment = incrementPayment;
const payment_model_1 = require("../database/models/payment.model");
async function paymentLogger({ date, accountOwner, totalSeconds, totalAmount, }) {
    const paymentInfo = await payment_model_1.PaymentData.findOneAndUpdate(accountOwner, {
        date,
        totalSeconds,
        totalAmount,
    }, {
        new: true,
        upsert: true,
    });
    return paymentInfo;
}
async function createPaymentData({ date, accountOwner, totalSeconds, totalAmount, }) {
    const paymentData = await payment_model_1.PaymentData.create({
        date,
        accountOwner,
        totalSeconds,
        totalAmount,
    });
    return paymentData;
}
async function getPaymentInfo(accountOwner) {
    return payment_model_1.PaymentData.find({ accountOwner }).populate("accountOwner", "name locale totalSeconds");
}
async function getAllPaymentInfo() {
    return payment_model_1.PaymentData.find().populate("accountOwner", "name locale totalSeconds");
}
async function incrementPayment({ accountOwner, totalSeconds, totalAmount, }) {
    const updatedPayment = await payment_model_1.PaymentData.findOneAndUpdate({ accountOwner }, {
        $inc: {
            totalSeconds,
            totalAmount,
        },
        $set: {
            date: new Date(),
        },
    }, {
        new: true,
        upsert: true,
    });
    return updatedPayment;
}
//# sourceMappingURL=paymentServices.js.map