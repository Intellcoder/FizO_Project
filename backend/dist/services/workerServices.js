"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWorker = createWorker;
exports.loginWorker = loginWorker;
exports.getWorkerProfile = getWorkerProfile;
exports.getAllWorkersProfile = getAllWorkersProfile;
exports.updatePaymentInfo = updatePaymentInfo;
exports.requestPasswordReset = requestPasswordReset;
exports.resetPassword = resetPassword;
const paymentInfo_model_1 = require("../database/models/paymentInfo.model");
const worker_model_1 = require("../database/models/worker.model");
const helpers_1 = require("../utils/helpers");
const models_1 = require("../database/models");
const db_1 = require("../database/config/db");
const emailServices_1 = require("./emailServices");
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const sequelize_1 = require("sequelize");
const RESET_TOKEN_EXPIRY = 1000 * 60 * 1000;
async function createWorker(name, email, password, role) {
    const workerExist = await worker_model_1.Worker.findOne({ where: { email } });
    if (workerExist)
        throw new Error("Email already exist");
    const hashed = await (0, helpers_1.hashPassword)(password);
    const worker = await worker_model_1.Worker.create({
        name,
        email,
        password: hashed,
        role,
    });
    const token = await (0, helpers_1.generateToken)({
        id: worker.id,
        workerId: worker.workerId,
    });
    const link = `http://fizotaggers.name.ng/reset`;
    const message = `
  <h2>Welcome ${name} To FizzoTaggers</h2>
  <p>An account has been setup for you by admin</p>
  <p>Click the Link below to reset your password before you login</p>
  <p>Note:Use this same email as reset Email</p>

<p>Your password reset Email is:${email}</p>

  <a href="${link}">Login here</a>
  `;
    await (0, emailServices_1.sendEmail)({
        recipient: email,
        subject: `FizzoTarggers Account Setup`,
        html: message,
    });
    return {
        worker,
        token,
    };
}
async function loginWorker(email, password) {
    const worker = await worker_model_1.Worker.findOne({ where: { email } });
    if (!worker)
        throw new Error("Invalid email or password");
    const isMatch = await (0, helpers_1.comparePassword)(password, worker.password);
    if (!isMatch)
        throw new Error("Invalid Password");
    const token = (0, helpers_1.generateToken)({ id: worker.id, workerId: worker.workerId });
    return { worker, token };
}
async function getWorkerProfile(workerId) {
    const worker = await worker_model_1.Worker.findOne({
        where: { id: workerId },
        attributes: ["id", "name", "email", "role", "workerId"],
        include: [
            { model: paymentInfo_model_1.Payment, as: "payment", attributes: ["totalPay", "totalHours"] },
            {
                model: models_1.Account,
                as: "accounts",
                attributes: ["account_name", "locale", "ownerId"],
            },
            {
                model: models_1.Assignment,
                as: "assignments",
                attributes: [
                    "workerId",
                    "accountId",
                    "type",
                    "active",
                    "startedAt",
                    "endedAt",
                ],
            },
        ],
    });
    if (!worker)
        throw new Error("Worker Profile not found");
    return worker;
}
async function getAllWorkersProfile() {
    const allWorkers = await worker_model_1.Worker.findAll({
        attributes: ["id", "name", "email", "role", "workerId"],
        include: [
            {
                model: paymentInfo_model_1.Payment,
                as: "payment",
                attributes: [
                    "totalPay",
                    "totalHours",
                    "account_name",
                    "account_number",
                    "bank",
                ],
            },
            {
                model: models_1.Account,
                as: "accounts",
                attributes: ["id", "account_name", "locale", "ownerId"],
            },
            {
                model: models_1.Assignment,
                as: "assignments",
                attributes: [
                    "workerId",
                    "accountId",
                    "type",
                    "active",
                    "startedAt",
                    "endedAt",
                ],
                include: [
                    {
                        model: models_1.Account,
                        as: "account",
                        attributes: ["id", "account_name", "locale", "ownerId"],
                    },
                ],
            },
        ],
    });
    return allWorkers;
}
async function updatePaymentInfo(workerId, updates) {
    var _a, _b, _c;
    const transaction = await db_1.sequelize.transaction();
    try {
        const payment = await paymentInfo_model_1.Payment.findOne({
            where: { workerId },
            transaction,
        });
        if (!payment) {
            throw new Error("Payment record not found for this worker");
        }
        await payment.update({
            account_name: (_a = updates.account_name) !== null && _a !== void 0 ? _a : payment.account_name,
            account_number: (_b = updates.account_number) !== null && _b !== void 0 ? _b : payment.account_number,
            bank: (_c = updates.bank) !== null && _c !== void 0 ? _c : payment.bank,
        }, { transaction });
        await transaction.commit();
        return payment;
    }
    catch (error) {
        await transaction.rollback();
        throw new Error(`Failed to update account details: ${error.message}`);
    }
}
async function requestPasswordReset(email, frontendUrl) {
    const user = await worker_model_1.Worker.findOne({ where: { email } });
    if (!user)
        throw new Error("No user found with that email");
    const resetToken = crypto_1.default.randomBytes(32).toString("hex");
    const hashedToken = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY);
    user.resetToken = hashedToken;
    user.resetTokenExpiry = expiresAt;
    await user.save();
    const resetLink = `${frontendUrl}/reset/password?token=${resetToken}&email=${email}`;
    const message = `
    <p>Hello ${user.name || ""},</p>
    <p>You requested a password reset. Click the link below to set a new password:</p>
    <a href="${resetLink}">${resetLink}</a>
    <p>This link will expire in 10 minutes.</p>
  `;
    await (0, emailServices_1.sendEmail)({
        recipient: email,
        subject: `Password Reset Request`,
        html: message,
    });
    return { message: "Password reset link sent" };
}
async function resetPassword(token, email, newPassword) {
    console.log("New password:", newPassword);
    const hashedToken = crypto_1.default.createHash("sha256").update(token).digest("hex");
    const user = await worker_model_1.Worker.findOne({
        where: {
            email,
            resetToken: hashedToken,
            resetTokenExpiry: { [sequelize_1.Op.gt]: new Date() },
        },
    });
    if (!user)
        throw new Error("Invalid or expired reset token");
    const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();
    return { message: "Password updated successfully" };
}
//# sourceMappingURL=workerServices.js.map