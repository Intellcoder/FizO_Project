"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const router = (0, express_1.Router)();
async function checkDB() {
    try {
        if (mongoose_1.default.connection.readyState !== 1)
            return false;
        const db = mongoose_1.default.connection.db;
        if (!db)
            return false;
        await db.admin().ping();
        return true;
    }
    catch (error) {
        console.error("DB check failed:", error.message);
        return false;
    }
}
router.get("/", async (req, res) => {
    const timeStamp = new Date().toISOString();
    const [dbOk] = await Promise.all([checkDB()]);
    let status = "OK";
    if (!dbOk) {
        status = "DEGRADED";
    }
    if (!dbOk) {
        status = "DOWN";
    }
    res.status(status === "OK" ? 200 : 503).json({
        status,
        services: {
            Server: true,
            database: dbOk,
        },
        timeStamp,
    });
});
exports.default = router;
//# sourceMappingURL=health.route.js.map