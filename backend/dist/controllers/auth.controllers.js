"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.resetPassword = exports.requestPasswordReset = exports.verifyEmail = exports.login = exports.register = void 0;
const authServices_1 = require("../services/authServices");
const paymentServices_1 = require("../services/paymentServices");
const mail_1 = require("utils/mail");
const crypto_1 = __importDefault(require("crypto"));
const user_model_1 = __importDefault(require("database/models/user.model"));
const authServices = new authServices_1.AuthServices();
const register = async (req, res, next) => {
    try {
        const { email, name, password, locale } = req.body;
        if (!email || !password || !name || !locale) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }
        {
        }
        const { user, token } = await authServices.registerUser(email, name, password, locale);
        const paymentData = await (0, paymentServices_1.createPaymentData)({
            date: new Date(),
            accountOwner: user._id,
            totalSeconds: 0,
            totalAmount: 0,
        });
        const verifyToken = crypto_1.default.randomBytes(32).toString("hex");
        user.verifyEmailToken = verifyToken;
        await user.save();
        await (0, mail_1.sendVerificationEmail)(user.email, user.name, verifyToken);
        res.status(201).json({
            message: "Registration successfull",
            token,
            user,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and Password is required" });
        }
        const { token, user } = await authServices.login(email, password);
        res.status(200).json({
            message: "login successfull",
            token,
            user,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const verifyEmail = async (req, res) => {
    try {
        const { token, email } = req.query;
        const user = await user_model_1.default.findOne({ email, verifyEmailToken: token });
        if (!user) {
            return res.status(400).json({
                message: "Invalid Token Or Expired verification link.",
            });
        }
        user.isVerified = true;
        user.verifyEmailToken = undefined;
        await user.save();
        return res
            .status(200)
            .json({ message: "Email verified successfully.You can log in." });
    }
    catch (error) {
        res.status(500).json({
            message: "Server error",
        });
    }
};
exports.verifyEmail = verifyEmail;
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await user_model_1.default.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 60 * 24);
        await user.save();
        await (0, mail_1.sendPasswordResetEmail)(user.email, user.name, resetToken);
        res.status(200).json({ message: "Password reset email sent successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.requestPasswordReset = requestPasswordReset;
const resetPassword = async (req, res) => {
    try {
        const { token, email, newPassword } = req.body;
        const user = await user_model_1.default.findOne({
            email,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user)
            return res.status(400).json({ message: "Invalid or expired token." });
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res
            .status(200)
            .json({ message: "Password reset successful! You can now log in." });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.resetPassword = resetPassword;
const getUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "No token provided",
            });
        }
        const token = authHeader.split(" ")[1];
        const user = await authServices.getUserFromToken(token);
        return res.status(200).json({ user });
    }
    catch (error) {
        return res.status(401).json({
            message: error.message || "unauthorized",
        });
    }
};
exports.getUser = getUser;
//# sourceMappingURL=auth.controllers.js.map