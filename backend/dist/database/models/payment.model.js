"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentData = void 0;
const mongoose_1 = require("mongoose");
const paymentModel = new mongoose_1.Schema({
    date: {
        type: Date,
        default: Date.now(),
        required: true,
    },
    accountOwner: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
exports.PaymentData = (0, mongoose_1.model)("PaymentData", paymentModel);
//# sourceMappingURL=payment.model.js.map