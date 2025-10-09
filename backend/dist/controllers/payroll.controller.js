"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getpaymentDetails = getpaymentDetails;
const paymentServices_1 = require("services/paymentServices");
async function getpaymentDetails(req, res, next) {
    try {
        const user = req.user;
        let paymentInfo;
        if (user.role === "admin") {
            paymentInfo = (0, paymentServices_1.getAllPaymentInfo)();
        }
        else {
            paymentInfo = await (0, paymentServices_1.getPaymentInfo)(user._id);
        }
        res.status(200).json({
            success: true,
            data: paymentInfo,
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=payroll.controller.js.map