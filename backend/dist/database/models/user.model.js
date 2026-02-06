"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const validator_1 = require("validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const report_model_1 = __importDefault(require("./report.model"));
const payment_model_1 = require("./payment.model");
const userSchema = new mongoose_1.Schema({
    workerId: {
        type: String,
        default: () => (0, uuid_1.v4)(),
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: (value) => (0, validator_1.isEmail)(value),
            message: (props) => `${props.value} is not a valid email address`,
        },
    },
    name: {
        type: String,
        required: true,
    },
    accountName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    locale: {
        type: String,
        required: true,
    },
    totalSeconds: {
        type: Number,
    },
    totalTask: {
        type: Number,
        default: 0,
    },
    role: {
        type: String,
        enum: ["worker", "admin", "client"],
        default: "worker",
    },
    verifyEmailToken: { type: String },
    isVerified: {
        type: Boolean,
        default: false,
    },
    resetPasswordToken: {
        type: String,
        default: undefined,
    },
    resetPasswordExpires: {
        type: Date,
        default: undefined,
    },
}, {
    timestamps: true,
});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    try {
        const salt = await bcryptjs_1.default.genSalt(10);
        this.password = await bcryptjs_1.default.hash(this.password, salt);
        return next();
    }
    catch (error) {
        return next(error);
    }
});
userSchema.methods.comparePassword = async function (password) {
    const passwordMatch = await bcryptjs_1.default.compare(password, this.password);
    return passwordMatch;
};
userSchema.pre("findOneAndDelete", async function (next) {
    const user = await this.model.findOne(this.getFilter());
    if (user) {
        await report_model_1.default.deleteMany({
            $or: [{ accountOwner: user._id }, { accountWorker: user._id }],
        });
        await payment_model_1.PaymentData.deleteMany({ accountOwner: user._id });
    }
    next();
});
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
//# sourceMappingURL=user.model.js.map