"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const jwt_1 = require("../utils/jwt");
const user_model_1 = __importDefault(require("../database/models/user.model"));
class AuthServices {
    async verifyUser(name) {
        const user = await user_model_1.default.findOne({ name });
        if (!user) {
            throw new Error("user not found");
        }
        return user;
    }
    async getUserFromToken(token) {
        if (!token) {
            throw new Error("No token provided");
        }
        const decoded = (await (0, jwt_1.verifyToken)(token));
        if (!decoded || !decoded.id) {
            throw new Error("Invalid token");
        }
        const user = await user_model_1.default.findById(decoded.id).select("-password");
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    async registerUser(email, name, password, locale) {
        const existingUser = await user_model_1.default.findOne({ email });
        if (existingUser) {
            throw new Error("user already exist");
        }
        const newUser = new user_model_1.default({
            email,
            name,
            password,
            locale,
        });
        await newUser.save();
        const token = (0, jwt_1.generateToken)(newUser._id.toString());
        return { user: newUser, token };
    }
    async login(email, password) {
        const user = await user_model_1.default.findOne({ email }).select("+password");
        if (!user) {
            throw new Error("User does not exist");
        }
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            throw new Error("Incorrect password");
        }
        const token = (0, jwt_1.generateToken)(user._id.toString());
        return {
            token,
            user: user,
        };
    }
}
exports.AuthServices = AuthServices;
//# sourceMappingURL=authServices.js.map