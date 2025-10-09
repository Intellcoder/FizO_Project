"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const reportSchema = new mongoose_1.Schema({
    accountOwner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    accountWorker: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    id: {
        type: String,
        default: () => (0, uuid_1.v4)(),
        unique: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    name: {
        type: String,
        required: [true, "Please provide account name"],
    },
    locale: {
        type: String,
        required: [true, "Please provide the locale you are working for"],
    },
    workhour: {
        type: String,
        required: [true, "work hour must be provided"],
    },
    totalSeconds: {
        type: Number,
        required: true,
    },
    rawText: {
        type: String,
    },
    isOutsourced: {
        type: Boolean,
        required: true,
    },
    imageUrl: {
        type: String,
    },
}, { timestamps: true });
const Report = (0, mongoose_1.model)("Report", reportSchema);
exports.default = Report;
//# sourceMappingURL=report.model.js.map