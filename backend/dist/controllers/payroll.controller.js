"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getpaymentDetails = getpaymentDetails;
async function getpaymentDetails(req, res, next) {
    try {
        const user = req.user;
        let paymentInfo;
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