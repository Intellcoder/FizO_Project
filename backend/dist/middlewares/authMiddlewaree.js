"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authMiddleware;
const jwt_1 = require("../utils/jwt");
const worker_model_1 = require("../database/models/worker.model");
async function authMiddleware(req, res, next) {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        const decoded = (0, jwt_1.verifyToken)(token);
        if (!decoded || !decoded.id) {
            return res.status(401).json({ message: "Invalid token payload" });
        }
        const user = await worker_model_1.Worker.findByPk(decoded.id, {
            attributes: ["id", "name", "email", "role"],
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error("Auth error:", error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
//# sourceMappingURL=authMiddlewaree.js.map