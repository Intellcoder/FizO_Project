"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recalculateWorkerTotals = exports.incrementWorkerTotals = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../database/models/user.model"));
const report_model_1 = __importDefault(require("../database/models/report.model"));
const incrementWorkerTotals = async (workerId, newSeconds, newTasks) => {
    const user = await user_model_1.default.findByIdAndUpdate(workerId, {
        $inc: {
            totalSeconds: newSeconds,
            totalTask: newTasks,
        },
    }, { new: true });
    if (!user) {
        throw new Error(`User with ID ${workerId} not found`);
    }
    const totalSeconds = Number(user.totalSeconds) || 0;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return {
        totalSeconds,
        totalTask: user.totalTask || 0,
        hours,
        minutes,
        seconds,
    };
};
exports.incrementWorkerTotals = incrementWorkerTotals;
const recalculateWorkerTotals = async (workerId) => {
    const total = await report_model_1.default.aggregate([
        { $match: { workerId: new mongoose_1.default.Types.ObjectId(workerId) } },
        {
            $group: {
                _id: null,
                totalSeconds: { $sum: "$totalSeconds" },
                totalTask: { $sum: "$taskCount" },
            },
        },
    ]);
    const totalSeconds = total.length > 0 ? total[0].totalSeconds : 0;
    const totalTask = total.length > 0 ? total[0].totalTasks : 0;
    await user_model_1.default.findByIdAndUpdate(workerId, { totalSeconds, totalTask });
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return {
        totalSeconds,
        totalTask,
        hours,
        minutes,
        seconds,
    };
};
exports.recalculateWorkerTotals = recalculateWorkerTotals;
//# sourceMappingURL=updateWorkerTime.js.map