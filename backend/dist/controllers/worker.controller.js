"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleResetPassword = exports.resetPasswordRequest = exports.updatePayment = exports.getPaymentInfo = exports.getMyAccounts = exports.deleteProfile = exports.profile = exports.login = exports.register = void 0;
const workerServices_1 = require("../services/workerServices");
const paymentServices_1 = require("../services/paymentServices");
const accountServices_1 = require("../services/accountServices");
const adminServices_1 = require("../services/adminServices");
const models_1 = require("../database/models");
const models_2 = require("../database/models");
const errors_1 = require("../middlewares/errors");
const register = async (req, res, next) => {
    try {
        const { name, email, password, role, account_name, locale } = req.body;
        console.log(req.body);
        if (!name || !email || !password || !role || !account_name || !locale)
            return res.status(404).json({
                message: "All fileds are required",
            });
        const { worker } = await (0, workerServices_1.createWorker)(name, email, password, role);
        const newAccount = await (0, accountServices_1.createAccount)({
            account_name,
            locale,
            ownerId: worker.id,
            workerId: worker.id,
        });
        const paymentInfo = await (0, paymentServices_1.createPaymentInfo)(worker.id);
        res.status(200).json({
            success: true,
            message: "SignUp successfull",
        });
    }
    catch (error) {
        return next((0, errors_1.customError)(error, 500));
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({
                message: "Email and Password is required",
            });
        console.log("request recived");
        const { worker, token } = await (0, workerServices_1.loginWorker)(email, password);
        return res.status(200).json({
            worker,
            token,
        });
    }
    catch (error) {
        return next((0, errors_1.customError)(error, 500));
    }
};
exports.login = login;
const profile = async (req, res, next) => {
    try {
        const user = req.user;
        const { id, role } = user;
        if (role == "admin") {
            const workers = await (0, workerServices_1.getAllWorkersProfile)();
            return res.status(200).json(workers);
        }
        const worker = await (0, workerServices_1.getWorkerProfile)(id);
        if (!worker)
            return res.status(404).json({
                message: "Worker not found",
            });
        return res.status(200).json(worker);
    }
    catch (error) {
        return next((0, errors_1.customError)(error, 500));
    }
};
exports.profile = profile;
const deleteProfile = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = req.user;
        const workerId = Number(id);
        if (user.role != "admin")
            return res.status(403).json({
                message: "Only Admin can delete User",
            });
        const deleteUser = await (0, adminServices_1.deleteWorker)(workerId);
        if (!deleteUser) {
            return res.status(404).json({ message: "Failed to delete profile" });
        }
        return res.status(200).json({
            message: "Profile deleted",
        });
    }
    catch (error) {
        return next((0, errors_1.customError)(error, 500));
    }
};
exports.deleteProfile = deleteProfile;
const getMyAccounts = async (req, res, next) => {
    try {
        const user = req.user;
        const accounts = await models_2.Account.findAll({
            where: { ownerId: user.id },
            attributes: ["id", "account_name", "locale", "ownerId"],
        });
        if (!accounts) {
            return res.status(404).json({
                meesage: "No account associated with this worker",
            });
        }
        return res.status(200).json(accounts);
    }
    catch (error) {
        return next((0, errors_1.customError)(error, 500));
    }
};
exports.getMyAccounts = getMyAccounts;
const getPaymentInfo = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user)
            return res.status(404).json("User not Authenticated");
        const paymentInfo = await models_1.Payment.findOne({
            where: { workerId: user.id },
            attributes: [
                "totalPay",
                "totalHours",
                "account_name",
                "account_number",
                "bank",
            ],
        });
        if (!paymentInfo)
            return res.status(400).json("User payment record not found");
        return res.status(200).json(paymentInfo);
    }
    catch (error) {
        return next((0, errors_1.customError)(error, 500));
    }
};
exports.getPaymentInfo = getPaymentInfo;
const updatePayment = async (req, res, next) => {
    try {
        console.log("payment request recieved");
        const user = req.user;
        const updates = req.body;
        if (!user)
            return res.status(404).json({
                message: "user not found",
            });
        const workerId = user.id;
        if (!workerId) {
            return res.status(404).json({
                message: "User not found,missing Id",
            });
        }
        const updated = await (0, workerServices_1.updatePaymentInfo)(workerId, updates);
        if (!updated)
            return res.status(400).json({ message: "Payment Update Failed" });
        console.log(updated);
        return res.status(200).json(updated);
    }
    catch (error) {
        return next((0, errors_1.customError)(error, 500));
    }
};
exports.updatePayment = updatePayment;
const resetPasswordRequest = async (req, res, next) => {
    try {
        console.log("Request recsived");
        const { email } = req.body;
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        const result = await (0, workerServices_1.requestPasswordReset)(email, frontendUrl);
        res.status(200).json(result);
    }
    catch (err) {
        return next((0, errors_1.customError)(err, 500));
    }
};
exports.resetPasswordRequest = resetPasswordRequest;
const handleResetPassword = async (req, res, next) => {
    try {
        console.log("request for password");
        console.log(req.body);
        const { token, email, newPassword } = req.body;
        const result = await (0, workerServices_1.resetPassword)(token, email, newPassword);
        res.status(200).json(result);
    }
    catch (err) {
        return next((0, errors_1.customError)(err, 500));
    }
};
exports.handleResetPassword = handleResetPassword;
//# sourceMappingURL=worker.controller.js.map