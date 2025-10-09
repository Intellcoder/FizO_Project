"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authMiddleware;
const user_model_1 = __importDefault(require("../database/models/user.model"));
const jwt_1 = require("../utils/jwt");
async function authMiddleware(req, res, next) {
    var _a;
    try {
        console.log(req.body);
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        console.log(token);
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        const decoded = (0, jwt_1.verifyToken)(token);
        const user = await user_model_1.default.findById(decoded);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
}
//# sourceMappingURL=authMiddlewaree.js.map