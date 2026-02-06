"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllReports = getAllReports;
exports.deleteReport = deleteReport;
exports.updateReport = updateReport;
const sequelize_1 = require("sequelize");
const reports_model_1 = require("../database/models/reports.model");
const worker_model_1 = require("../database/models/worker.model");
const account_model_1 = require("../database/models/account.model");
const assignment_model_1 = require("../database/models/assignment.model");
const db_1 = require("../database/config/db");
const paymentInfo_model_1 = require("../database/models/paymentInfo.model");
async function getAllReports(userId, isAdmin = false, cutoffDate) {
    const whereClause = {};
    if (cutoffDate) {
        whereClause.createdAt = { [sequelize_1.Op.gte]: cutoffDate };
    }
    if (isAdmin) {
        return reports_model_1.Report.findAll({
            where: whereClause,
            include: [
                {
                    model: worker_model_1.Worker,
                    as: "submitter",
                    attributes: ["id", "name", "email", "role"],
                },
                {
                    model: account_model_1.Account,
                    as: "account",
                    attributes: ["id", "account_name", "locale", "ownerId"],
                },
            ],
            order: [["createdAt", "DESC"]],
        });
    }
    const assignments = await assignment_model_1.Assignment.findAll({
        where: { workerId: userId },
        attributes: ["accountId", "startedAt", "endedAt"],
    });
    const conditions = [];
    conditions.push({ submitterId: userId });
    conditions.push({ "$account.ownerId$": userId });
    for (const assign of assignments) {
        conditions.push({
            accountId: assign.accountId,
            createdAt: {
                [sequelize_1.Op.between]: [
                    assign.startedAt,
                    assign.endedAt || new Date(),
                ],
            },
        });
    }
    const reports = await reports_model_1.Report.findAll({
        where: {
            ...whereClause,
            [sequelize_1.Op.or]: conditions,
        },
        include: [
            {
                model: worker_model_1.Worker,
                as: "submitter",
                attributes: ["id", "name", "email", "role"],
            },
            {
                model: account_model_1.Account,
                as: "account",
                attributes: ["id", "account_name", "locale", "ownerId"],
            },
        ],
        order: [["createdAt", "DESC"]],
    });
    return reports;
}
async function deleteReport(id) {
    const transaction = await db_1.sequelize.transaction();
    try {
        const report = await reports_model_1.Report.findOne({ where: { id }, transaction });
        if (!report) {
            throw new Error("Report not found");
        }
        const { workHours, workerId } = report;
        const payment = await paymentInfo_model_1.Payment.findOne({ where: { workerId } });
        if (!payment) {
            throw new Error("Payment record not found");
        }
        payment.totalHours = Math.max(payment.totalHours - workHours, 0);
        payment.save();
        const deletedData = report.get({ plain: true });
        await report.destroy({ transaction });
        await transaction.commit();
        return { message: "Report deleted successfully", report: deletedData };
    }
    catch (error) {
        await transaction.rollback();
        throw new Error(`Failed to delete report: ${error.message}`);
    }
}
async function updateReport(id, updates) {
    const transaction = await db_1.sequelize.transaction();
    try {
        const report = await reports_model_1.Report.findOne({ where: { id }, transaction });
        if (!report) {
            throw new Error("Report not found");
        }
        await report.update(updates, { transaction });
        await transaction.commit();
        return {
            message: "Report updated successfully",
            report: report.get({ plain: true }),
        };
    }
    catch (error) {
        await transaction.rollback();
        throw new Error(`Failed to update report: ${error.message}`);
    }
}
//# sourceMappingURL=reportsServices.js.map